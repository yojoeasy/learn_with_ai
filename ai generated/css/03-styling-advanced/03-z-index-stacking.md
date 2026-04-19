# Z-Index & The Stacking Context (The Tricky Part)

One of the most common complaints in CSS: "I set `z-index: 9999999` and my modal is STILL below the header!" Why? Because of **Stacking Contexts**.

## 1. What is Z-Index?

`z-index` controls the 3D stacking order of elements (the Z-axis). Higher numbers sit on top of lower numbers.

**The Golden Rule:** `z-index` **ONLY WORKS** on positioned elements! (Elements with `position: relative`, `absolute`, `fixed`, or `sticky`). It does nothing on `static` elements.

```css
.card {
  z-index: 10; /* Fails silently because position is static */
}

.modal {
  position: absolute; /* OR relative, or fixed */
  z-index: 99; /* Works! Sits above other positioned elements with lower values */
}
```

## 2. What is a Stacking Context? (Interview Question!)

This is why your `z-index` fails.

HTML elements are grouped into "contexts". If an element creates a new Stacking Context, all its children are trapped inside it.

Imagine putting a z-index of 999 inside a box. If the box itself is underneath another box, the 999 item *cannot escape* its parent's position to sit on top of the other box. It's like putting a 100-story building inside a 1-story warehouse.

```html
<div class="header" style="position: relative; z-index: 10;">
  <!-- Sits at layer 10 -->
</div>

<div class="sidebar" style="position: relative; z-index: 5;">
  <!-- Sits at layer 5 -->
  <div class="dropdown" style="position: absolute; z-index: 9999;">
    <!-- Trapped inside layer 5! Will NEVER sit on top of the header! -->
  </div>
</div>
```

### What Creates a New Stacking Context?
Many properties silently trigger a new stacking context. The most common are:
1. `position` (absolute/relative) with a `z-index` other than `auto`.
2. `position: fixed` or `position: sticky`.
3. `opacity` less than `1` (e.g., `0.99` triggers a new context!).
4. `transform` other than `none` (e.g., `transform: scale(1)` triggers a context!).
5. `filter` other than `none` (e.g., `filter: grayscale(1)` triggers a context!).
6. `flex` or `grid` children with `z-index` other than `auto`.

## 3. How to fix Z-Index issues

If your tooltip or modal is trapped:
1. **The Modern Solution:** Use the new HTML `<dialog>` element. It is placed in a special browser layer called the "Top Layer", outside of all stacking contexts!
2. **The Classic Solution:** Move the modal's HTML out of the deeply nested parent container and append it directly to the `<body>` element.
3. Check the parent tree for random `opacity`, `transform`, or `z-index` values!

## 4. Isolation (The Modern CSS Property)

CSS recently added a property to manually force a stacking context without hacking with `position` or `z-index: 0`.

```css
.parent-container {
  /* Forces the browser to create a new stacking context right here. 
     Nothing inside this box can ever z-index higher than this box itself! */
  isolation: isolate; 
}
```

## ✍️ Practice Exercise
Recreate the HTML code block above. Add distinct background colors. Try to make the `.dropdown` appear ON TOP of the `.header` without moving the HTML tags. You'll find you have to change the `z-index` of the `.sidebar` itself to be higher than `10`!

## 💡 Best Practice
Use variables for z-index layers. Don't use random large numbers. Set up a system: `z-index: var(--z-dropdown)` (100), `var(--z-sticky)` (200), `var(--z-modal)` (300).
