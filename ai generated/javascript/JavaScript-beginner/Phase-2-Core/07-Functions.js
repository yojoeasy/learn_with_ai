// Practice file for Functions
function add(a, b) {
    return a + b;
}

const subtract = function (a, b) {
    return a - b;
};

const multiply = (a, b) => a * b;

console.log("Add:", add(5, 5));
console.log("Sub:", subtract(10, 5));
console.log("Mul:", multiply(2, 5));

// What happens if we skip 'return'?
const badFunc = () => { console.log("Missing return!"); }
let x = badFunc();
console.log("Result of badFunc is:", x); // undefined
