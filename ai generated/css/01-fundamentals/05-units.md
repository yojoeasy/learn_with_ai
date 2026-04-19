# CSS Units: Pixels vs Rem vs Em vs Viewport

To build responsive, accessible websites, you must master the difference between absolute and relative units.

## 1. Absolute Units

Absolute units are fixed. They do not change depending on screen size or user settings.

### Pixels (`px`)
The most common absolute unit. 1px maps to 1 CSS pixel string on a screen.

**When to use:**
- Fine-grained control over layout (e.g., a simple 1px border).
- Shadows (`box-shadow: 0 4px 6px rgba(...)`).
- DO NOT use for typography!

## 2. Relative Units (Typography & Spacing)

Relative units dynamically recalculate based on their context.

### The Root EM (`rem`) - **The Gold Standard**
`rem` is relative to the root `<html>` font-size. By default in all browsers, this is **16px**.
- `1rem = 16px`
- `2rem = 32px`

**Why use rem? Accessibility!**
If a visually impaired user changes their browser's default font size from 16px to 24px, all your `rem` values will scale up proportionally. If you had used `px`, your text would remain tiny, breaking accessibility.

**When to use:**
- Font sizes (`font-size: 1.5rem`).
- Margins and paddings for layout spacing (`margin-bottom: 2rem`).
- Breakpoints in Media Queries!

### The Em unit (`em`)
`em` is relative to the **parent element's** font size.

```css
ul { font-size: 20px; }
li { font-size: 1.5em; } /* 30px! (1.5 * 20px) */
```
**Danger:** Em compounds. If you nest `<ul>` lists, `em` multiplies recursively, and text rapidly explodes or vanishes!

**When to use:**
- Very specific component scaling (e.g., sizing an icon relative to the text next to it `width: 1.2em`).

## 3. Viewport Units (Fluid Layouts)

These units are relative to the browser window (the viewport).

### Viewport Width (`vw`) & Height (`vh`)
`1vw = 1% of viewport width.`
`1vh = 1% of viewport height.`

```css
.hero-section {
  width: 100vw; /* Spans full screen width */
  height: 100vh; /* Takes up whole screen vertically! */
}
```

**Mobile Safari Bug (Interview Scenario):**
On iOS, `100vh` ignores the bottom UI menu bar, causing your content to scroll or get hidden.
**Solution:** Use the new dynamic viewport units:
- `100dvh` (Dynamic Viewport Height - Adjusts instantly when mobile UI showing/hiding).
- `svh` (Shortest viewport height).

## 4. Percentages (`%`)
Percentages are relative to the parent box's dimensions.

```css
.sidebar { width: 25%; }
.main { width: 75%; }
```
**Important:** Height percentages *only work* if the parent has an explicit height set. A `div` with `height: 50%` inside `body` will collapse to 0 if `body` has no specific `height` rules.

## 5. Modern Clamp & Calc Functions

### Calc (`calc()`)
Perform math directly in CSS! Extremely useful for mixing units.
```css
.sidebar {
  /* Take up full width, MINUS 200px for a fixed menu */
  width: calc(100% - 200px); 
}
```

### Clamp (`clamp()`)
Creates fluid typography and values with a minimum and maximum!

`clamp(MIN, IDEAL, MAX)`
```css
h1 {
  /* Minimum: 2rem */
  /* Preferred: Scales fluidly based on viewport width (5vw) */
  /* Maximum: 4rem (caps it on massive screens) */
  font-size: clamp(2rem, 5vw, 4rem);
}
```

## ✍️ Practice Exercise
Create an `index.html` with an `<h1>` containing a fluid header.
Update your `style.css` to use the `clamp()` function.
Resize your browser window and watch the magic of fluid typography recalculating instantly!

## 💡 Best Practice
Use `rem` for typography. Use `vw/vh` for macro layouts (Hero sections). Use `%` or flex/grid gaps for dividing spaces.
