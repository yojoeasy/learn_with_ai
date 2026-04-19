# CSS Selectors: Targeting Elements Like a Pro

Selectors are the part of a CSS rule that tell the browser *which* HTML elements to style.

## 1. Basic Selectors

### Universal Selection (`*`)
Matches every element on the page. Use sparingly for performance!
```css
* {
  box-sizing: border-box; /* Crucial for modern layouts! */
  margin: 0;
  padding: 0;
}
```

### Element (Type) Selector
Targets tag names.
```css
h1 { color: red; }
p { font-family: sans-serif; }
```

### Class Selector (`.`)
Matches elements with a specific `class` attribute. Can be reused.
```css
.card {
  background: white;
  padding: 1rem;
}
/* Matches: <div class="card"> */
```

### ID Selector (`#`)
Matches exactly **one** element with a specific `id`. Avoid using IDs for CSS styling (they break specificity rules easily). Keep IDs for JS/anchors.
```css
#header { background: black; }
/* Matches: <nav id="header"> */
```

## 2. Relational Combinators

### Descendant Combinator (` ` space)
Targets elements *anywhere* inside the parent.
```css
article p {
  color: blue;
}
/* Matches ANY <p> inside <article>, even if deeply nested */
```

### Child Combinator (`>`)
Targets *direct* children only.
```css
ul > li {
  list-style: none;
}
/* Matches <li> elements that are direct children of <ul>, not nested deeper */
```

### General Sibling (`~`)
Targets all siblings that follow an element.
```css
h2 ~ p {
  font-size: 14px;
}
/* Targets ALL <p> tags that come after an <h2> at the same nesting level */
```

### Adjacent Sibling (`+`)
Targets the *immediate* next sibling.
```css
h2 + p {
  font-weight: bold;
}
/* Targets ONLY the very first <p> immediately following an <h2> */
```

## 3. Attribute Selectors

Target elements based on their HTML attributes. Very powerful for styling forms or UI states.
```css
/* Has the attribute */
[disabled] { opacity: 0.5; }

/* Exact match */
input[type="text"] { border: 1px solid gray; }

/* Starts with */
a[href^="https://"] { color: green; } /* External links */

/* Ends with */
a[href$=".pdf"] { color: red; } /* PDF links */

/* Contains */
[class*="icon-"] { display: inline-block; } /* Any class containing "icon-" */
```

## 4. Grouping Selectors (`,`)

Apply the same styles to multiple completely different selectors to avoid repetition.
```css
h1, h2, h3, .heading {
  font-family: 'Arial', sans-serif;
  color: #333;
}
```

## 🎓 Mini-Project Focus: The Navbar
If you want to style links inside a navigation dynamically:
```css
nav.main-nav > ul > li > a[href^="/shop"] {
  /* Select direct links in the main nav that go to /shop! */
}
```

## ✍️ Practice Exercise
1. Create a form with text inputs, password inputs, and a submit button.
2. Use attribute selectors to test styling ONLY the `input[type="password"]` fields.
3. Use the adjacent sibling combinator `+` to style a label right next to a checked checkbox (Hint: use `:checked`, we'll see more of this in Pseudo-Classes).

## 💡 Best Practice
Keep your selectors as short as possible! Deeply nested selectors (e.g., `body div aside ul li a span`) are terrible for performance and impossible to override easily. Use simple class names instead (e.g., `.nav-link-text`). This is the foundation of BEM.
