# Builder Pattern

**Definition**: Separates the construction of a complex object from its representation so that the same construction process can create different representations.

**Easy Explanation**: Think of ordering a custom pizza. The builder lets you choose crust, sauce, toppings step‑by‑step, and finally assembles the pizza.

**JavaScript Example**:
```javascript
class PizzaBuilder {
  constructor() { this.pizza = { crust: '', sauce: '', toppings: [] }; }
  setCrust(crust) { this.pizza.crust = crust; return this; }
  setSauce(sauce) { this.pizza.sauce = sauce; return this; }
  addTopping(topping) { this.pizza.toppings.push(topping); return this; }
  build() { return this.pizza; }
}

const pizza = new PizzaBuilder()
  .setCrust('thin')
  .setSauce('tomato')
  .addTopping('pepperoni')
  .addTopping('mushrooms')
  .build();
console.log(pizza);
/*
{ crust: 'thin', sauce: 'tomato', toppings: [ 'pepperoni', 'mushrooms' ] }
*/
```
