# Pseudo-Classes and Pseudo-Elements

Pseudos are keywords added to a selector to specify a specific *state* of the element, or to style a specific *part* of the element without adding extra HTML.

## 1. Pseudo-Classes (`:`)

They refer to the element's state based on user interaction or DOM position.

### Interactive States
The order matters! Remember the mnemonic "LoVe HAte".
1. `:link` (Unvisited links)
2. `:visited` (Visited links)
3. `:hover` (Mouse is over it)
4. `:active` (Mouse is clicking down on it)

```css
a:hover { text-decoration: underline; }
```

### Form States (Extremely Useful!)
```css
/* When the user clicks into an input field */
input:focus { border-color: blue; outline: none; }

/* When an input fails HTML validation (e.g. required field empty) */
input:invalid { border-color: red; }

/* When a checkbox is checked! */
input[type="checkbox"]:checked + label { text-decoration: line-through; }

/* NEW! `:has()` - The CSS Parent Selector we waited 20 years for! */
/* Selects the <form> ONLY IF it contains an invalid input! */
form:has(input:invalid) button[type="submit"] { opacity: 0.5; pointer-events: none; }
```

### Structural Selectors (Targeting by DOM position)
```css
/* Targets the first item in a list */
li:first-child { font-weight: bold; }

/* Targets the very last item */
li:last-child { border-bottom: none; }

/* Targets every alternating item (Zebra striping tables!) */
tr:nth-child(even) { background-color: #f5f5f5; }

/* Formula logic: Every 3rd item */
.grid-item:nth-child(3n) { margin-right: 0; }
```

## 2. Pseudo-Elements (`::`)

They let you insert virtual elements into the DOM *via CSS* or style specific sub-parts of text. (Use double colons `::` to distinguish them from pseudo-classes).

### `::before` and `::after`
These are the most powerful tools in CSS. They inject invisible virtual boxes into the HTML before or after an element's content.

**Critical Rule:** You MUST include the `content` property for them to render, even if it's empty!

```css
.quote::before {
  content: "“"; /* Injects a giant quote mark via CSS! */
  font-size: 3rem;
  color: gray;
}

/* Great for custom styling arrows or icons without HTML markup */
.btn-arrow::after {
  content: ""; /* Empty content! */
  display: inline-block;
  width: 10px;
  height: 10px;
  background-image: url('arrow.svg');
}
```

### Typography Styling
```css
/* Styles the very first letter of a paragraph (Drop cap effect!) */
p::first-letter { font-size: 2em; float: left; }

/* Styles the very first line of text, even as text wraps */
p::first-line { font-weight: bold; }

/* Styles the highlight color when a user drags their mouse over text! */
::selection {
  background-color: yellow;
  color: black;
}
```

## ✍️ Practice Exercise
1. Create a bulleted list `<ul>`.
2. Use CSS `list-style: none;` to remove standard bullets.
3. Use `li::before` with `content: "👉";` to create a custom emoji bullet point system!

## 💡 Best Practice
Use `::before` and `::after` extensively for decorative elements (blobs, lines, background highlights, custom checkboxes) to keep your actual HTML semantic and clean!
