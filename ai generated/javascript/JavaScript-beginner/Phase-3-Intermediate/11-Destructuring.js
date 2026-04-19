// Practice file for Destructuring and Spread
let settings = { volume: 80, difficulty: "Hard", subtitles: true };

// Object Destructuring
let { difficulty, subtitles } = settings;
console.log("Difficulty is:", difficulty);

// Array Destructuring
let rgb = [255, 100, 50];
let [red, green, blue] = rgb;
console.log("Green value:", green);

// Spread Operator - Merging Arrays
let party1 = ["Warrior", "Mage"];
let party2 = ["Rogue", "Cleric"];
let fullRaid = [...party1, ...party2, "Bard"];
console.log("Full Raid Party:", fullRaid);

// Spread Operator - Copying Objects
let baseConfig = { host: "localhost", port: 8080 };
let customConfig = { ...baseConfig, secure: true };
console.log("Merged Config:", customConfig);
