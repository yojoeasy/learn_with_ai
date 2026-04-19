# CSS Typography and Colors: Engineering Aesthetics

Beautiful websites share two things: excellent typography and a strict color palette.

## 1. Web Typography

Typography is how you set text. Don't rely on the browser's default Times New Roman.

### Font Family Stacks
Always provide fallbacks in case a font fails to load.

```css
body {
  /* Try Inter first, then Helvetica, then any local sans-serif */
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
}
```

### Adding Custom Fonts (@font-face vs Google Fonts)

**The Modern Google Fonts Way:**
Include the `<link>` in HTML or `@import` in CSS.
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
```
*Note:* Look at `display=swap`. This is an essential performance trick (FOUT) that ensures text is immediately readable in a fallback font while the custom font loads.

### Core Text Properties
Look beyond `font-size`. Line height and spacing fundamentally change readability.

```css
p {
  font-size: 1rem;
  /* Always increase line-height for body paragraphs (1.5 - 1.7) */
  line-height: 1.6; 
  /* Spacing between words (great for ALL CAPS headings) */
  letter-spacing: 0.05em; 
  /* Boldness: 400 = Normal, 700 = Bold */
  font-weight: 400; 
  /* Left, center, right, or justify */
  text-align: left; 
}

h1 {
  /* Headings look better with TIGHTER line-heights */
  line-height: 1.1; 
  /* Adds ... ellipsis to overflowing text on 1 line */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
```

## 2. Colors in CSS

CSS supports multiple color formats. Knowing which to use separates juniors from seniors.

### Hex Codes (`#RRGGBB`)
Standard string representations.
`#FFFFFF` = White
`#000000` = Black
`#FF0000` = Red

*Can include Alpha for transparency:* `#FF000080` (50% opaque red).

### RGB & RGBA
Used when you need exact channel control or transparency.
```css
.card {
  /* Semi-transparent black background */
  background-color: rgba(0, 0, 0, 0.5);
}
```

### HSL (Hue, Saturation, Lightness) - **The Web Design Secret Weapon**
The absolute best way to manage colors because it maps to human logic.

Hue: The degree on the color wheel (0-360). 0=Red, 120=Green, 240=Blue.
Saturation: 0% to 100%.
Lightness: 0% (Black) to 100% (White).

```css
.btn-primary {
  background-color: hsl(220, 90%, 50%); /* Vibrant Blue */
}

/* Oh, you need a hover state? Just lower the lightness by 10%! */
.btn-primary:hover {
  background-color: hsl(220, 90%, 40%); /* Darker Blue */
}
```

### Modern CSS: System Colors & `color-mix`

You can use `currentColor` to dynamically inherit a text color for SVGs or borders!
```css
.icon {
  fill: currentColor; /* Matches the text color of the parent! */
}
```

`color-mix()` allows you to dynamically mix colors in modern CSS without SCSS!
```css
.alert-error {
  background-color: color-mix(in srgb, red 20%, white);
}
```

## ✍️ Practice Exercise
1. Go to Google Fonts and select "Inter". Add it to your project.
2. Build a card layout with a headline, a paragraph, and a button.
3. Use HSL to color your button and its hover state (darken it on hover).
4. Apply a line-height of 1.6 to the paragraph.

## 💡 Best Practice
Use HSL to easily generate color palettes (just change the Lightness value to map 100-900 shades used in Tailwind). Limit your color palette to primary, secondary, text-dark, text-light, and background! Use CSS variables to manage them (covered in Phase 3).
