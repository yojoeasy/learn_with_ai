// mathUtils.js (A module file)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

const secretNumber = 42; // Not exported! Private to this file!

export default function multiply(a, b) {
    return a * b;
}
