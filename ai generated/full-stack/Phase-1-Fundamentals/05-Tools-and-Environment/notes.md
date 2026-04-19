# 🛠️ Tools & Development Environment

## IDEs — Integrated Development Environments

### What is an IDE?
An **IDE (Integrated Development Environment)** is a software application that provides comprehensive tools for writing, editing, debugging, and running code — all in one place.

Without an IDE: Writing code in Notepad with no formatting, hints, or error detection.
With an IDE: Code completion, syntax highlighting, debugging, terminal, extensions — everything in one place.

---

### Types of IDEs

| Type             | Examples                        | Best For                     |
|------------------|---------------------------------|------------------------------|
| Full IDE         | IntelliJ IDEA, Eclipse, Xcode   | Java, C++, iOS development   |
| Lightweight IDE  | VS Code, Sublime Text           | Web dev, multi-language       |
| Online IDE       | CodeSandbox, StackBlitz, Replit | Quick prototyping, sharing   |
| Language-specific| PyCharm (Python), WebStorm (JS) | Deep integration with one language|

---

### VS Code — The Industry Standard for Web Dev

**Visual Studio Code** (VS Code) is a free, open-source, lightweight IDE by Microsoft. It's the #1 used editor for web developers.

#### Why VS Code?
- **Fast** and lightweight (unlike full IDEs).
- **Huge extension marketplace** (over 50,000 extensions).
- **Built-in Git** integration.
- **IntelliSense** — smart code completion.
- **Debugger** built in.
- **Integrated terminal**.

#### Essential VS Code Extensions for Full-Stack Dev:
```
Must Have:
├── ESLint                  — JavaScript linting
├── Prettier               — Code formatting
├── GitLens                — Git superpowers
├── Thunder Client         — API testing (like Postman)
├── Tailwind CSS IntelliSense — CSS class autocomplete
├── Prisma                 — Prisma ORM support
├── Error Lens             — Inline error highlighting
└── Auto Rename Tag        — Rename HTML tags simultaneously

Theme & Aesthetics:
├── One Dark Pro           — Popular dark theme
├── Material Icon Theme    — File icons
└── Catppuccin             — Modern pastel theme
```

#### Key VS Code Shortcuts:
| Shortcut          | Action                          |
|-------------------|---------------------------------|
| `Ctrl + P`        | Open file quickly               |
| `Ctrl + Shift + P`| Command palette                 |
| `Ctrl + ~`        | Open integrated terminal        |
| `Ctrl + D`        | Select next occurrence          |
| `Alt + Click`     | Multiple cursors                |
| `Ctrl + /`        | Toggle comment                  |
| `F2`              | Rename symbol across files      |
| `Ctrl + B`        | Toggle sidebar                  |

---

### AI in IDEs

Modern AI tools are deeply integrated into IDEs to supercharge developer productivity:

| AI Tool         | Type               | What it does                               |
|-----------------|--------------------|--------------------------------------------|
| GitHub Copilot  | VS Code Extension  | AI code completion & generation            |
| Cursor          | Full IDE           | AI-native editor (built on VS Code)        |
| Windsurf        | Full IDE           | Agent-based AI coding                      |
| Codeium         | Extension          | Free alternative to Copilot                |
| Tabnine         | Extension          | AI completion, local & cloud               |

#### AI Best Practices:
- ✅ Use AI to generate boilerplate (CRUD routes, form components).
- ✅ Use AI to explain unfamiliar code.
- ✅ Use AI to write tests.
- ❌ Don't blindly copy AI output — always understand what it generates.
- ❌ Don't use AI as a substitute for learning fundamentals.

---

## Terminal / Command Line

### Why Learn the Terminal?
The terminal is the **most powerful tool** a developer has. Many tasks are impossible (or impractical) without it:
- Running servers, scripts, tests.
- Managing files and directories.
- Using Git.
- Installing packages (npm, pip).
- Connecting to remote servers (SSH).

### Essential Commands:

#### Navigation
```bash
pwd                   # print working directory (where am I?)
ls                    # list files in current directory
ls -la                # list ALL files including hidden, with details
cd folderName         # change directory into folderName
cd ..                 # go up one level
cd ~                  # go to home directory
cd /                  # go to root directory
```

#### File & Folder Operations
```bash
mkdir myFolder        # create a new directory
touch myFile.txt      # create a new empty file
cp source.txt dest.txt              # copy a file
cp -r sourceDir/ destDir/           # copy a directory recursively
mv oldName.txt newName.txt          # rename or move a file
rm myFile.txt                       # delete a file (careful!)
rm -rf myFolder/                    # delete a folder (be very careful!)
cat myFile.txt                      # display file content
```

