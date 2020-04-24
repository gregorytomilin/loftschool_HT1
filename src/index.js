/* ДЗ 1 - Функции */

/*
 Задание 1:

 1.1: Добавьте к функции параметр с любым именем
 1.2: Функция должна возвращать аргумент, переданный ей в качестве параметра

 Пример:
   returnFirstArgument(10) вернет 10
   returnFirstArgument('привет') вернет `привет`

 Другими словами: функция должна возвращать в неизменном виде то, что поступает ей на вход
 */
function returnFirstArgument(b) {
    return b
}

/*
 Задание 2:

 2.1: Функция должна возвращать сумму переданных аргументов

 Пример:
   sumWithDefaults(10, 20) вернет 30
   sumWithDefaults(2, 4) вернет 6

 2.1 *: Значение по умолчанию для второго аргумента должно быть равно 100

 Пример:
   sumWithDefaults(10) вернет 110
 */
function sumWithDefaults(a, b) {
    return a + b
}



/*
 Задание 3:

 Функция должна принимать другую функцию и возвращать результат вызова этой функции

 Пример:
   returnFnResult(() => 'привет') вернет 'привет'
 */
function returnFnResult(fn) {
    return fn()
}

/*
 Задание 4:

 Функция должна принимать число и возвращать новую функцию (F)
 При вызове функции F, переданное ранее число должно быть увеличено на единицу и возвращено из F

 Пример:
   var f = returnCounter(10);

   console.log(f()); // выведет 11
   console.log(f()); // выведет 12
   console.log(f()); // выведет 13
 */
function returnCounter(number = 10) {
    return function f() {number = number + 1};
}

/*
 Задание 5 *:

 Функция должна возвращать все переданные ей аргументы в виде массива
 Количество переданных аргументов заранее неизвестно

 Пример:
   returnArgumentsArray(1, 2, 3) вернет [1, 2, 3]
 */
function returnArgumentsArray() {

    var result = [];
    for (var i = 0; i < arguments.length; i++) {
        result[i] = arguments[i];
    }
    return result;

}

/*
 Задание 6 *:

 Функция должна принимать другую функцию (F) и некоторое количество дополнительных аргументов
 Функция должна привязать переданные аргументы к функции F и вернуть получившуюся функцию

 Пример:
   function sum(a, b) {
     return a + b;
   }

   var newSum = bindFunction(sum, 2, 4);

   console.log(newSum()) выведет 6
 */
function bindFunction(fn) {
}

export {
    returnFirstArgument,
    sumWithDefaults,
    returnArgumentsArray,
    returnFnResult,
    returnCounter,
    bindFunction
}


// // 1.1
// var returnFirstArgument = (back) => back;
//
// returnFirstArgument(10);
// returnFirstArgument('привет');
//
// console.log(returnFirstArgument('привет'));
//
// // 1.2
// function Sum(x,y) {
//     return x+y
// }
//
// console.log(Sum(10, 20));
// console.log(Sum(2, 4));
//
//
// // 1.2.1
// function Sum2(x) {
//     return x+100
// }
//
// console.log(Sum2(10, 20));
//
//
// // 1.3
// var returnFnResult2 = () => 'hello';
// var returnFnResult = () => returnFnResult2();
//
// console.log(returnFnResult());
//
// // 1.4
// function returnN(xNumber) {
//     return xf = () => xNumber = xNumber+1
// }
// returnN(10);
// console.log(xf());
// console.log(xf());
// console.log(xf());
//
// //1.5
//


