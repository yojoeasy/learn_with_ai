# Borders, Shadows, and Gradients: Elevated UI

Creating depth and texture is what makes a UI feel "premium".

## 1. Box Shadows

Shadows represent elevation. They tell the user what elements sit "higher" on the page (like cards clicking or modals sitting over the background).

### Syntax
`box-shadow: <h-offset> <v-offset> <blur> <spread> <color>;`

```css
.card {
  /* Soft, elevated modern shadow */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### Insider Secret: Layered Shadows
A single stark gray shadow looks awful and 1990s. Beautiful, photorealistic shadows are built by *layering* multiple faint shadows together.

```css
.premium-shadow {
  box-shadow:
    0 1px 2px rgba(0,0,0,0.07), 
    0 2px 4px rgba(0,0,0,0.07), 
    0 4px 8px rgba(0,0,0,0.07), 
    0 8px 16px rgba(0,0,0,0.07),
    0 16px 32px rgba(0,0,0,0.07);
}
```

### Inset Shadows
Reverses the direction so the shadow looks like it's cut *into* the page (great for depressed buttons or form inputs).
```css
input { box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
```

## 2. Borders and Radii

Borders separate content. Overusing them creates "visual noise". Use them sparingly, or rely on subtle background colors/shadows to separate sections.

### Border Radius
Creates rounded corners. Essential for modern, friendly UI.
```css
.btn {
  /* Pill shaped button! Provide a massive number to cap the radius to half the height perfectly. */
  border-radius: 9999px; 
}
```

## 3. Gradients

Gradients give depth. They are actually a type of *background image* in CSS, not a background color!

### Linear Gradients
Moves colors along a straight line.
```css
.hero {
  /* Starts red on the bottom left, reaches blue on the top right */
  background-image: linear-gradient(to top right, red, blue);
}

.subtle {
  /* Specific degree angles */
  background-image: linear-gradient(135deg, hsl(200, 50%, 90%), hsl(200, 50%, 80%));
}
```

### Radial Gradients
Radiates outward from a center point.
```css
.orb {
  background-image: radial-gradient(circle at center, white 0%, lightblue 100%);
}
```

### Conic Gradients (Advanced)
Wraps around a center point like a pie chart. Amazing for creating pure-CSS pie charts!
```css
.pie-chart {
  border-radius: 50%;
  /* 50% red, 50% blue! */
  background: conic-gradient(red 0% 50%, blue 50% 100%);
}
```

## 4. Text Gradients (Awesome Effect)

You can clip a gradient to only show through text using modern CSS properties! Note the webkit prefixes required for cross-browser support.

```css
.gradient-text {
  background: linear-gradient(90deg, #ff00cc, #3333ff);
  /* The magic parts: */
  -webkit-background-clip: text;
  background-clip: text;
  /* Make the actual text transparent so the bg shows through */
  color: transparent; 
}
```

## ✍️ Practice Exercise
Create an `.avatar` circle (width/height 100px, border-radius 50%). Apply a linear gradient to the background. Apply a very soft layered box-shadow to make it float.

## 💡 Best Practice
Avoid harsh black shadows (`rgba(0,0,0,1)` or hex `#000`). Always use very low opacity shadows (`0.05` to `0.2`) combined with a blur effect. Softness is key to modern design.
