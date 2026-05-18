// Reverse an array (without using .reverse())

let a = [1, 2, 3, 4, 5];

// Initialize left and right pointers (same as your original code)
let left = 0;
let right = a.length - 1;

// Loop while left pointer is less than right pointer
while (left < right) {
    // Swap the elements at left and right indices using array destructuring
    [a[left], a[right]] = [a[right], a[left]];

    // Move left pointer one position to the right
    left++;

    // Move right pointer one position to the left
    right--;
}

// Print the reversed array
console.log(a); // Output: [5, 4, 3, 2, 1]
