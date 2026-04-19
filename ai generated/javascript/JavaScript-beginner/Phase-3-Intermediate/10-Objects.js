// Practice file for Objects
let user = {
    username: "SpaceMarine99",
    level: 42,
    isOnline: true,
    // Method inside the object
    login: function () {
        console.log(this.username + " has logged in!");
    }
};

// Accessing properties
console.log("User's level:", user.level);

// Adding a new property
user.guild = "Red Dragons";
console.log("User's guild:", user["guild"]);

// Calling a method
user.login();
