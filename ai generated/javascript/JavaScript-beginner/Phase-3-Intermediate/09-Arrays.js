// Practice file for Arrays
let inventory = ["Rusty Sword", "Apple"];

// Add to the end
inventory.push("Iron Shield");
console.log("Inventory after push:", inventory);

// Remove the last item
let dropped = inventory.pop();
console.log("Dropped item:", dropped);

// Modern Looping
inventory.forEach((item, index) => {
    console.log(`Slot ${index}: ${item}`);
});

// Mapping to a new array
let uppercased = inventory.map(item => item.toUpperCase());
console.log("Yelling the inventory:", uppercased);
