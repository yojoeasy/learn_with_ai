// Practice file for Loops

// 1. For loop counting to 3
console.log("--- For Loop ---");
for (let i = 1; i <= 3; i++) {
    console.log("Count:", i);
}

// 2. While loop
console.log("--- While Loop ---");
let hp = 10;
while (hp < 30) {
    console.log("Chugging potion... HP:", hp);
    hp += 10;
}
console.log("Full health!");

// 3. Do-While loop
console.log("--- Do-While Loop ---");
let spins = 0;
do {
    console.log("Spun wheel! Spin count:", spins);
    spins++;
} while (spins < 0); // Condition instantly false, but ran once anyway!
