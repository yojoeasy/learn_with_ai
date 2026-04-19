// Practice file for basic operators
let health = 100;

health = health - 15; // subtraction
console.log("Health after hit:", health);

let isCritical = health < 50; // Comparison
console.log("Is critical state?", isCritical);

let coins = "50";
console.log("String Math (+):", coins + 10);
console.log("String Math (-):", coins - 10); // Type Coercion!

// Equality comparison
console.log("10 == '10':", 10 == '10'); // True! (Bad)
console.log("10 === '10':", 10 === '10'); // False! (Good)
