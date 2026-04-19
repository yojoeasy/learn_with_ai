# 🎨 CSS — Cascading Style Sheets

## What is CSS?
**CSS (Cascading Style Sheets)** controls the **visual presentation** of HTML elements — colors, fonts, spacing, layout, and animations.

```
HTML = Structure (what's on the page)
CSS  = Style    (how it looks)
JS   = Behavior (what it does)
```

---

## How to Add CSS

### 1. Inline CSS (least preferred)
```html
<p style="color: red; font-size: 20px;">Hello</p>
```

### 2. Internal CSS (in `<head>`)
```html
<style>
  p { color: red; font-size: 20px; }
</style>
```

### 3. External CSS (best practice)
```html
<link rel="stylesheet" href="style.css" />
```
```css
/* style.css */
p { color: red; font-size: 20px; }
```

---

## CSS Selectors

### Basic Selectors:
```css
/* Element selector */
p { color: blue; }

/* Class selector */
.card { background: white; border-radius: 8px; }

/* ID selector */
#header { background: #1a1a2e; }

/* Universal selector */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Attribute selector */
input[type="text"] { border: 1px solid #ccc; }
a[href^="https"] { color: green; }    /* href starts with https */
a[href$=".pdf"] { color: red; }      /* href ends with .pdf */
```

### Combinators:
```css
/* Descendant: any p inside .container */
.container p { font-size: 16px; }

/* Child: direct children only */
.nav > li { display: inline-block; }

/* Adjacent sibling: h2 immediately after h1 */
h1 + h2 { margin-top: 0; }

/* General sibling: all p after h1 */
h1 ~ p { color: #555; }
```

### Pseudo-classes:
```css
a:hover { color: orange; }               /* mouse over */
a:visited { color: purple; }             /* visited link */
button:focus { outline: 2px solid blue; }/* keyboard focus */
input:disabled { opacity: 0.5; }         /* disabled element */
li:first-child { font-weight: bold; }    /* first child */
li:last-child { border: none; }          /* last child */
li:nth-child(2) { color: red; }          /* 2nd child */
li:nth-child(odd) { background: #f5f5f5; }     /* odd items */
li:nth-child(even) { background: white; }      /* even items */
p:not(.special) { color: gray; }         /* NOT .special */
```

### Pseudo-elements:
```css
p::first-line { font-weight: bold; }       /* first line */
p::first-letter { font-size: 3em; }        /* drop cap */
.card::before { content: "★"; color: gold; }  /* insert before */
.card::after  { content: ""; display: block; clear: both; } /* clearfix */
input::placeholder { color: #aaa; }       /* placeholder text */
::selection { background: #4f46e5; color: white; } /* selected text */
```

---

## CSS Specificity

When two rules apply to the same element, **specificity** determines which wins.

### Specificity Calculation:
| Selector Type        | Points |
|----------------------|--------|
| Inline style         | 1000   |
| ID `#id`             | 100    |
| Class `.class`       | 10     |
| Pseudo-class `:hover`| 10     |
| Element `p`          | 1      |
| Universal `*`        | 0      |

```css
/* Specificity: 1 (element) */
p { color: blue; }

/* Specificity: 10 (class) */
.text { color: green; }

/* Specificity: 11 (class + element) */
p.text { color: red; }   /* WINS over above two */

/* Specificity: 100 (ID) */
#title { color: orange; }  /* WINS over all above */
```

### `!important` — Use Sparingly!
```css
p { color: blue !important; }   /* overrides everything */
/* Avoid using this — it breaks the cascade and makes debugging hard */
```

---

## CSS Box Model

Every HTML element is a **rectangular box**. The box model defines how the space around it is calculated.

