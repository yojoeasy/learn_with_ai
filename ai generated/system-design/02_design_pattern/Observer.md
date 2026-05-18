# Observer Pattern

**Definition**: Defines a one‑to‑many dependency so that when one object (the *subject*) changes state, all its dependents (the *observers*) are automatically notified.

**Easy Explanation**: Think of a YouTube channel. When the channel posts a new video, all subscribers (observers) get a notification.

**JavaScript Example**:
```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  subscribe(observer) {
    this.observers.push(observer);
  }
  unsubscribe(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  notify(data) {
    this.observers.forEach(o => o.update(data));
  }
}

class Observer {
  constructor(name) { this.name = name; }
  update(data) { console.log(`${this.name} received:`, data); }
}

const subject = new Subject();
const obs1 = new Observer('Alice');
const obs2 = new Observer('Bob');
subject.subscribe(obs1);
subject.subscribe(obs2);
subject.notify('New video!');
// Alice received: New video!
// Bob   received: New video!
```
