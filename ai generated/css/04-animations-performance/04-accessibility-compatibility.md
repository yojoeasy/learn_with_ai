# Accessibility (A11y) and Browser Matrix

If your CSS is broken on Safari, or cannot be navigated by a blind user with a screen reader, it is fundamentally flawed.

## 1. Visual Accessibility Requirements

Accessibility isn't just about screen readers. It's about color contrast and visibility for everyone.

### Color Contrast (WCAG Standards)
Text must have a high enough contrast ratio against its background.
- Normal text requires a **4.5:1** contrast ratio.
- Large text (headings) requires a **3:1** ratio.
*Never use light gray text on a white background for critical information! Use Chrome DevTools to inspect your text colors; it will explicitly warn you if contrast fails.*

### The `:focus-visible` Lifesaver
To be accessible, users navigating via the `Tab` key on a keyboard MUST see a visible ring around focused links and buttons.

However, designers hate focus rings appearing when they *click* a button with a mouse.

**The Modern Solution:** Use `:focus-visible` instead of `:focus`.
```css
/* Removes default ugly outlines for EVERYONE */
button:focus { outline: none; }

/* Adds a beautiful custom ring ONLY when the user is navigating via Keyboard! */
button:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}
```

### Hiding Content Visually (The `.sr-only` class)
Sometimes you need to hide a label visually to match a design (e.g., a search bar with just a magnifying glass icon), but a screen reader *must* know it's a "Search Database" input field.

Do **NOT** use `display: none;`. Screen readers ignore elements with `display: none`!

**The Industry Standard Screen-Reader-Only Hack:**
```css
.sr-only {
  /* Literally smash the element into a 1px invisible dot offscreen */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## 2. Browser Compatibility (The Safari Tax)

New CSS features (like Grid `subgrid` or `container` queries) are constantly released. You must ensure old browsers don't completely break.

### Vendor Prefixes
Historically, browsers implemented experimental features using prefixes (`-webkit-`, `-moz-`, `-ms-`, `-o-`).

```css
.gradient-text {
  /* The standard version */
  background-clip: text; 
  /* The Safari/Chrome version required for it to actually work */
  -webkit-background-clip: text; 
}
```

**How to handle this:** NEVER write prefixes manually. Configure a tool called **Autoprefixer** in your build pipeline (PostCSS). It automatically references the `caniuse.com` database and injects prefixes only where needed.

### Graceful Degradation (Feature Queries)
If a browser doesn't support a brand new feature (like `display: grid`), provide a fallback first.

```css
.layout {
  display: flex; /* Fallback for ancient browsers */
}

/* If the browser understands CSS Grid, it will override the flex rules! */
@supports (display: grid) {
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

## ✍️ Practice Exercise
1. Create a button. Click it with your mouse, notice the blue ring.
2. Remove the outline `outline: none;` and try clicking it. Open Chrome DevTools and see what `:focus-visible` does when tabbing.
3. Check `caniuse.com` for grid layout support globally. Notice it's supported by 97%+ of the world! Let Flexbox handle the remaining 3%.

## 💡 Best Practice
Always test your web apps by throwing away your mouse and trying to navigate purely with the `Tab`, `Space`, and `Enter` keys. If you get stuck or can't see where you are, your CSS is inaccessible.
