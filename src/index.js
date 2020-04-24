var returnFirstArgument = (back) => back;

returnFirstArgument(10);
returnFirstArgument('привет');

console.log(returnFirstArgument('привет'));

function Sum(x,y) {
    return x+y
}

console.log(Sum(10, 20));
console.log(Sum(2, 4));



function Sum2(x) {
    return x+100
}

console.log(Sum2(10, 20));


// 1.3
var returnFnResult2 = () => 'hello';
var returnFnResult = () => returnFnResult2();

console.log(returnFnResult());

// 1.4
function returnN(xNumber) {
    return xf = () => xNumber = xNumber+1
}
returnN(10);
console.log(xf());
console.log(xf());
console.log(xf());

//1.5



