# Real-world UI Components

It is time to apply the fundamentals to actual UI patterns you will build constantly.

Here is the HTML and CSS breakdown for 3 essential components.

## 1. The Sticky Dropdown Navbar

**The Goal:** A top bar that stays on screen, spaces logo and links apart, and features a dropdown menu.

```html
<nav class="navbar">
  <div class="navbar__logo">Brand</div>
  <ul class="navbar__links">
    <li><a href="#">Home</a></li>
    <li class="dropdown-parent">
      <a href="#">Services 👇</a>
      <ul class="dropdown-menu"> <!-- Initially hidden! -->
        <li><a href="#">Design</a></li>
        <li><a href="#">Code</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between; /* Pushes logo left, links right */
  align-items: center; /* Vertically centers them */
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #eee;
  
  position: sticky; /* Makes it follow the user scrolling! */
  top: 0;
  z-index: 1000; /* Stays above the main content layer */
}

.navbar__links {
  display: flex;
  gap: 1.5rem;   /* Spacing between the main links */
  list-style: none; /* Removes bullet points */
}

/* The Dropdown Magic */
.dropdown-parent {
  position: relative; /* This traps the absolute dropdown menu to the word "Services" */
}

.dropdown-menu {
  position: absolute;
  top: 100%; /* Sits exactly below the "Services" text */
  left: 0;
  background-color: white;
  min-width: 150px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* Floating effect */
  display: none; /* Hide it entirely on load */
}

/* When the user hovers over the parent <li>, change the display of the child <ul> */
.dropdown-parent:hover .dropdown-menu {
  display: block;
}
```

## 2. The Marketing Card Layout (Grid)

**The Goal:** A classic profile or product card that automatically adjusts columns.

```html
<div class="card-grid">
  <!-- Card 1 -->
  <article class="card">
    <img src="mountain.jpg" alt="Mountains" class="card__img">
    <div class="card__content">
      <h3 class="card__title">The Great Peaks</h3>
      <p class="card__desc">A wonderful hike full of views.</p>
    </div>
  </article>
  <!-- Keep adding identical cards... -->
</div>
```

```css
/* The Auto-Responsive Grid! */
.card-grid {
  display: grid;
  gap: 2rem;
  /* Automatically fill the screen with 300px min columns */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 2rem;
}

.card {
  display: flex;
  flex-direction: column; /* Stacks image and content vertically */
  background: white;
  border-radius: 8px;
  overflow: hidden; /* Clips the image's sharp corners to match the border-radius! */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px); /* Lift the card up slightly on hover! */
  box-shadow: 0 10px 15px rgba(0,0,0,0.1); /* Enhance the shadow dynamically */
}

.card__img {
  width: 100%;
  height: 200px;
  object-fit: cover; /* PERFECT image cropping */
}

.card__content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Spaces the heading from the paragraph automatically */
}
```

## ✍️ Practice Exercise
Take the code from the Marketing Card Layout above and paste it into an `.html`/`.css` file. Try resizing your browser from massive desktop width to tiny mobile width. Watch how CSS Grid reflows from 4 columns down to 1 automatically without a single media query required!

## 💡 Best Practice
Component design should be self-contained. The `.card` should never rely on the `.card-grid` to look correct. The `.card` should styling its internal padding and spacing perfectly, trusting the parent Grid to set its external width boundaries.
