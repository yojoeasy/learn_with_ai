// Practice file for 'this'

// Normal object method
const player = {
    name: "Hero",
    attack: function () {
        console.log(`${this.name} attacks!`);
    }
};
player.attack(); // Prints "Hero attacks!"

// When 'this' breaks
const looseAttack = player.attack;
// looseAttack(); // In strict mode, this crashes. In normal Node, it prints "undefined attacks!"

// Arrow function trap
const monster = {
    name: "Goblin",
    roar: () => {
        // 'this' is inherited from the global scope, so 'this.name' is undefined
        console.log(`${this.name} roars!`);
    }
};
monster.roar(); // undefined roars!
