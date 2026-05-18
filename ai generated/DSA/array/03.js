// Count even and odd numbers

let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let even = 0;
let odd = 0;

for (i = 0; i < a.length; i++) {
    if (a[i] % 2 === 0) {
        even++;
    } else {
        odd++;
    }
}
console.log("Even numbers: ", even);
console.log("Odd numbers: ", odd);

// -------------------------------------------------------------------
// Helper function that counts evens/odds in any numeric array
function countEvenOdd(arr) {
    // Input validation (same as previous helper)
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non‑empty array');
    }

    let evenCount = 0;
    let oddCount = 0;

    // Loop exactly like your for-loop, just using different variable names
    for (let i = 0; i < arr.length; i++) {
        const num = arr[i];
        if (num % 2 === 0) {
            evenCount++;
        } else {
            oddCount++;
        }
    }

    return { even: evenCount, odd: oddCount };
}

// -------------------------------------------------------------------
// Your array (you can keep this unchanged)
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Use the helper – same result, cleaner code
const counts = countEvenOdd(arr);
console.log('Even numbers:', counts.even);
console.log('Odd numbers:', counts.odd);

// -------------------------------------------------------------------
// Example with another array
let anotherArray = [11, 22, 33, 44, 55];
const anotherCounts = countEvenOdd(anotherArray);
console.log('Another example → even:', anotherCounts.even, ', odd:', anotherCounts.odd);    