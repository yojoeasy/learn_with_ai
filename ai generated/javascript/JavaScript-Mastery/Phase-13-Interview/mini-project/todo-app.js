/**
 * ==========================================
 * PHASE 13 MINI PROJECT: TODO APP (VANILLA)
 * ==========================================
 * 
 * WHY THIS PROJECT MATTERS:
 * It demonstrates how to manage "State" and "UI" without a framework.
 * 
 * Features:
 * 1. State-to-UI Binding (The manual way).
 * 2. Performance-first Event Delegation (Phase 7).
 * 3. Persistence (Phase 13.1 - LocalStorage).
 * 4. Filter logic (Functional Programming).
 */

"use strict";

class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem("todos")) || [];
        this.listElement = document.getElementById("todo-list");
        this.inputElement = document.getElementById("todo-input");
        this.filterElement = document.getElementById("todo-filter");

        this.init();
    }

    init() {
        // Event Listeners
        document.getElementById("todo-form").addEventListener("submit", (e) => {
            e.preventDefault();
            this.addTodo(this.inputElement.value);
            this.inputElement.value = "";
        });

        // 1. EVENT DELEGATION: One listener for all todo items
        this.listElement.addEventListener("click", (e) => {
            const id = e.target.closest("li")?.dataset.id;
            if (!id) return;

            if (e.target.classList.contains("delete-btn")) {
                this.deleteTodo(id);
            } else if (e.target.classList.contains("toggle-btn")) {
                this.toggleTodo(id);
            }
        });

        this.filterElement.addEventListener("change", () => this.render());

        this.render();
    }

    addTodo(text) {
        if (!text.trim()) return;
        const newTodo = {
            id: Date.now().toString(),
            text,
            completed: false
        };
        this.todos.push(newTodo);
        this.saveAndRender();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveAndRender();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        this.saveAndRender();
    }

    saveAndRender() {
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.render();
    }

    render() {
        const filter = this.filterElement.value;
        const filteredTodos = this.todos.filter(t => {
            if (filter === "active") return !t.completed;
            if (filter === "completed") return t.completed;
            return true;
        });

        // 2. PERFORMANCE: Efficient rendering via template strings
        // In a real app with 10k items, we'd use Virtual DOM (Phase 10)
        this.listElement.innerHTML = filteredTodos.map(todo => `
            <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
                <span>${this.escapeHTML(todo.text)}</span>
                <div class="actions">
                    <button class="toggle-btn">${todo.completed ? 'Undo' : 'Done'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </li>
        `).join("");
    }

    /**
     * 3. SECURITY: Prevent XSS (Phase 11.1)
     */
    escapeHTML(str) {
        const p = document.createElement("p");
        p.textContent = str;
        return p.innerHTML;
    }
}

// --- INITIALIZE ---
// document.addEventListener("DOMContentLoaded", () => new TodoApp());

/**
 * SENIOR HIGHLIGHTS:
 * - Data Integrity: State (`this.todos`) is the source of truth. UI is 
 *   just a reflection of State.
 * - Robustness: Using `closest()` for event delegation ensures that 
 *   clicking a span inside the 'li' still works correctly.
 * - Scalability: The `render()` method handles filtering logic seamlessly.
 */