#### Searching & Finding
```bash
find . -name "*.js"              # find all .js files from current directory
grep "searchTerm" file.txt       # search for text inside a file
grep -r "searchTerm" ./src       # search recursively in a folder
```

#### Process & System
```bash
Ctrl + C              # kill current running process
Ctrl + Z              # pause/suspend process
ps aux                # list running processes
kill 1234             # kill process with PID 1234
clear                 # clear the terminal
```

---

## Version Control — Git & GitHub

### Why Version Control?
Without version control:
- "I accidentally deleted a week's worth of work!"
- "Which version of the file is the latest?"
- "How do I collaborate without overwriting each other's changes?"

Version control tracks **every change** you make to your code, who made it, and when.

---

### Git — The Tool
**Git** is a **distributed version control system** (VCS). It runs **locally** on your machine.

#### Core Concepts:
| Term       | Meaning                                                   |
|------------|-----------------------------------------------------------|
| Repository | A project folder tracked by Git                           |
| Commit     | A saved snapshot of your code at a point in time          |
| Branch     | An isolated line of development                           |
| Merge      | Combining changes from one branch into another            |
| Clone      | Copying a remote repository to your local machine         |
| Pull       | Fetching and merging remote changes into local            |
| Push       | Sending local commits to remote repository               |

#### Daily Git Workflow:
```bash
# 1. Initialize a new repo
git init

# 2. Check status of changes
git status

# 3. Stage changes for commit
git add index.html          # add a specific file
git add .                   # add ALL changed files

# 4. Commit with a message
git commit -m "Add navigation bar"

# 5. See commit history
git log --oneline

# 6. Create and switch to a new branch
git checkout -b feature/login

# 7. Merge a branch into main
git checkout main
git merge feature/login

# 8. Connect to remote repo (GitHub)
git remote add origin https://github.com/user/repo.git

# 9. Push to GitHub
git push origin main

# 10. Pull latest changes
git pull origin main
```

---

### GitHub — The Platform
**GitHub** is a cloud platform that hosts Git repositories and adds:
- **Collaboration** (pull requests, code reviews).
- **Issue tracking**.
- **CI/CD pipelines** (GitHub Actions).
- **Project boards**.
- **GitHub Pages** (free static hosting).

#### Key GitHub Concepts:
| Concept         | What it is                                              |
|-----------------|---------------------------------------------------------|
| Repository      | A project hosted on GitHub                              |
| Fork            | Your personal copy of someone else's repo               |
| Pull Request    | Proposing changes to be merged into a branch            |
| Issues          | Bug reports, feature requests, tasks                    |
| GitHub Actions  | Automated CI/CD workflows                               |

---

## AI Assistance — Do's, Don'ts & Options

### ✅ Do's
- Use AI to **understand concepts** — "Explain this code to me."
- Use AI to **generate boilerplate** — CRUD operations, config files.
- Use AI to **debug errors** — paste error message, get suggestions.
- Use AI to **write tests** — unit tests, integration tests.
- Use AI to **refactor code** — "Make this function cleaner."
- **Always review and understand** what AI generates before using it.

### ❌ Don'ts
- Don't use AI as a **substitute for learning** the fundamentals.
- Don't blindly copy AI output — it can produce **wrong or insecure code**.
- Don't use AI for **sensitive information** (API keys, passwords, company code).
- Don't skip understanding — if you can't explain what the AI wrote, you don't own it.

### 🤖 Available AI Options

| Tool            | Type         | Strengths                          |
|-----------------|--------------|------------------------------------|
| GitHub Copilot  | IDE Plugin   | In-editor code completion          |
| Cursor          | IDE          | Agent mode, codebase context       |
| ChatGPT         | Web/API      | Great for explanations, planning   |
| Claude          | Web/API      | Long context, nuanced reasoning    |
| Gemini          | Web/API      | Google integration, multimodal     |
| Perplexity      | Web          | Research with citations            |
| v0.dev          | Web          | UI component generation            |

---

## Summary

```
Development Toolkit:

  IDE (VS Code)
  ├── Write & Edit Code (IntelliSense, highlighting)
  ├── Debug (Breakpoints, watch variables)
  ├── Terminal (run scripts, servers)
  ├── Git Integration (stage, commit, push)
  └── Extensions (ESLint, Prettier, AI tools)

  Terminal
  ├── Navigate filesystem
  ├── Run Node.js scripts
  ├── Use Git commands
  └── Manage processes

  Git + GitHub
  ├── Track all code changes
  ├── Branch for features
  ├── Collaborate via PRs
  └── Store code safely in the cloud
```
