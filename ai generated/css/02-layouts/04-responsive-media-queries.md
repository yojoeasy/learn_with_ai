# Responsive Design and Media Queries

Modern websites must look perfect on a 320px phone and a 4k monitor. Hardcoded pixel widths are the enemy of responsive design.

## 1. The Golden Rule: Mobile First

**Always design the mobile layout FIRST.**

It's fundamentally easier to add complexity (columns, sidebars, grids) as screen size grows, rather than trying to squash a complex desktop layout down to fit a phone.

```css
/* 1. base styles (Mobile Default) */
.card-layout {
  display: flex;
  flex-direction: column; /* Stack vertically on small screens */
}

/* 2. Media Query (Tablet & Desktop) */
@media (min-width: 768px) {
  .card-layout {
    flex-direction: row; /* Switch to columns when room is available */
  }
}
```

## 2. Media Query Syntax

The `@media` rule allows you to apply CSS *conditionally* based on the browser's viewport.

### Width Queries (The Standard)
```css
/* At MINIMUM 768px (Tablet Portrait and up) */
@media (min-width: 768px) { ... }

/* At MINIMUM 1024px (Laptops/Desktops) */
@media (min-width: 1024px) { ... }
```

### Height Queries
Extremely useful for ensuring a sticky footer doesn't overlap content on tiny landscape phones!
```css
/* Only apply if the screen is very short! */
@media (max-height: 400px) { ... }
```

### Media Features (Accessibility + Modern Web)
You can target user settings rather than just screen size!

**Hover Capabilities (The Touch Problem):**
Don't rely on `:hover` menus for navigation unless the device *has* a mouse!
```css
@media (hover: hover) {
  /* Only loads hover states for devices with a cursor! */
  .btn:hover { background: blue; }
}
```

**Dark Mode Preference:**
Automatically apply dark themes based on OS settings.
```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #f1f1f1;
  }
}
```

**Reduced Motion:**
If a user suffers from vestibular disorders, they can disable animations OS-wide. Respect this!
```css
@media (prefers-reduced-motion: reduce) {
  * { /* Disable all CSS animations and transitions instantly */
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 3. Responsive Images

If an image is wider than its container, it bursts out.

Always provide this fundamental reset:
```css
img, picture, video, canvas, svg {
  display: block;  /* Fixes a weird inline spacing bug below images */
  max-width: 100%; /* Image can never be wider than its parent */
  height: auto;    /* Preserves aspect ratio */
}
```

## 4. Modern CSS Responsive Features

CSS has evolved. You often don't even need `@media` queries anymore!

### Container Queries (`@container`)
Media queries act on the entire *page* width. What if you want a card to style itself based on the width of the *container* it sits in?

```css
.card-wrapper {
  /* Tells CSS to track the size of this container */
  container-type: inline-size;
}

/* The card changes its layout based on the PARENT size, not the Window! */
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

## ✍️ Practice Exercise
1. Create a 3-card layout.
2. Code the layout so they stack visually 1-by-1 vertically (base CSS).
3. Add a media query (`min-width: 768px`) that switches the container to CSS Grid `grid-template-columns: 1fr 1fr;`. Watch the magic.

## 💡 Best Practice
Standardize your breakpoints. Don't invent scattered random `min-width` values. Stick to known standards (e.g., Tailwind's `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`). Use `rem` or `em` in media queries for accessibility!
