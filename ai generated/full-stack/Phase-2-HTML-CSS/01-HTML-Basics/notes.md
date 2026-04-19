# 📄 HTML — HyperText Markup Language

## What is HTML?
**HTML (HyperText Markup Language)** is the standard language for creating web pages. It describes the **structure and content** of a page. It is NOT a programming language — it's a markup language.

Think of HTML as the **skeleton** of a webpage.
- CSS is the **skin and clothes** (styling).
- JavaScript is the **muscles** (behaviour).

---

## HTML Document Structure

Every HTML file follows this basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Metadata — not visible on page -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
</head>
<body>
  <!-- Visible content goes here -->
  <h1>Hello World</h1>
</body>
</html>
```

| Part            | Purpose                                    |
|-----------------|--------------------------------------------|
| `<!DOCTYPE html>` | Tells the browser this is HTML5           |
| `<html>`        | Root element of the page                   |
| `<head>`        | Metadata (title, charset, links to CSS/JS) |
| `<body>`        | All visible page content                   |

---

## HTML Tags and Elements

### Anatomy of an HTML Element:
```
<tagname attribute="value"> Content </tagname>
    │          │                │         │
  Opening    Attribute        Content   Closing
   Tag                                   Tag

Example:
<a href="https://google.com"> Visit Google </a>
```

### Some elements are self-closing (void elements):
```html
<img src="photo.jpg" alt="My Photo" />
<input type="text" placeholder="Enter name" />
<br />
<hr />
<link rel="stylesheet" href="style.css" />
<meta charset="UTF-8" />
```

---

## Common HTML Tags

### Headings (h1–h6)
```html
<h1>Most Important Heading</h1>   <!-- Only 1 per page (SEO) -->
<h2>Section Title</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
<h5>Minor heading</h5>
<h6>Least Important</h6>
```

### Text
```html
<p>This is a paragraph.</p>
<strong>Bold / important text</strong>
<em>Italic / emphasized text</em>
<br />              <!-- line break -->
<hr />              <!-- horizontal rule (divider) -->
<span>Inline text container</span>
<pre>Preformatted text (preserves whitespace)</pre>
<code>Inline code snippet</code>
<blockquote>A block quotation from another source</blockquote>
```

### Links & Images
```html
<!-- Link -->
<a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
<!-- target="_blank" opens in new tab -->
<!-- rel="noopener" is a security best practice -->

<!-- Image -->
<img src="./images/logo.png" alt="Company Logo" width="200" />
<!-- alt = accessibility text (shown if image fails to load) -->
```

### Lists
```html
<!-- Unordered (bullet points) -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<!-- Ordered (numbered) -->
<ol>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
</ol>

<!-- Description list -->
<dl>
  <dt>HTML</dt>
  <dd>Markup language for web structure</dd>
  <dt>CSS</dt>
  <dd>Styling language for web design</dd>
</dl>
```

### Tables
```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>28</td>
      <td>Mumbai</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>32</td>
      <td>Delhi</td>
    </tr>
  </tbody>
</table>
```

---

## Semantic HTML

**Semantic HTML** uses tags that **describe their meaning** — both to the browser and to developers (and screen readers).

### Non-Semantic vs Semantic:
```html
<!-- ❌ Non-Semantic (a div soup) -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">
  <div class="article">...</div>
</div>
<div class="footer">...</div>

<!-- ✅ Semantic (self-describing) -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

### Key Semantic Tags:
| Tag         | Purpose                                         |
|-------------|-------------------------------------------------|
| `<header>`  | Introductory content, logo, nav at top          |
| `<nav>`     | Navigation links                                |
| `<main>`    | Primary content (only ONE per page)             |
| `<article>` | Self-contained, independently distributable content |
| `<section>` | Thematic group of content with a heading        |
| `<aside>`   | Related but secondary content (sidebar)         |
| `<footer>`  | Closing content, copyright, links               |
| `<figure>`  | Images, diagrams with a caption                 |
| `<figcaption>`| Caption for a `<figure>`                     |
| `<time>`    | Date/time                                       |
| `<mark>`    | Highlighted text                                |

### Why Semantic HTML Matters:
1. **SEO** — Search engines understand your page structure better.
2. **Accessibility** — Screen readers navigate by semantic landmarks.
3. **Maintainability** — Easier to read and work with.
4. **Browser defaults** — Some semantic tags have useful default styles.

---

## HTML Forms & Inputs

```html
<form action="/submit" method="POST">

  <!-- Text Input -->
  <label for="name">Full Name:</label>
  <input type="text" id="name" name="name" placeholder="John Doe" required />

  <!-- Email -->
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required />

  <!-- Password -->
  <input type="password" id="password" name="password" minlength="8" />

  <!-- Number -->
  <input type="number" name="age" min="18" max="100" />

  <!-- Date -->
  <input type="date" name="birthday" />

  <!-- Telephone -->
  <input type="tel" name="phone" pattern="[0-9]{10}" />

  <!-- Color picker -->
  <input type="color" name="theme" value="#ff0000" />

  <!-- Range slider -->
  <input type="range" name="volume" min="0" max="100" value="50" />

  <!-- Textarea (multi-line) -->
  <textarea name="message" rows="5" cols="40" placeholder="Your message..."></textarea>

  <!-- Select (dropdown) -->
  <select name="country">
    <option value="">-- Select Country --</option>
    <option value="in">India</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
  </select>

  <!-- Checkboxes -->
  <input type="checkbox" id="terms" name="terms" required />
  <label for="terms">I agree to terms</label>

  <!-- Radio buttons -->
  <input type="radio" id="male" name="gender" value="male" />
  <label for="male">Male</label>
  <input type="radio" id="female" name="gender" value="female" />
  <label for="female">Female</label>

  <!-- File upload -->
  <input type="file" name="resume" accept=".pdf,.doc" />

  <!-- Submit button -->
  <button type="submit">Submit Form</button>

</form>
```

---

## HTML Attributes (Important Ones)

| Attribute    | Used On       | Purpose                                    |
|--------------|---------------|--------------------------------------------|
| `id`         | Any element   | Unique identifier (for JS/CSS)             |
| `class`      | Any element   | CSS class name (can be shared)             |
| `href`       | `<a>`         | Link URL                                   |
| `src`        | `<img>`, `<script>` | Source file path                   |
| `alt`        | `<img>`       | Alternative text (accessibility)           |
| `type`       | `<input>`, `<button>` | Specifies input/button type      |
| `name`       | Form inputs   | Field name submitted with the form          |
| `value`      | Inputs        | Default or submitted value                 |
| `placeholder`| Inputs        | Hint text shown inside empty input         |
| `required`   | Inputs        | Makes field mandatory                      |
| `disabled`   | Any           | Disables interaction                       |
| `data-*`     | Any element   | Custom data attributes for JavaScript      |

```html
<!-- data attributes example -->
<button data-user-id="42" data-action="delete">Delete User</button>
```
```js
const btn = document.querySelector('button');
console.log(btn.dataset.userId); // "42"
console.log(btn.dataset.action); // "delete"
```

---

## Complete HTML Page Example

See `skeleton.html` in this folder for a complete, well-structured HTML page example with semantic markup.
