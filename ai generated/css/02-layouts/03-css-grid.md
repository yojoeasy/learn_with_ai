# CSS Grid: 2D Mastery

While Flexbox is for 1-dimensional layouts (a row *or* a column), CSS Grid is for **2-dimensional layouts** (rows *and* columns simultaneously).

If you are building the macro-structure of a page (Header, Sidebar, Main Content, Footer), CSS Grid is the modern standard.

## 1. The Grid Container (Parent)

You must explicitly define the grid structure on the parent element.

```css
.grid-container {
  display: grid;
  
  /* Create 3 columns:
     - 1st is exactly 200px wide
     - 2nd takes up 1 fraction of the space
     - 3rd takes up 2 fractions of the space (twice as big as the 2nd)
  */
  grid-template-columns: 200px 1fr 2fr;
  
  /* Create 2 rows: 
     - 1st is 100px tall
     - 2nd automatically sizes based on content
  */
  grid-template-rows: 100px auto;
  
  /* The holy grail gap property */
  gap: 20px;
}
```

### The Magic `fr` Unit (Fractional Unit)
`1fr` means "1 part of the available space". It automatically calculates the remaining width/height after fixed units (px) are removed. It is vastly superior to `%` because it accounts for `gap`.

## 2. Advanced Grid Functions

### The `repeat()` Function
Instead of writing `1fr 1fr 1fr 1fr` for a 4-column layout:
```css
.card-grid {
  grid-template-columns: repeat(4, 1fr);
}
```

### The Most Powerful CSS Line Ever Written (Auto-Responsive Grid)
You can build a responsive grid *without any Media Queries*.

```css
.auto-grid {
  display: grid;
  gap: 1rem;
  /* 
     "Fit as many columns as possible. 
     They must be at least 250px wide. 
     If there's extra space, let them grow (1fr)." 
  */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

## 3. The Grid Items (Children)

By default, every direct child of a grid container takes up exactly one grid cell. However, you explicitly tell children to span across multiple tracks.

### Spanning Columns and Rows

Syntax: `grid-column: <start-line> / <end-line>` (Lines are the grid separators, 1-indexed!)

```css
.header {
  /* Span from the very first line to the very last line */
  grid-column: 1 / -1; 
}

.sidebar {
  grid-column: 1 / 2; /* Occupy column track 1 */
  grid-row: 2 / 4;    /* Span down two rows */
}
```

### Alternatively: Spanning by Size
```css
.wide-card {
  grid-column: span 2; /* Span across 2 tracks starting from current position */
}
```

## 4. Grid Template Areas (The Visual Way)

You can literally "draw" your layout using strings! This is amazing for readability.

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* Then tell the children where to go: */
.page-header { grid-area: header; }
.sidebar     { grid-area: nav; }
.content     { grid-area: main; }
.ads         { grid-area: aside; }
.site-footer { grid-area: footer; }
```

## ✍️ Practice Exercise
1. Use `grid-template-areas` to recreate the layout code above. Play with changing the areas matrix inside a media query (we'll cover media queries next).

## 💡 Best Practice
Use CSS Grid for the macro page layout (the skeleton). Use Flexbox *inside* the grid cells to align content components (the organs).
