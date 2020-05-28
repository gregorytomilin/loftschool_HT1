
// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
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



//Иницилизация Яндекс Карт
ymaps.ready(init);

async function geoDecoder(coords) {
    let response = await ymaps.geocode(coords);

    return response.geoObjects.get(0).getAddressLine();
}


let coords = [];
let placemarks = [];
let myMap;
let address;
let input_Name = document.querySelector('.input_name');
let input_PlaceName = document.querySelector('.input_place');
let input_feedback = document.querySelector('.input_message');
let output_Feedbacks = document.querySelector('.placemarkForm__feedbacks');
let buttonAdd = document.querySelector('.add');
let placemarkForm = document.querySelector('.placemarkForm');
let closeForm = document.querySelector('.placemarkForm__header__closeButton');


closeForm.addEventListener('click',()=>{
    placemarkForm.style.display = 'none';
});

if (localStorage.getItem('feedbacks') !== null) {
    placemarks =JSON.parse(localStorage.getItem('feedbacks'));
} else {
    placemarks = [];
}


document.addEventListener('click',async (e)=>{
    // console.log(e.target.tagName);

    if(e.target.classList.value === 'balloon_href' && e.target.tagName === 'A'){
        coords[0] = +e.target.dataset.coordsn;
        coords[1] = +e.target.dataset.coordsf;
        address = await geoDecoder(coords);
        document.querySelector('.placemarkForm__header__address_name').innerHTML = address;

        document.querySelector('.ymaps-2-1-76-balloon__close').click();

        output_Feedbacks.innerHTML = '';
        for (let i = 0; i < placemarks.length; i++) {
            if (placemarks[i].latitude === coords[0] && placemarks[i].longitude === coords[1]) {
                output_Feedbacks.innerHTML += placemarks[i].balloonContent;
            }
        }
        placemarkForm.style.display = 'block';

        console.log('из ссылки', coords)
    }



});



let geoObjects = [];


function init(){
    // Создание карты.
    myMap = new ymaps.Map("map", {
        center: [59.94, 30.32],
        zoom: 14,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });


    for (let i=0; i<placemarks.length; i++) {

        geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude],
            {
                hintContent: `<div class="map__hint">${placemarks[i].hintContent}</div>`,
                balloonContent: `${placemarks[i].balloonContent}`,
                balloonContentHeader: `${placemarks[i].balloonContentHeader}`
            },
            {
                iconLayout: 'default#image',
                iconImageHref: 'img/icon.png',
                iconImageSize: [25, 35],
            }



        );

        geoObjects[i].events.add('click', async(e) => {
            // coords = [];
            console.log('поштучно', coords);
            e.preventDefault();
            coords = [placemarks[i].latitude, placemarks[i].longitude];
            address = await geoDecoder(coords);
            document.querySelector('.placemarkForm__header__address_name').innerHTML = address;
            output_Feedbacks.innerHTML = '';
            for (let i = 0; i < placemarks.length; i++) {
                if (placemarks[i].latitude === coords[0] && placemarks[i].longitude === coords[1]) {
                    output_Feedbacks.innerHTML += placemarks[i].balloonContent;
                }
            }
            placemarkForm.style.display = 'block';
            console.log('поштучно', coords)
        });



     }






     // создание кластера
    var clusterer = new ymaps.Clusterer({
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        clusterDisableClickZoom: true,
      });

    myMap.geoObjects.add(clusterer);
    clusterer.add(geoObjects);


    // обработка клика по карте
    myMap.events.add('click', async function (e) {
        // Получение координат щелчка
        coords = e.get('coords');
        output_Feedbacks.innerHTML = '';
        address = await geoDecoder(coords);

        document.querySelector('.placemarkForm__header__address_name').innerHTML = address;
        placemarkForm.style.display = 'block';

    });






//

    buttonAdd.addEventListener('click',()=> {


        output_Feedbacks.innerHTML = '';

        // Добавление в массив свой массив placemarks
        placemarks.push({
                latitude: coords[0],
                longitude: coords[1],
                hintContent: address,
                balloonContent: `<span class="feed_name">${input_Name.value}</span> <span class="feed_place">${input_PlaceName.value}</span> <span class="feed_date">${(new Date()).format('dd.mm.yyyy hh:MM')}</span> <br> <span class="feed_feed">${input_feedback.value}<br>`,
                balloonContentHeader: `${input_PlaceName.value} <br><a href = "#" class="balloon_href" data-coordsn="${coords[0]}" data-coordsf="${coords[1]}">${address}</a><br>`,
            },
        );


        // Создание новой placemark
        let placemark = new ymaps.Placemark(coords,
            {
                hintContent: `<div class="map__hint">${address}</div>`,
                balloonContent: `${placemarks[placemarks.length - 1].balloonContent}`,
                balloonContentHeader: `${placemarks[placemarks.length - 1].balloonContentHeader}`,
            },

            {
                iconLayout: 'default#image',
                iconImageHref: 'img/icon.png',
                iconImageSize: [25, 35],
            }
        );



        output_Feedbacks.innerHTML = '';
        for (let i = 0; i < placemarks.length; i++) {
            if (placemarks[i].latitude === coords[0] && placemarks[i].longitude === coords[1]) {
                output_Feedbacks.innerHTML += placemarks[i].balloonContent;

            } else {
                // output_Feedbacks.innerHTML = '...отзывов пока нет';
            }
        }


        // обработчик кликов по placemark
        placemark.events.add('click', async(e) => {
            //Убираем событие по умолчанию (вспытие балуна)
            e.preventDefault();
            coords = e.get('target').geometry._coordinates;
            address = await geoDecoder(coords);
            document.querySelector('.placemarkForm__header__address_name').innerHTML = address;
            output_Feedbacks.innerHTML = '';
            for (let i = 0; i < placemarks.length; i++) {
                if (placemarks[i].latitude === coords[0] && placemarks[i].longitude === coords[1]) {
                    output_Feedbacks.innerHTML += placemarks[i].balloonContent;
                }
            }

            //Открываем форму с отзывами
            placemarkForm.style.display = 'block';





        });


        // добавление точки на карту

        geoObjects.push(placemark);
        // console.log('Геообъекты: ', geoObjects);
        // console.log(myMap.geoObjects);


        // добавление в кластер

        clusterer.add(geoObjects);
        // console.log(coords);

        clusterer.events.add('click', function (e) {
            // placemarkForm.style.display = 'none';
            // console.log(e.get('target').geometry._coordinates);




        });

        // clusterer.events.add('balloonclose', function () {alert(1)});



        clearInputs()

        localStorage.setItem('feedbacks', JSON.stringify(placemarks));
    })






};


function clearInputs() {
    input_Name.value = '';
    input_PlaceName.value = '';
    input_feedback.value = '';
};






