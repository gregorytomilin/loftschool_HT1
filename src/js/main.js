import '../sass/main.scss';
import {createWS} from './modules/ws';
import templateMessage from '../views/message.hbs';
import templateMessageMy from '../views/messageMy.hbs';
import templateUser from '../views/user.hbs';
let myID = '';
let $usersBlock = document.querySelector('.users_block');
let $users_quantity = document.querySelector('.users_quantity');
let $registrationForm = document.querySelector('.registrationForm');

if ( localStorage.getItem('myID') !== null && localStorage.getItem('myID') !== ''){
        myID = localStorage.getItem('myID');
        $registrationForm.style.display = 'none';
    }

Date.prototype.format = function(format = 'yyyy-mm-dd') {
    const replaces = {
        yyyy: this.getFullYear(),
        mm: ('0'+(this.getMonth() + 1)).slice(-2),
        dd: ('0'+this.getDate()).slice(-2),
        hh: ('0'+this.getHours()).slice(-2),
        MM: ('0'+this.getMinutes()).slice(-2),
        ss: ('0'+this.getSeconds()).slice(-2)
    };
    let result = format;
    for(const replace in replaces){
        result = result.replace(replace,replaces[replace]);
    }
    return result;
};

var container = document.querySelector('.messages');

var ws = createWS("ws://localhost:8081", {

    // Обработка входящих сообщений от сервера

    // Получено новое сообщение
    'newMessage': (data, ws) => {

        // console.log(data.message.userID);


        if(myID === data.message.userID){
            container.innerHTML += templateMessageMy(data.message);

        } else {
            container.innerHTML += templateMessage(data.message);
        }
        let lastMessage = container.lastElementChild;

        for (let child of $usersBlock.children){
            if (child.dataset.userid === lastMessage.dataset.userid){

                let userPhoto = child.children[0].innerHTML;

                for (let childMessage of lastMessage.children){

                    if (childMessage.classList.contains("message__userPhoto")){
                        childMessage.innerHTML = userPhoto;
                    }
                }

            }
        }

        if(lastMessage.previousElementSibling !== null  && lastMessage.dataset.userid === lastMessage.previousElementSibling.dataset.userid){

            for (let child of lastMessage.children){

                if (child.classList.contains("message__userPhoto")){
                    child.style.opacity = '0'
                }
            }
        }

        container.scrollTop = container.scrollHeight;
    },

    // Зарегистрировался новый пользователь
    'newUser': (data, ws) => {
        $usersBlock.innerHTML += templateUser(data);
        console.log(data);
        getQuantity();

    },

    'UsefulClient': (data, ws) => {
        console.log(data.messages)

    },

    'helloFromServer': (data, ws) => {

        alert(data.messages)
    },


    // Передача всех пользователей из базы
    'getUsers': (data, ws)=>{
        data.users.forEach(user => {
            $usersBlock.innerHTML += templateUser(user);

        });

        getQuantity();

    },
    // Передача всех сообщений из базы
    'getMessages': (data, ws)=>{




       data.messages.forEach(message => {

           if(myID === message.userID){
               container.innerHTML += templateMessageMy(message);
           } else {
               container.innerHTML += templateMessage(message);
           }
           let lastMessage = container.lastElementChild;

           for (let child of $usersBlock.children){

               if (child.dataset.userid === lastMessage.dataset.userid){


                   let userPhoto = child.children[0].innerHTML;

                   for (let childMessage of lastMessage.children){

                       if (childMessage.classList.contains("message__userPhoto")){
                           childMessage.innerHTML = userPhoto;
                       }
                   }

               }
           }


       });


        sameID();

        container.scrollTop = container.scrollHeight;
    },
    'updatePhoto': (data, ws)=>{


        for (let child of $usersBlock.children){
            if(child.dataset.userid === data.user.userID){
                child.children[0].innerHTML = `<img src='${data.user.userPhoto}' alt="">`
            }
        }
        let messages = document.querySelector('.messages');

        for (let message of messages.children){
            if (message.dataset.userid === data.user.userID){
                for (let child of message.children){
                    if (child.classList.contains('message__userPhoto')){
                        child.innerHTML = `<img src='${data.user.userPhoto}' alt="">`
                    }
                }
            }
        }
    }

});

ws.onopen = function() {
    console.log("Соединение установлено.");
    let btn = document.querySelector('#send');
    let input = document.querySelector('#input');
    let $registrName = document.querySelector('.registrName');
    let $registrPseudonme = document.querySelector('.registrPseudonme');
    let $checkInBtn = document.querySelector('.checkInBtn');

    //обработчик кнопки "Регистрации(Войти)"
    $checkInBtn.addEventListener('click', ()=>{
    if ($registrName.value === '' || $registrPseudonme.value ===''){
        alert('Неободимо заполнить все поля')
        } else{
        //Отправка на сервер данных Нового пользователя
        ws.send(JSON.stringify({
            payload: 'newUser',
            data: {
                user: {
                    userName: $registrName.value,
                    userID: $registrPseudonme.value,
                }
            }
        }));
        myID = $registrPseudonme.value;
        $registrationForm.style.display = 'none';
        $registrName.value = '';
        $registrPseudonme.value = '';
        container.scrollTop = container.scrollHeight;
        localStorage.setItem('myID', myID);
    }




    });
    //!Конец - обработчик кнопки "Регистрации(Войти)"


    //обработчики кнопки "Отправить"
    input.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
            sendMessage();
        }
        });
    btn.addEventListener('click', ()=>{
        sendMessage();
    });

    //Функция отправки сообщения на сервер

    function sendMessage() {

        if (myID === ''){
            alert('Необходимо зарегистрироваться');
            $registrationForm.style.display = 'block'
        }
        else{
            ws.send(JSON.stringify({
                payload: 'newMessage',
                data: {
                    message: {
                        text: input.value,
                        time: (new Date()).format('hh:MM'),
                        userID: myID,
                    }
                }
            }));

            input.value = '';

            container.scrollTop = container.scrollHeight;
        }

    }
    //!Конец - Функция отправки сообщения на сервер

    // Отправка фото на сервер
    const form = document.querySelector('form');
    form.addEventListener('submit', async function (e){
        e.preventDefault();

        const formData = new FormData(form);

        formData.append('id', localStorage.getItem('myID'));

        const response = await fetch('http://localhost:8081/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.userID) {
            ws.send(JSON.stringify({
                payload: 'updatePhoto',
                data: {
                    id: data.userID
                }
            }))
        }
    })
    // !Конец - Отправка фото на сервер

};
function getQuantity() {
    let usersQuantity = $usersBlock.children.length;
    $users_quantity.innerHTML = `${usersQuantity} участников`
}
function sameID(){
        let $messages = document.querySelectorAll('[data-userid]');
        for (let message of $messages){

            if (message.previousElementSibling !== null){

                    if (message.dataset.userid === message.previousElementSibling.dataset.userid){

                        // console.log(message.children);


                        for (let child of message.children){

                            if (child.classList.contains("message__userPhoto")){
                                child.style.opacity = '0'
                            }
                        }
                    }
                }
                }

}