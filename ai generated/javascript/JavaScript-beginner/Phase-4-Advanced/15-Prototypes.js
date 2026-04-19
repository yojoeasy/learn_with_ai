// Practice file for Prototypes & Inheritance

// Parent Class Blueprint
class Animal {
    constructor(species) {
        this.species = species;
    }
    breathe() {
        console.log(this.species + " takes a breath.");
    }
}

// Child Class Inheritance
class Bird extends Animal {
    constructor(species, wingSpan) {
        super(species); // Must call the Parent constructor!
        this.wingSpan = wingSpan;
    }
    fly() {
        console.log(`The ${this.species} flies with a ${this.wingSpan}m wingspan!`);
    }
}

const eagle = new Bird("Eagle", 2);
eagle.breathe(); // Inherited from Animal!
eagle.fly();     // Unique to Bird!
