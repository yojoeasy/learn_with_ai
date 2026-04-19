/**
 * ==========================================
 * PHASE 3 MINI PROJECT: RPG CHARACTER SYSTEM
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * In Game Dev or UI Framework architecture, object creation and 
 * inheritance performance is CRITICAL. 
 * This project demonstrates:
 * 1. ES5 Prototypal Inheritance (The Under-the-hood reality).
 * 2. ES6 Class Inheritance (The Modern senior-level syntax).
 * 3. Shadowing and Method Overriding.
 */

"use strict";

// --- PART 1: THE FOUNDATION (ES5 Style) ---
function BaseCharacter(name, health) {
    this.name = name;
    this.health = health;
    this.isAlive = true;
}

BaseCharacter.prototype.takeDamage = function (amount) {
    this.health -= amount;
    console.log(`[${this.name}] took ${amount} damage! HP: ${this.health}`);
    if (this.health <= 0) {
        this.isAlive = false;
        console.log(`[${this.name}] has fallen!`);
    }
};

// --- PART 2: THE MODERN EVOLUTION (ES6 Style) ---
class Hero extends BaseCharacter {
    // Private state for mana/energy
    #mana = 100;

    constructor(name, health, role) {
        // Inheriting state from ES5 constructor works!
        super(name, health);
        this.role = role;
    }

    /**
     * Hero's special attack method.
     * Uses private mana field.
     */
    specialAttack(target) {
        if (!this.isAlive) return;
        if (this.#mana < 20) {
            console.log("Not enough mana!");
            return;
        }

        console.log(`[HERO] ${this.name} uses ${this.role} special attack!`);
        this.#mana -= 20;
        target.takeDamage(50);
    }

    get stats() {
        return `${this.name} (${this.role}) - HP: ${this.health} | Mana: ${this.#mana}`;
    }
}

// --- PART 3: THE COMPONENT PATTERN (Advanced Prototypes) ---
/**
 * Using Object.assign to mix-in behavior without a deep chain.
 */
const healBehavior = {
    heal(amount) {
        this.health += amount;
        console.log(`[HEAL] ${this.name} restored ${amount} HP!`);
    }
};

// --- SIMULATION ---
const Cloud = new Hero("Cloud", 150, "Warrior");
const Sephiroth = new BaseCharacter("Sephiroth", 1000);

// Mix-in healing to our hero at runtime (Dynamic Prototypes!)
Object.assign(Hero.prototype, healBehavior);

console.log("--- BATTLE START ---");
console.log(Cloud.stats);

Cloud.specialAttack(Sephiroth);
Sephiroth.takeDamage(10);
Cloud.heal(20);

console.log(Cloud.stats);

/**
 * SENIOR HIGHLIGHTS:
 * - Inheritance: Hero (ES6) inherits from BaseCharacter (ES5) flawlessly 
 *   because both use the same internal Prototype Chain.
 * - Memory: Methods remain on the prototype object, avoiding duplication.
 * - Encapsulation: Sephiroth cannot reach into Cloud's private #mana!
 */
