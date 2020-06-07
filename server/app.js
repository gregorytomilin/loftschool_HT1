const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const db = require('./database');
const formidable = require('formidable');
const path = require('path');

const server = http.createServer((req, res)=>{
    if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
        // parse a file upload
        const form = formidable({ multiples: true, uploadDir: path.join(__dirname, 'static')});

        form.parse(req, (err, fields, files) => {
            if (err) throw err;
            if (files) {
                fs.renameSync(files.file.path, path.join(__dirname, 'static', files.file.name));
                db.get('users').find({ userID: fields.id }).assign({ userPhoto: `http://localhost:8081/static/${files.file.name}`}).write();

                res.setHeader('Access-Control-Allow-Origin', '*');

                return res.end(JSON.stringify({
                    userID: fields.id
                }));
            }
        });
    }


    if (req.url.includes('.jpg')){
        console.log('адрес картинки', req.url);
        res.end(fs.readFileSync(path.join(__dirname, req.url)))
    }

    // res.statusCode = 404;
    // res.end('404 not found');
});

const wss = new WebSocket.Server({ server });

var payloads = {

    'newMessage': (data, ws)=>{
        db.get('messages').push(data.message).write();
        wss.clients.forEach(client => {
            client.send(JSON.stringify({
                payload: 'newMessage',
                data: data
            }))
        });
    },

    'newUser': (data, ws)=> {
        let currentUser = db.get('users').find({userID:data.user.userID}).value();


        // console.log(ws);


        if (currentUser){
            ws.send(JSON.stringify({
                payload: 'UsefulClient',
                data: {
                    messages: 'Существующий юзер',
                    login: false,
                }
            }));
        }
        else {

            const user = {
                userName: data.user.userName,
                userID: data.user.userID,
                userPhoto: 'https://pbs.twimg.com/media/DuiIwDxXgAAn0jZ.jpg'
            };
            // console.log(user);
            db.get('users').push(user).write();

            ws.send(JSON.stringify({
                payload: 'helloFromServer',
                data: {
                    messages: 'Добро пожаловать в чат'
                }
            }));
            data.user.userPhoto = user.userPhoto;
            wss.clients.forEach(client => {
                client.send(JSON.stringify({
                    payload: 'newUser',
                    data: user,
                }))
            });
        }
        },
    'updatePhoto': (data, ws) => {
        const user = db.get('users').find({userID: data.id}).value();

        wss.clients.forEach(client => {
            client.send(JSON.stringify({
                payload: 'updatePhoto',
                data: {
                    user
                }
            }))
        });
    }

};


wss.on('connection', function connection(ws) {

    ws.send(JSON.stringify({
        payload: 'getUsers',
        data: {
            users: db.get('users').value()
        }
    }));
    ws.send(JSON.stringify({
        payload: 'getMessages',
        data: {
            messages: db.get('messages').value()
        }
    }));



    ws.on('message', function incoming(message) {
        var mes = JSON.parse(message);

        payloads[mes.payload](mes.data, ws);
    });

    // ws.on('close', ()=>{
    //
    // })

});


// wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//         var mes = JSON.parse(message);
//
//         payloads[mes.payload](mes.data, ws);
//     });
// });



server.listen(8081, ()=>{
    console.log('server is run on port 8081')
});