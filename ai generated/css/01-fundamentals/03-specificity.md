# Specificity and The Cascade: The Rules of CSS

Why did my CSS rule not apply? 99% of the time, the answer is **Specificity**.

If two selectors target the *same* element with conflicting rules, the browser calculates which selector is "stronger".

## 1. The Specificity Hierarchy

Think of specificity as a 4-digit score: `(Inline, IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements)`

Here are the values from strongest to weakest:

1. `!important` – Overrides EVERYTHING. **DO NOT USE IT** unless you maintain a legacy tool/plugin overriding inline styles.
2. `style="..."` (Inline styles) - Score: **1,0,0,0**
3. `#id` (ID selectors) - Score: **0,1,0,0**
4. `.class`, `[style="text"]`, `:hover` (Classes, attributes, pseudo-classes) - Score: **0,0,1,0**
5. `div`, `p`, `::before` (Elements, pseudo-elements) - Score: **0,0,0,1**
6. `*` (Universal selector) - Score: **0,0,0,0**
7. Inherited values - No score, easily overridden.

## 2. Calculating the Score

Let's test some selectors!

```css
/* Score: 0, 0, 0, 1 (1 element) */
h1 { color: red; }

/* Score: 0, 0, 1, 0 (1 class) */
.title { color: blue; }

/* Score: 0, 0, 1, 1 (1 class, 1 element) */
.title h1 { color: green; }

/* Score: 0, 1, 0, 0 (1 ID) */
#main-heading { color: orange; }

/* Score: 0, 1, 1, 2 (1 ID, 1 class, 2 elements) */
#main-heading .container h1 span { color: purple; }
```

If the score is a tie, the **Cascade** rules apply: The rule defined *last* in the CSS file wins.

## 3. The `!important` Nightmare (Interview Question!)

```css
.button {
  background: red !important; /* Forces red forever */
}
```
**Q: When is it acceptable to use `!important`?**
A: Almost never. The only valid use cases are:
1. Overriding third-party library styles you cannot edit directly.
2. Utility classes in systems like Tailwind (`.hidden { display: none !important; }`).

## 4. Modern Specificity Controls: `:where` and `:is`

CSS recently introduced ways to bypass specificity math!

### `:is()`
Takes the specificity of its **most specific** argument.
```css
:is(header, #main, .sidebar) p {
  /* Takes the specificity of #main (ID) */
}
```

### `:where()`
Takes NO specificity (**0,0,0,0**). Amazing for resetting base styles!
```css
:where(.card, article, aside) {
  /* You can easily override this later with just a simple class! */
}
```

## 5. CSS Layers (`@layer`)

A brand-new feature to control cascading without fighting specificity scores!

```css
@layer base, components, utilities;

@layer base {
  /* Everything here is lowest priority */
  h1 { color: red; }
}

@layer utilities {
  /* Everything here beats `base` and `components`, NO MATTER THE SPECIFICITY SCORE */
  .text-blue { color: blue; } 
}
```
Even if `h1#very-specific` is in `base`, `.text-blue` in `utilities` will win!

## ✍️ Practice Exercise
Create `index.html`. Add: `<h1 id="heading" class="title" style="color: black;">Hello</h1>`
Then create `style.css`:
```css
h1 { color: pink; }
.title { color: green; }
#heading { color: blue; }
```
1. Without running it, what color is the text?
2. Remove the inline `style` attribute. What color now?
3. Remove the ID. What color now?

## 💡 Best Practice
Keep specificity low! Do not use IDs for styling. Avoid deeply nesting selectors. Use flat class structures.
