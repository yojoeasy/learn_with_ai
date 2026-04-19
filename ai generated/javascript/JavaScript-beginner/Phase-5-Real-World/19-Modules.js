// To run this in Node.js, you might need to rename this file to .mjs or ensure package.json has "type": "module".

import multiplyTools, { add, subtract } from './mathUtils.js';

console.log("Adding:", add(10, 5)); // 15
console.log("Multiplying via default export:", multiplyTools(10, 5)); // 50

// console.log(secretNumber); // Error! We cannot see variables that weren't exported!
