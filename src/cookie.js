/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function(e) {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    let searchResult = {};
    console.log(e.target.value)


});


let tableBody = document.querySelector('tbody');
let buttonDelete = document.createElement('button');
buttonDelete.innerHTML = 'удалить';

function isMatching(full, chunk) {
    return full.toUpperCase().includes(chunk.toUpperCase());
}

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"

    document.cookie = `${addNameInput.value}=${addValueInput.value};`;
    cookieLoadTable()

});

let cookieObj;
function cookieLoadTable() {

                cookieObj = document.cookie.split('; ').reduce((prev,curr)=>{
                const [name, value] = curr.split('=');
                prev[name] = value;
                return prev;
            }, {});


        tableBody.innerHTML = '';
        if (cookieObj === {}){
            tableBody.innerHTML = '';
        } else{
            for (let cookieUnit in cookieObj) {
                tableBody.innerHTML += `<tr><td>${cookieUnit}</td><td>${cookieObj[cookieUnit]}</td><td><button>Удалить</button></td></tr>`}
            }
        }

document.body.addEventListener('click',(e)=>{

    if(e.target.innerText === 'Удалить'){
        let deleteName = e.target.parentNode.parentNode.children[0].innerText;
        deleteCookie (deleteName);
        cookieLoadTable();
    }
});

cookieLoadTable();
console.log(cookieObj);

function deleteCookie (cookieName) {
    let cookie_date = new Date ( );  // Текущая дата и время
    cookie_date.setTime ( cookie_date.getTime() - 1 );
    document.cookie = cookieName += "=; expires=" + cookie_date.toGMTString();
}
