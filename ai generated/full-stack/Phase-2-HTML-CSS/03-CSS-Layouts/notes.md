# 📐 CSS Layouts — Flexbox, Grid & Responsive Design

## Why Layout Matters

Before Flexbox and Grid, developers used:
- `float` + `clear` hacks
- `inline-block` tricks
- `table` layouts

These were fragile and painful. Flexbox and Grid solved layouts properly.

---

## Flexbox — 1D Layout

**Flexbox** (Flexible Box Layout) is for **one-dimensional layouts** — either in a row OR in a column.

### Flex Container & Items:
```
.container  ← flex container (parent)
  ├── .item ← flex item (child)
  ├── .item
  └── .item
```

### Enabling Flexbox:
```css
.container {
  display: flex;
}
```

---

### Flex Container Properties:

```css
.container {
  display: flex;

  /* Direction: row (default) or column */
  flex-direction: row;           /* left to right */
  flex-direction: row-reverse;   /* right to left */
  flex-direction: column;        /* top to bottom */
  flex-direction: column-reverse;/* bottom to top */

  /* Wrapping */
  flex-wrap: nowrap;   /* all items in one line (default) */
  flex-wrap: wrap;     /* wrap to next line when needed */

  /* Shorthand */
  flex-flow: row wrap;  /* flex-direction + flex-wrap */

  /* Main Axis Alignment (horizontal for row) */
  justify-content: flex-start;    /* pack to start */
  justify-content: flex-end;      /* pack to end */
  justify-content: center;        /* center them */
  justify-content: space-between; /* equal space BETWEEN items */
  justify-content: space-around;  /* equal space AROUND items */
  justify-content: space-evenly;  /* equal space everywhere */

  /* Cross Axis Alignment (vertical for row) */
  align-items: stretch;      /* fill container height (default) */
  align-items: flex-start;   /* align to top */
  align-items: flex-end;     /* align to bottom */
  align-items: center;       /* center vertically */
  align-items: baseline;     /* align text baselines */

  /* Cross Axis Alignment for multiple lines (when flex-wrap is used) */
  align-content: flex-start;
  align-content: center;
  align-content: space-between;
  
  /* Spacing between flex items */
  gap: 16px;            /* gap between rows AND columns */
  gap: 16px 24px;       /* row-gap column-gap */
}
```

### Flex Item Properties:
```css
.item {
  /* flex-grow: how much the item grows to fill space */
  flex-grow: 0;    /* don't grow (default) */
  flex-grow: 1;    /* grow and fill available space */

  /* flex-shrink: how much item shrinks when space is tight */
  flex-shrink: 1;  /* can shrink (default) */
  flex-shrink: 0;  /* never shrink */

  /* flex-basis: starting size before grow/shrink */
  flex-basis: auto;     /* size based on content */
  flex-basis: 200px;    /* start at 200px */
  flex-basis: 50%;      /* start at 50% of container */

  /* Shorthand: flex: grow shrink basis */
  flex: 1;              /* = flex: 1 1 0% (grow, shrink, basis 0) */
  flex: 0 0 200px;      /* fixed 200px, don't grow or shrink */
  flex: none;           /* = flex: 0 0 auto */

  /* Override align-items for a SINGLE item */
  align-self: center;

  /* Reorder items visually */
  order: 2;   /* default is 0, lower orders appear first */
}
```

### Common Flexbox Patterns:

**1. Center anything perfectly:**
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**2. Navigation bar:**
```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
}
```

**3. Card grid with flex:**
```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.card {
  flex: 1 1 300px;  /* grow, shrink freely, min 300px */
}
```

**4. Sidebar layout:**
```css
.layout {
  display: flex;
  gap: 24px;
}
.sidebar { flex: 0 0 250px; }  /* fixed 250px */
.main    { flex: 1; }           /* takes remaining */
```

---

## CSS Grid — 2D Layout

**CSS Grid** is for **two-dimensional layouts** — rows AND columns simultaneously.

### Enabling Grid:
```css
.container {
  display: grid;
}
```

### Defining Rows and Columns:
```css
.container {
  display: grid;

  /* Define 3 columns */
  grid-template-columns: 200px 1fr 200px;
  /* fr = fraction of remaining space */

  /* Define rows */
  grid-template-rows: 80px 1fr 60px;

  /* Gap between grid cells */
  gap: 24px;
  column-gap: 24px;
  row-gap: 16px;
}
```

### The `fr` unit and `repeat()`:
```css
/* 3 equal columns */
grid-template-columns: 1fr 1fr 1fr;

/* Same, using repeat */
grid-template-columns: repeat(3, 1fr);

/* Responsive: as many columns as fit, min 200px each */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
```

### Placing Items:
```css
.header  { grid-column: 1 / -1; }       /* span ALL columns */
.sidebar { grid-column: 1 / 2; grid-row: 2 / 3; }
.main    { grid-column: 2 / 4; grid-row: 2 / 3; }
.footer  { grid-column: 1 / -1; }

/* Shorthand */
.item {
  grid-area: row-start / col-start / row-end / col-end;
}
```

### Named Template Areas (most readable!):
```css
.container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

---

## CSS Media Queries — Responsive Design

**Media queries** let you apply different styles based on the device/window size.

### Basic Syntax:
```css
@media (condition) {
  /* CSS rules */
}
```

### Common Breakpoints:
```css
/* Mobile first approach (recommended) */
/* Base styles = mobile */

/* Small tablets - 640px and up */
@media (min-width: 640px) { }

/* Tablets - 768px and up */
@media (min-width: 768px) { }

/* Small laptops - 1024px and up */
@media (min-width: 1024px) { }

/* Desktops - 1280px and up */
@media (min-width: 1280px) { }

/* Large screens - 1536px and up */
@media (min-width: 1536px) { }
```

### Responsive Grid Example:
```css
.cards {
  display: grid;
  gap: 24px;
  
  /* Mobile: 1 column */
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  /* Tablet: 2 columns */
  .cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  /* Desktop: 3 columns */
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```

### Auto-responsive (no media queries needed!):
```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
/* Automatically adjusts columns based on available space */
```

### Other Media Query Types:
```css
/* Based on orientation */
@media (orientation: landscape) { }
@media (orientation: portrait) { }

/* Dark mode */
@media (prefers-color-scheme: dark) { }

/* Reduced motion (accessibility!) */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}

/* Print styles */
@media print {
  .nav, .sidebar { display: none; }
}
```

---

## Responsive Units

| Unit  | Relative to              | Example                     |
|-------|--------------------------|-----------------------------|
| `px`  | Absolute pixel           | `font-size: 16px`           |
| `rem` | Root font size (html)    | `padding: 1.5rem`           |
| `em`  | Parent font size         | `margin: 0.5em`             |
| `%`   | Parent element           | `width: 50%`                |
| `vw`  | Viewport width           | `width: 100vw`              |
| `vh`  | Viewport height          | `height: 100vh`             |
| `fr`  | Fraction of grid space   | `grid-template-columns: 1fr`|
| `ch`  | Width of "0" character   | `max-width: 65ch`           |
| `clamp`| Responsive range        | `font-size: clamp(1rem, 2.5vw, 1.5rem)` |

### Best Practice Units:
- Use `rem` for font sizes (respects user browser settings).
- Use `px` for borders, shadows.
- Use `%` or `fr` for widths.
- Use `vh`/`vw` for full-screen sections.
- Use `clamp()` for fluid typography.

```css
/* Fluid typography with clamp */
h1 { font-size: clamp(2rem, 5vw, 4rem); }
/* min: 2rem, preferred: 5vw, max: 4rem */
```
