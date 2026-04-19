// Practice file for Strings and Coercion

// 1. Template Literals
let champion = "Zelda";
let rupees = 500;
console.log(`${champion} has collected ${rupees} rupees!`);

// 2. Useful String Methods
let email = "   user@example.com   ";
// .trim() removes empty spaces at the beginning and end!
let cleanEmail = email.trim().toLowerCase();
console.log("Cleaned Email:", cleanEmail);

// 3. Type Conversion
let userAgeInput = "25";
let realAgeNumber = Number(userAgeInput);

console.log("Is it a number?", typeof realAgeNumber); // "number"
console.log("Next year age:", realAgeNumber + 1); // 26
