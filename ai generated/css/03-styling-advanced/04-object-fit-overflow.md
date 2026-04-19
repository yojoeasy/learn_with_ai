# Handling Chaos: Default Behaviors (Overflow & Object-Fit)

Web content is messy. Text gets too long, images are the wrong aspect ratio, and users zoom in. Learning how to contain chaos distinguishes seniors from juniors.

## 1. The Image Aspect Ratio Problem (`object-fit`)

When an image is forced into a box that doesn't match its aspect ratio, it stretches and stretches. It looks terrible.

### The old way (`background-image`)
We used to solve this by setting images as CSS backgrounds.
`background-size: cover; background-position: center;`

### The Modern Way (`object-fit`)
Keep your semantic `<img>` tags for accessibility and SEO, but style them instantly.

```css
.thumbnail {
  width: 200px;
  height: 200px; /* Forced square */
  
  /* The magic property */
  object-fit: cover; /* Zooms into the image so it covers the 200x200 area without squishing it */
  object-position: center; /* Centers the zoomed crop */
}
```

Other `object-fit` values:
- `contain`: Scales the whole image down to fit inside the box (letterboxing).
- `fill`: Stretches it (default, bad).
- `scale-down`: Picks the smallest of `none` or `contain`.

*Fun Fact:* Modern CSS also added `aspect-ratio`! Very useful for hero videos.
```css
.video-wrapper { aspect-ratio: 16 / 9; }
```

## 2. Text Overflow (Truncation)

When user-generated headlines or names are too long, they wrap and break designs. Truncate them with an ellipsis `...`.

### Single-line Truncation (The classic 3-liner)
You must apply these exact three properties to a block-level element:
```css
.card-title {
  white-space: nowrap; /* Prevents text from wrapping to the second line */
  overflow: hidden;    /* Hides the text that bursts out of the width */
  text-overflow: ellipsis; /* Adds the "..." at the end! */
}
```

### Multi-line Truncation (Line Clamping)
What if you want a paragraph to show 3 lines and THEN add `...`?

```css
.card-summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* Limit text to exactly 3 lines */
  overflow: hidden;      /* Hide the rest */
}
```

## 3. Box Overflow (Scrollbars)

When content overflows a box vertically or horizontally.

```css
.scrollable-list {
  height: 300px;
  /* Adds a scrollbar ONLY if content exceeds 300px. If not, no ugly scrollbar! */
  overflow-y: auto; 
}
```

### The `overflow-wrap: break-word` Lifesaver
If a user inputs a massive unbroken string of text (e.g. `Heeeeeeeeeeeelllllloooo`), it will blow out the side of its container width on mobile! Add this to your base CSS resetting.

```css
p, h1, h2, h3, a {
  /* Forces the browser to break the long "word" to the next line rather than exploding out the box */
  overflow-wrap: break-word; 
}
```

## ✍️ Practice Exercise
1. Find a massive horizontal landscape image on Unsplash. Download it.
2. Put it in an `<img>` tag. Force the image to be `width: 300px; height: 500px`. Notice how squished it looks.
3. Apply `object-fit: cover`. Notice how it perfectly crops into a vertical thumbnail!

## 💡 Best Practice
You should *never* stretch an image. Period. Always apply `object-fit: cover` to thumbnails or profile pictures, and set an explicit `aspect-ratio` if you don't use absolute widths.
