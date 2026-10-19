# SHY — A Virtual Creature

### Concept
SHY is a virtual creature created with JavaScript and p5.js. It responds to the user's mouse movement and changes its behavior based on fear, energy, and past interactions.

### Features
- **Breathing & Shape:** Uses `sin()` and `noise()` to create a breathing, organic body.
- **Movement:** Moves independently and escapes when the mouse approaches.
- **Fear:** Increases when threatened and gradually decreases when safe.
- **Energy:** Decreases while escaping and recovers when safe, affecting movement speed.
- **Evolution:** Repeated encounters increase sensitivity, expanding its detection range.
- **Visual Feedback:** Body color, size, and shape reflect its internal state.

### Class Structure
The `Creature` class stores the creature's properties and behaviors. Methods such as `update()`, `move()`, `escape()`, and `display()` control how it responds and changes over time.

### AI Assistance
I used ChatGPT to help implement and understand individual features, rather than generating the entire project at once.

**Key Prompts:**
- Help me add a breathing animation using `sin()`.
- Use `noise()` and a for loop to create an organic shape.
- Add autonomous movement and mouse detection.
- Create fear and energy systems that affect behavior.
- Make the creature evolve through interactions.
- Use `lerp()` to smooth its movement.

I tested different parameters and reviewed the code to understand how each feature works.# Hello-World-Week5-shy-virtual-creature
An interactive virtual creature built with p5.js that responds to its environment and evolves through interactions.
