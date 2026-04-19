// Practice file for Scope and Hoisting

// 1. Hoisting! Allowed because it's a function declaration.
sayHello();

function sayHello() {
    console.log("Hello from a hoisted function!");
}

// 2. Scope Demo
let globalVar = "I am global";

function testScope() {
    let functionVar = "I am inside a function";
    console.log(globalVar); // Yes! Can see outside
    console.log(functionVar); // Yes! Inside itself

    if (true) {
        let blockVar = "I am inside the IF block";
        console.log(blockVar); // Yes!
    }
    // console.log(blockVar); // 🛑 ERROR if uncommented! Block scope.
}

testScope();
// console.log(functionVar); // 🛑 ERROR! Cannot see inside the function from outside
