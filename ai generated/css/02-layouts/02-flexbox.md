# Flexbox (Flexible Box Layout): 1D Mastery

Flexbox revolutionized CSS. It is designed to lay out items in a single dimension (either a row OR a column). It solves the nightmare of vertical centering and equal heights.

## 1. The Flex Container (Parent Rules)

Activating Flexbox changes everything. It only directly affects the immediate children of the flex container.

```css
.container {
  display: flex; /* Activates flexbox */
}
```

### Direction (`flex-direction`)
Which way do items line up?
- `row` (default): Left to right.
- `column`: Top to bottom.
- `row-reverse`: Right to left.

### Main Axis vs Cross Axis
If `flex-direction: row`:
- **Main Axis**: Horizontal.
- **Cross Axis**: Vertical.
*(This flips if you change direction to column!)*

### Aligning on the Main Axis (`justify-content`)
Spaces items horizontally (if row).
- `flex-start` (default): Huddle left.
- `center`: Huddle center.
- `flex-end`: Huddle right.
- `space-between`: Max space between items, flush to edges. (Perfect for NavBar logos/links)
- `space-around`: Equal space around items.

### Aligning on the Cross Axis (`align-items`)
Spaces items vertically (if row).
- `stretch` (default): Items stretch to fill the height.
- `center`: Centers items perfectly along the middle!
- `flex-start`: Align to top.
- `baseline`: Align text baselines nicely.

### Handling Overflow (`flex-wrap`)
By default, flex items try to squeeze onto one line, even overflowing the container.
- `nowrap` (default).
- `wrap`: Items drop to the next line if they run out of space.

### Modern Spacing (`gap`)
Forget margin-right/margin-bottom on flex children. Just use `gap`!
```css
.flex-container {
  display: flex;
  gap: 20px; /* 20px space between all items, horizontally and vertically! */
}
```

## 2. The Flex Items (Child Rules)

You can target specific children inside the container to alter their sizing dynamically.

### Flex Grow, Shrink, and Basis (`flex`)
Shorthand: `flex: <flex-grow> <flex-shrink> <flex-basis>`

```css
.sidebar {
  flex: 0 0 250px; /* Don't grow, don't shrink, strictly remain 250px */
}

.main-content {
  flex: 1; /* Shorthand for "Take up all remaining space!" */
}
```

### Reordering Elements (`order`)
You can visually reorganise HTML without changing the DOM! (Great for moving mobile sidebars to the bottom).
```css
.featured-item {
  order: -1; /* Jumps to the very front */
}
```

### Overriding Alignment (`align-self`)
Allows a single child to break the `align-items` rule of its parent.
```css
.special-item {
  align-self: flex-end; /* This one child snaps to the bottom */
}
```

## 3. The Holy Grail of Centering (Interview question solved in 3 lines)

"How do you center a `div` both horizontally and vertically inside a full-screen container?"

```css
.container {
  height: 100vh;
  display: flex;
  justify-content: center; /* Main axis (X) */
  align-items: center;     /* Cross axis (Y) */
}
```

## ✍️ Practice Exercise
1. Build a Navigation Bar structure: `<nav> <div class="logo"></div> <ul class="links"></ul> <div class="profile"></div> </nav>`
2. Give the `<nav>` `display: flex;` and `justify-content: space-between; align-items: center;`.
3. Give the `<ul>` `display: flex; gap: 1rem; list-style: none;`.
4. Watch a perfectly aligned layout form in seconds.

## 💡 Best Practice
Use Flexbox for **1D layouts** where items flow dynamically (Navbars, button groups, simple lists, card components). DO NOT use Flexbox to build rigid complex page grids (that's what CSS Grid is for). Let `flex-wrap` and `gap` do the heavy lifting for responsive rows!