```
┌──────────────────────────────────────┐
│              MARGIN                  │
│  ┌───────────────────────────────┐   │
│  │          BORDER               │   │
│  │  ┌─────────────────────────┐  │   │
│  │  │        PADDING          │  │   │
│  │  │  ┌───────────────────┐  │  │   │
│  │  │  │     CONTENT       │  │  │   │
│  │  │  │  (width x height) │  │  │   │
│  │  │  └───────────────────┘  │  │   │
│  │  └─────────────────────────┘  │   │
│  └───────────────────────────────┘   │
└──────────────────────────────────────┘
```

```css
.box {
  width: 300px;          /* content width */
  height: 150px;         /* content height */
  padding: 20px;         /* space inside border */
  border: 2px solid black;
  margin: 30px;          /* space outside border */
}
```

### `box-sizing: border-box` (Critical!)
By default: `width` = content only. Padding and border are ADDED on top.
With `border-box`: `width` INCLUDES padding and border. Much easier to reason about.

```css
/* Apply to EVERYTHING — this is standard practice */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 300px;      /* This is the TOTAL width including padding+border */
  padding: 20px;     /* Does NOT make box bigger */
  border: 2px solid; /* Does NOT make box bigger */
}
```

---

## Styling Text & Typography

```css
/* Font Family */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Google Font (in HTML head first) */
/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"> */

/* Font Properties */
p {
  font-size: 16px;          /* size */
  font-weight: 400;         /* 100-900 (or bold, normal) */
  font-style: italic;       /* italic or normal */
  line-height: 1.6;         /* spacing between lines (unitless is best) */
  letter-spacing: 0.5px;    /* spacing between characters */
  text-align: center;       /* left, right, center, justify */
  text-decoration: none;    /* underline, line-through, none */
  text-transform: uppercase;/* uppercase, lowercase, capitalize */
  color: #333;
}

/* Headings */
h1 {
  font-size: clamp(2rem, 5vw, 4rem); /* responsive font size */
  font-weight: 700;
  line-height: 1.2;
}
```

---

## Colors in CSS

```css
.element {
  /* Named colors */
  color: red;
  
  /* Hex */
  color: #ff0000;
  color: #f00;           /* shorthand */
  
  /* RGB */
  color: rgb(255, 0, 0);
  
  /* RGBA (with opacity) */
  color: rgba(255, 0, 0, 0.5);
  
  /* HSL (Hue, Saturation, Lightness) — most intuitive */
  color: hsl(0, 100%, 50%);        /* red */
  color: hsl(240, 100%, 50%);      /* blue */
  color: hsl(120, 60%, 40%);       /* green */
  
  /* HSLA */
  color: hsla(240, 100%, 50%, 0.3);
  
  /* CSS Variables (most modern) */
  --primary: hsl(262, 83%, 58%);
  color: var(--primary);
}
```

---

## Display Property

```css
.element {
  display: block;         /* full width, stacks vertically (div, p, h1) */
  display: inline;        /* width = content, no width/height (span, a) */
  display: inline-block;  /* inline but allows width/height */
  display: flex;          /* flexbox container */
  display: grid;          /* grid container */
  display: none;          /* hidden (removed from layout) */
}
```

---

## CSS Custom Properties (Variables)

```css
/* Define in :root for global access */
:root {
  --color-primary: hsl(262, 83%, 58%);
  --color-text: hsl(220, 9%, 15%);
  --color-background: hsl(0, 0%, 100%);
  --font-size-base: 16px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
  --border-radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

/* Use variables anywhere */
.button {
  background: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

/* Dark mode support with variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: hsl(0, 0%, 95%);
    --color-background: hsl(220, 9%, 15%);
  }
}
```

---

## Key CSS Shorthand Properties

```css
.box {
  /* margin: top right bottom left */
  margin: 10px 20px 10px 20px;
  margin: 10px 20px;     /* top+bottom: 10px, left+right: 20px */
  margin: 10px;          /* all 4 sides: 10px */

  /* padding: same pattern */
  padding: 16px 24px;

  /* border */
  border: 2px solid hsl(220, 9%, 80%);

  /* background */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* font */
  font: 700 1.5rem/1.2 'Inter', sans-serif;
  /* weight size/line-height family */
}
```
