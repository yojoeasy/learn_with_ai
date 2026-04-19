# CSS Variables (Custom Properties): Theming Power

Long gone are the days where you absolutely *needed* SASS/LESS just for variables. CSS Custom Properties are incredibly powerful because they are **dynamic at runtime**, meaning you can change them with JavaScript or Media Queries instantly.

## 1. Syntax and Definition

Variables must start with two dashes `--` to specify that they are custom properties.

```css
/* Typically defined in the :root pseudo-class (represents the <html> element) */
:root {
  --primary-color: #3b82f6;   /* Solid blue */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --border-radius: 6px;
  
  /* You can even store partial strings! (Advanced technique for HSL or RGB) */
  --primary-hsl: 217, 91%, 60%;
}
```

## 2. Using Variables

Use the `var()` function to access the defined values. You can provide a second argument as a **fallback** in case the variable isn't defined.

```css
button {
  background-color: var(--primary-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  /* The fallback `black` will be used if `--text-color` is missing */
  color: var(--text-color, black);
}
```

## 3. The Power of the Override

Unlike SASS variables (which compile statically to a hardcoded string), CSS variables cascade down the DOM tree. This means a variable's value inherits just like normal CSS.

If you redefine a variable inside a specific element, *only that element and its children* will use the new value!

### Example: Component Variations
```css
/* Base card design */
.card {
  --card-bg: white;
  --card-text: black;
  
  background-color: var(--card-bg);
  color: var(--card-text);
  padding: 1rem;
}

/* Modifier class just flips the variables! */
.card--dark {
  --card-bg: #333; /* Instantly changes ONLY the background of this specific card! */
  --card-text: white;
}
```

## 4. Dark Mode in 5 Lines

The ultimate use case for CSS Variables is real-time theming.

```css
/* 1. Define base variables */
:root {
  --bg-color: #ffffff;
  --text-color: #111827;
}

/* 2. When the OS is in dark mode, entirely swap the values! */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #111827;  /* Now dark gray */
    --text-color: #f3f4f6; /* Now off-white */
  }
}

/* 3. Build your entire site using the variables! */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  /* The entire site swaps colors instantly! */
}
```

## 5. Controlling Colors with Alphas

Because you can't easily string-concatenate inside a `rgba` function, storing *raw channel numbers* is a senior technique.

```css
:root {
  /* Only store the numbers, not the wrapper! */
  --primary-rgb: 59, 130, 246; 
}

.overlay {
  /* Inject the variable inside an RGBA wrapper to add 50% transparency! */
  background-color: rgba(var(--primary-rgb), 0.5); 
}
```
*Note:* Modern CSS (`color-mix()` and relative colors) are making this technique obsolete, but it's heavily used in Tailwind internally!

## ✍️ Practice Exercise
Rebuild a button with CSS Variables. Define `--btn-color` and `--btn-spacing` at the `:root`. Create a `button` class that uses them. Then, add a media query so that if the screen is wider than 1024px, `--btn-padding` doubles. Watch the button magically update!

## 💡 Best Practice
Use variables for *design tokens*. Colors, fonts, spacing increments, and shadows should be variables. Concrete layout metrics like `grid-template-columns: 200px` rarely need to be variables unless deeply dynamic.
