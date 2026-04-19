# ✨ Advanced CSS — Animations, Pseudo-elements & More

## Pseudo-classes & Pseudo-elements (Deep Dive)

### Pseudo-classes (element STATE):
```css
/* Link states */
a:link    { color: blue; }        /* unvisited */
a:visited { color: purple; }      /* visited */
a:hover   { color: orange; }      /* mouse over */
a:active  { color: red; }         /* being clicked */

/* Form states */
input:focus          { outline: 2px solid #4f46e5; }
input:focus-visible  { outline: 2px solid #4f46e5; } /* keyboard focus only */
input:invalid        { border-color: red; }
input:valid          { border-color: green; }
input:checked        { accent-color: #4f46e5; }
input:disabled       { opacity: 0.5; cursor: not-allowed; }

/* Structural */
li:first-child   { }
li:last-child    { }
li:nth-child(2)  { }
li:nth-child(3n) { }          /* every 3rd */
li:nth-child(odd)  { }
li:nth-child(even) { }
p:only-child     { }          /* only child of parent */
:empty           { display: none; }  /* no child nodes */
p:not(.special)  { }         /* everything except .special */

/* Target (URL hash) */
:target { background: yellow; }  /* element matching #hash in URL */
```

---

## CSS Animations

### Transitions (simple state changes):
```css
.button {
  background: #4f46e5;
  transform: scale(1);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  /* transition: property duration timing-function delay */
  transition: all 0.3s ease;
  /* or specific properties: */
  transition: background 0.2s ease, transform 0.15s ease;
}

.button:hover {
  background: #4338ca;
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
```

### Timing Functions:
```css
transition: all 0.3s ease;          /* slow start + end, fast middle */
transition: all 0.3s ease-in;       /* slow start */
transition: all 0.3s ease-out;      /* slow end */
transition: all 0.3s ease-in-out;   /* slow start AND end */
transition: all 0.3s linear;        /* constant speed */
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* bounce */
```

### Keyframe Animations:
```css
/* Define the animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Multi-step animation */
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes slideIn {
  0%   { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

/* Apply animation */
.card {
  animation: fadeIn 0.5s ease-out forwards;
  /* animation: name duration timing fill-mode */
}

.dot {
  animation: pulse 1.5s ease-in-out infinite;
  /* infinite = loops forever */
}
```

### All Animation Properties:
```css
.element {
  animation-name: fadeIn;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-delay: 0.1s;           /* wait before starting */
  animation-iteration-count: 1;    /* how many times (or infinite) */
  animation-direction: normal;     /* normal, reverse, alternate */
  animation-fill-mode: forwards;   /* keep final state after animation */
  animation-play-state: running;   /* or paused */

  /* Shorthand */
  animation: fadeIn 0.5s ease 0.1s 1 normal forwards;
}
```

---

## CSS Transforms

```css
.element {
  /* Translate (move) */
  transform: translate(50px, 20px);    /* X and Y */
  transform: translateX(50px);
  transform: translateY(-20px);
  transform: translateZ(100px);        /* 3D depth */

  /* Scale */
  transform: scale(1.2);              /* 120% size */
  transform: scaleX(2);               /* stretch horizontally */
  transform: scale(0.8, 1.2);         /* different X and Y */

  /* Rotate */
  transform: rotate(45deg);
  transform: rotateX(180deg);         /* flip horizontally */
  transform: rotateY(180deg);         /* flip vertically */
  transform: rotate3d(1, 1, 0, 45deg);

  /* Skew */
  transform: skew(10deg, 5deg);

  /* Multiple transforms (chain them) */
  transform: translateY(-10px) scale(1.05) rotate(5deg);
}
```

---

## Shadows & Gradients

### Box Shadow:
```css
.card {
  /* box-shadow: x-offset y-offset blur spread color */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);

  /* Inset shadow (inside) */
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);

  /* Glow effect */
  box-shadow: 0 0 20px hsl(262, 83%, 58%, 0.4);

  /* Multiple shadows */
  box-shadow: 0 1px 2px rgba(0,0,0,0.05),
              0 4px 8px rgba(0,0,0,0.1),
              0 16px 32px rgba(0,0,0,0.15);
}
```

### Text Shadow:
```css
h1 {
  /* text-shadow: x-offset y-offset blur color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  /* Glow effect */
  text-shadow: 0 0 10px hsl(262, 83%, 58%);
}
```

### Gradients:
```css
.element {
  /* Linear gradient */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background: linear-gradient(to right, #f093fb, #f5576c);
  background: linear-gradient(to bottom right, #4facfe 0%, #00f2fe 100%);

  /* Multiple color stops */
  background: linear-gradient(
    135deg,
    hsl(262, 83%, 58%) 0%,
    hsl(291, 64%, 42%) 50%,
    hsl(340, 75%, 55%) 100%
  );

  /* Radial gradient (circle from center) */
  background: radial-gradient(circle, #667eea, #764ba2);
  background: radial-gradient(ellipse at top, #667eea, transparent);

  /* Conic gradient (pie chart style) */
  background: conic-gradient(from 0deg, red, yellow, green, blue, red);

  /* Gradient on text */
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Styling Links, Buttons and Forms for Better UX

### Buttons:
```css
.btn {
  /* Reset browser defaults */
  appearance: none;
  border: none;
  cursor: pointer;
  
  /* Styling */
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: hsl(262, 83%, 58%);
  color: white;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  
  /* Smooth transitions */
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  
  /* Accessibility - focus visible ring */
  outline: none;
}

.btn:hover {
  background: hsl(262, 83%, 50%);
  transform: translateY(-1px);
  box-shadow: 0 8px 16px hsla(262, 83%, 58%, 0.3);
}

.btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn:focus-visible {
  outline: 2px solid hsl(262, 83%, 58%);
  outline-offset: 3px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Form Inputs:
```css
input, textarea, select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid hsl(220, 9%, 80%);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  background: white;
  color: hsl(220, 9%, 15%);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

input:focus, textarea:focus {
  border-color: hsl(262, 83%, 58%);
  box-shadow: 0 0 0 3px hsla(262, 83%, 58%, 0.15);
}

input:invalid:not(:placeholder-shown) {
  border-color: hsl(357, 75%, 55%);
}
```

---

## CSS Frameworks Overview

### Bootstrap
- Oldest, most widely used.
- Component-based: predefined `btn`, `card`, `navbar` classes.
- Built-in responsive grid system.
- Best for: rapid prototyping, admin dashboards.

```html
<button class="btn btn-primary">Submit</button>
<div class="container">
  <div class="row">
    <div class="col-md-6 col-12">...</div>
  </div>
</div>
```

### Tailwind CSS
- **Utility-first**: compose styles from small utility classes.
- No pre-built components — you build them yourself.
- Highly customizable.
- Best for: custom designs, modern apps.

```html
<button class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
  Submit
</button>
```

---

## Popular CSS Libraries

| Library          | What it provides                         |
|------------------|------------------------------------------|
| Tailwind CSS     | Utility-first CSS framework              |
| Bootstrap        | Pre-built components + responsive grid   |
| Shadcn/ui        | Copy-paste components (with Tailwind)    |
| Animate.css      | CSS animation classes                    |
| Normalize.css    | Cross-browser consistent default styles  |
| DaisyUI          | Tailwind component library               |
