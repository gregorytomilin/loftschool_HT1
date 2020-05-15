/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {

    return new Promise((resolve)=>{
        setTimeout(()=>{resolve()}, seconds*1000)
    })

}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */


// 1й вариант
// function loadAndSortTowns() {
//     return new Promise(function (resolve, reject) {
//         let xhr = new XMLHttpRequest();
//         xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
//         xhr.responseType = 'json'; //формат получаемого от сервера файла
//         xhr.send();//отправка запроса на сервер
//
//         xhr.addEventListener('load', () => {
//             if(xhr.status>400){
//                 reject(()=>console.log('ошибка'))
//             } else {
//                 let towns = xhr.response;
//                 const townsFiltered = towns.sort(function (a, b) {
//                     if (a.name > b.name) {
//                         return 1;
//                     }
//                     if (a.name < b.name) {
//                         return -1;
//                     }});
//
//
//                 resolve(townsFiltered)
//             } // конец if проверки
//         });// конец addEventListener
//     });// конец промиса
// }// конец функции loadAndSortTowns




// 2й вариант
function loadAndSortTowns() {
    return new Promise((resolve) => {
            fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
                .then(towns => towns.json())
                .then(towns => {
                    let townsF = towns.sort((a, b) => {
                        if (a.name > b.name) {
                            return 1
                        }
                        if (a.name < b.name) {
                            return -1
                        }
                    });
                    return townsF
                })
                .then(towns=>resolve(towns))



        }
    )
}// конец функции loadAndSortTowns


export {
    delayPromise,
    loadAndSortTowns
};
