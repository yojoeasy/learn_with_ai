# CSS Basics

CSS (Cascading Style Sheets) is the language used to style an HTML document. It describes how HTML elements should be displayed.

## 1. How CSS works internally

When a browser loads a web page, it goes through the **Critical Rendering Path**:
1. It reads HTML and creates the **DOM (Document Object Model)** tree.
2. It reads CSS and creates the **CSSOM (CSS Object Model)** tree.
3. It combines them to form the **Render Tree**.
4. **Layout**: The browser calculates the exact position and size of every box.
5. **Paint**: The browser draws the pixels on the screen (colors, text, shadows).
6. **Composite**: The browser draws elements in the correct stacking order (z-index).

Understanding this helps you write performant CSS (e.g., animating `left` triggers layout + paint, but animating `transform` only triggers composite!).

## 2. Adding CSS to HTML

There are three ways:

### Inline (Avoid)
Hard to maintain.
```html
<h1 style="color: blue;">Hello</h1>
```

### Internal (Okay for single pages)
```html
<head>
  <style>
    h1 { color: red; }
  </style>
</head>
```

### External (Best Practice)
Keeps HTML clean and allows caching CSS across pages.
```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

## 3. The Anatomy of a Rule
```css
selector {
  property: value;
  property: value;
}

/* Example */
h1 {
  color: blue; /* Sets text color */
  font-size: 24px; /* Sets text size */
}
```

## 4. The Cascade & Inheritance

**Cascading** means that styles fall or cascade downwards. If two rules apply to the same element, the one loaded *last* generally wins (unless Specificity overrides it—we'll cover that later).

**Inheritance** means that some properties (like `color`, `font-family`) are passed down from parent to child. Properties like `padding` or `border` are *not* automatically inherited unless explicitly told (`margin: inherit`).

## ✍️ Practice Exercise
1. Create an `index.html` and a `style.css` file. Link them.
2. Add a `<p>` tag inside a `<div>`.
3. Set the `color` of the `<div>` to red. Does the `<p>` tag also turn red? Why? (Answer: Inheritance)
4. Add the property `border: 1px solid black` to the `<div>`. Does the `<p>` get a border? Why not? (Answer: Border does not inherit).

## 💡 Common Mistake
Forgetting the semicolon `;` at the end of a value. It will break the next property in the rule!
