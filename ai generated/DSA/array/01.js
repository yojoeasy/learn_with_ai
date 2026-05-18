// Utility to sum elements of an array.
// For a sorted array with consecutive integers, we can use the arithmetic series formula (O(1)).
// Otherwise we fall back to a linear reduction (O(n)).
function sumArray(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;

    // Check if the array is sorted ascending.
    const isSorted = arr.every((v, i) => i === 0 || v > arr[i - 1]);
    // Check if the numbers are consecutive.
    const isConsecutive = isSorted && arr.every((v, i) => v === arr[0] + i);

    if (isConsecutive) {
        // Arithmetic series: n * (first + last) / 2
        return (arr.length * (arr[0] + arr[arr.length - 1])) / 2;
    }

    // Generic sum using reduce.
    return arr.reduce((acc, cur) => acc + cur, 0);
}

// Example arrays
const a = [1, 2, 3, 4, 5]; // continuous
const b = [1, 2, 3, 5, 6, 7]; // not continuous

console.log(sumArray(a)); // 15
console.log(sumArray(b)); // 24