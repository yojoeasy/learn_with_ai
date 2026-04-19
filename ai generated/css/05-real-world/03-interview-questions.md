# Senior CSS Interview Questions

If you understand everything in this roadmap, you will crush these questions. 

## 1. The Classics

**Q: Explain the Box Model.**
**A:** (See Phase 1) The box model dictates how elements occupy space. From the inside out: Content, Padding, Border, Margin. By default, `width` only applies to Content, which often breaks layouts when paddings are added. We fix this by globally resetting `box-sizing: border-box;`.

**Q: What is Specificity, and how is it calculated?**
**A:** (See Phase 1) It's the algorithm browsers use to decide which CSS rule applies to an element when multiple rules conflict. It is scored based on four tiers: `inline styles` > `IDs` > `Classes/Attributes/Pseudo-classes` > `Elements/Pseudo-elements`. The `!important` flag overrides all math.

**Q: What is the difference between `display: none` and `visibility: hidden`?**
**A:** `display: none` removes the element entirely from the DOM layout flow. It takes up 0px of space and screen readers ignore it. `visibility: hidden` makes the element visually transparent, but it still physically occupies its layout space and pushes other elements around.

## 2. Advanced Layout Scenarios

**Q: You have an image with `width: 100%;` inside a `div`. Why is there a tiny 4px gap below the image, and how do you remove it?**
**A:** Images are `inline` elements by default in CSS, meaning they sit on the "baseline" of text typography. That 4px gap is reserved space for hanging letters like 'g' or 'p'.
To fix it, either set the image to `display: block;` or set its `vertical-align: bottom;`.

**Q: How do you perfectly center a `div` both horizontally and vertically? Provide 3 different ways.**
**A:**
1. **Flexbox (The Best):** `display: flex; justify-content: center; align-items: center;` on the parent.
2. **Grid (The Shortest):** `display: grid; place-items: center;` on the parent.
3. **Absolute (The Old Way):** `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);` on the child itself.

**Q: What is a Stacking Context, and why is `z-index: 9999` not working on my modal?**
**A:** (See Phase 3) `z-index` only works on positioned elements (`relative`, `absolute`, `fixed`). If the modal's parent element has created a new stacking context (via `position: relative` + `z-index`, or properties like `opacity: 0.9` or `transform`), the modal is forever trapped inside that parent layer and cannot sit "above" elements outside of it, no matter how high its z-index is.

## 3. Performance & Architecture

**Q: What is the Critical Rendering Path?**
**A:** (See Phase 4) HTML -> DOM, CSS -> CSSOM. They combine into the Render Tree. Then Layout (geometry calculation) -> Paint (rasterizing pixels) -> Composite (layering on GPU).

**Q: How do you optimize CSS for performance?**
**A:** 
1. Avoid layout thrashing (animating `width` or `margin`). Only animate `transform` and `opacity` to utilize the GPU Composite layer.
2. Minify and Purge unused CSS in production builds.
3. Use `contain` properties for complex widgets.
4. Keep specificity flat (BEM or utility-classes) so the browser maps styles to elements faster.

**Q: What are the pros and cons of Utility-First CSS (like Tailwind)?**
**A:**
*Pros:* Prevents global CSS scope bloat (file sizes stay tiny). No specificity wars. Eliminates the need to invent class names. Ensures strict adherence to a design token system. Fast component building.
*Cons:* HTML becomes extremely ugly and verbose. Learning curve for the utility abbreviations.

## ✍️ Practice Exercise
Read these questions aloud and try to answer them from memory. If you stumble, return to the respective Phase and re-read the core concepts!

## 💡 Best Practice
Interviews are dialogues. If you don't know an exact CSS property name (e.g., "I forget if it's `object-fit` or `background-size`"), explicitly state the concept you are trying to describe: "I would use a property that zooms the image into the container without breaking its intrinsic aspect ratio". You will pass the technical screen on the concept alone.
