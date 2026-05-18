// Find the maximum and minimum element

let arra = [1, 2, 3, 4, 5];

let maxi = arra[0];
let mini = arra[0];

for (i = 1; i < arra.length; i++) {
    if (arra[i] > maxi) {
        maxi = arra[i]
    }
    if (arra[i] < mini) {
        mini = arra[i]
    }
}
console.log("Maximum element is", maxi);
console.log("Minimum element is", mini);

// ------------------------------------------------------------
// Helper: returns an object { max, min } for any numeric array
function getMaxMin(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non‑empty array');
    }

    // Initialise with the first element (same as your original code)
    let max = arr[0];
    let min = arr[0];

    // Start loop from index 1 – identical to your current for‑loop
    for (let i = 1; i < arr.length; i++) {
        const val = arr[i];
        if (val > max) max = val;
        if (val < min) min = val;
    }

    return { max, min };
}

// ------------------------------------------------------------
// Your original array (you can keep this unchanged)
let arr = [1, 2, 3, 4, 5];

// Use the helper – no need to duplicate the loop logic
const { max, min } = getMaxMin(arr);
console.log('Maximum element is', max);
console.log('Minimum element is', min);

// ------------------------------------------------------------
// Example of re‑using the helper with a different array
let another = [7, -2, 14, 0];
const result = getMaxMin(another);
console.log('Another example → max:', result.max, ', min:', result.min);
