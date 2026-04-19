# Display & Positioning: The Canvas Rules

Layouts in CSS start with understanding how elements sit in the standard document flow, and then how we break them out of it.

## 1. The Standard Document Flow

Elements stack depending on their default display type.

### Inline Elements
Elements like `<span>`, `<a>`, `<strong>`.
- Flow horizontally like text.
- They **DO NOT** respect explicit `width` or `height` values!
- Vertical margins and padding **will overlap** other elements without pushing them.

### Block Elements
Elements like `<div>`, `<section>`, `<h1>`, `<p>`.
- Take up the **entire 100% width** of their parent by default.
- Break onto a new line.
- Respect width, height, margins, and padding fully.

### Inline-Block Elements
`display: inline-block;`
- Flow horizontally like inline elements.
- **BUT** they respect explicit `width`, `height`, top/bottom margins, and padding! (Perfect for buttons side-by-side).

### Hidden vs None (Interview Trick)
```css
.hide { display: none; } /* Removed from document flow. Takes up 0 space. Screen readers skip it. */
.invisible { visibility: hidden; } /* Fully invisible, BUT STILL TAKES UP SPACE in layout. */
```

## 2. Positioning: Escaping the Flow

The `position` property removes or changes how elements sit in the flow.

### `position: static` (Default)
The element flows normally. Top/Right/Bottom/Left adjustments **do nothing**. `z-index` **does nothing**.

### `position: relative`
The element flows normally, BUT you can now offset it using `top`, `bottom`, `left`, `right`.
- **Crucial**: The original space it occupied is preserved! Other elements act like it never moved.
- Opens up a new stacking context (`z-index` works).

### `position: absolute`
- **Removed completely** from the normal document flow.
- Other elements pull up to take its place.
- It positions itself relative to its **closest positioned ancestor** (any ancestor with a position other than `static`).

**The Golden Combo for absolute positioning:**
Always wrap the `.absolute` element in a `.relative` parent box!

```css
.card {
  position: relative;
}
.badge {
  position: absolute;
  top: -10px;
  right: -10px; /* Badge sits overlapping the top right corner of the card! */
}
```

### `position: fixed`
- Fixed to the **viewport** (the browser window itself).
- Removed from flow.
- Even if the user scrolls, it stays glued. Perfect for sticky navbars or chat widgets.

### `position: sticky`
A hybrid between relative and fixed.
- Acts `relative` until the user scrolls past a specified threshold, then acts `fixed`.
```css
.table-header {
  position: sticky;
  top: 0; /* Sticks to the top of the scrolling parent once hit! */
}
```
*Gotcha:* `sticky` ONLY works if its parent elements DO NOT have `overflow: hidden;` set anywhere up the chain.

## 3. Centering the old-school absolute way

Before flexbox/grid, this is how we perfectly centered a modal vertically and horizontally:

```css
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Translates the element back by half its OWN width and height */
  transform: translate(-50%, -50%); 
}
```

## ✍️ Practice Exercise
1. Create a `header` element and scrollable `main` content with loads of paragraphs.
2. Give the header `position: sticky; top: 0;`. Scroll down. Does the header follow you?
3. Add a "Chat Support" button to your page and use `position: fixed; bottom: 20px; right: 20px;`. This ensures it stays on screen forever!

## 💡 Best Practice
Do not use Absolute positioning for complex dashboard layouts. It's brittle and not responsive. Reserve `absolute` for micro-elements: badges, decorative background blobs, custom tooltips, dropdown menus.
