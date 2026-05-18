# Adapter Pattern

**Definition**: Allows incompatible interfaces to work together by converting the interface of a class into another interface the client expects.

**Easy Explanation**: Think of a power‑adapter plug that lets a device with a US plug work in a European outlet.

**JavaScript Example**:
```javascript
// Existing class with a different interface
class OldAPI {
  fetchData(url) {
    return fetch(url).then(r => r.json());
  }
}

// Target interface expected by the client
class NewAPI {
  get(url) {
    // client expects a get method
  }
}

// Adapter that makes OldAPI compatible with NewAPI
class APIAdapter extends NewAPI {
  constructor() {
    super();
    this.old = new OldAPI();
  }
  get(url) {
    return this.old.fetchData(url);
  }
}

// Client code uses the NewAPI interface
const api = new APIAdapter();
api.get('https://api.example.com/data').then(console.log);
```
