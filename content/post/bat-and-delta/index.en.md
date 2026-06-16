+++
title = 'Code Presentation at the Next Level: bat and delta in the Terminal'
date = "2026-06-16T10:38:34+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Terminal",
    "Git",
    "Rust",
    "Software",
]
+++

Anyone who spends a lot of time in the console knows the classics: `cat` for quickly viewing files and `git diff` for checking code changes. Both have served their purpose for decades, but visually they remain stuck in the past. Yesterday, I discovered two modern CLI tools and immediately installed them on my system to replace these classics: **bat** and **delta**.

Both tools are written in Rust, extremely performant, and elevate the rendering of code to a whole new level. Here is my tool presentation and how I have seamlessly integrated them into my Zsh and Git configurations.

<!--more-->

## 🦇 bat: A cat Clone on Steroids

`bat` is a modern replacement for the standard `cat` command. While `cat` simply dumps raw text to the terminal, `bat` shines with several handy features:

- **Syntax Highlighting:** Supports a wide range of programming and markup languages out of the box.
- **Git Integration:** Shows modified lines in the left gutter (added `+`, modified `~`, or deleted `-` lines) relative to the last Git commit.
- **Line Numbers:** Makes reading and referencing specific lines of code much easier.
- **Automatic Paging:** If a file is longer than the screen, `bat` automatically pipes the output to a pager (like `less`), allowing you to scroll and search comfortably.

A simple invocation is all it takes:
```bash
bat index.en.md
```

---

## 📐 delta: Perfect Diffs for Git

If you regularly review code or inspect your own changes, you'll be familiar with `git diff`. The default output is functional but can quickly get confusing, especially with complex changes. This is where `delta` (also known as `git-delta`) comes in.

`delta` acts as a pager for Git output. It reads standard diffs and formats them visually:

- **Intra-line Highlighting (Word-level diffs):** It doesn't just highlight modified lines; it also uses a more intense color to highlight the exact words that changed.
- **Syntax Highlighting in Diffs:** Even within a diff, the code is colored according to the programming language.
- **Line Numbers & Side-by-Side View:** Supports showing diffs in two columns side-by-side as well as clean, separate line number columns for old and new versions.

### My Git Configuration

I configured `delta` globally in my `~/.gitconfig`:

```ini
[core]
	pager = delta
[interactive]
	diffFilter = delta --color-only
[delta]
	navigate = true
	light = false
	line-numbers = true
[merge]
	conflictstyle = zdiff3
```

**What do these settings mean in detail?**

1. **`core.pager = delta`**: Routes all Git output (such as `git diff` or `git log`) through `delta` by default.
2. **`interactive.diffFilter = delta --color-only`**: Ensures that the beautiful color formatting is preserved even when staging changes interactively (`git add -p`).
3. **`delta.navigate = true`**: Enables navigating between changed code blocks (hunks) in the pager using the `n` and `N` keys.
4. **`delta.light = false`**: Optimizes the color scheme for a dark terminal theme.
5. **`delta.line-numbers = true`**: Activates classic line numbers in the diff output, making orientation much easier.
6. **`merge.conflictstyle = zdiff3`**: This is a modern Git conflict style. In case of a conflict, it shows the common ancestor version alongside your changes and their changes. `delta` formats these three-part conflicts beautifully, making conflict resolution much less stressful.

---

## 🐚 Zsh Integration: Smart Overriding for cat and diff

Using standard shell aliases like `alias cat="bat"` can break scripts or pipelines, as tools that process the text output of `cat` are usually not prepared for ANSI color escape sequences or line numbers. My solution is dynamically loading custom Zsh functions (using `autoload` in my `~/.zshrc`).

### 1. Smart `cat`
My custom Zsh function checks if stdout is a terminal/TTY (`[[ -t 1 ]]`). Only then does it execute `bat`. For pipelines (e.g., `cat file.txt | grep ...`), it automatically falls back to standard `cat` to keep things compatible:

```zsh
if [[ -t 1 ]] && command -v bat >/dev/null 2>&1; then
    bat "$@"
else
    command cat "$@"
fi
```

### 2. Side-by-Side `diff`
Similarly, the `diff` command is overridden. If run directly in the terminal, it utilizes the side-by-side view of `delta`. Otherwise, it falls back to the original GNU `diff`:

```zsh
if [[ -t 1 ]] && command -v delta >/dev/null 2>&1; then
    delta --side-by-side "$@"
else
    command diff "$@"
fi
```

---

## 🌐 HTML Diffs at Your Fingertips: `htmldiff`

As a handy addition, I use a Zsh helper function called `htmldiff`. It generates a colorful, side-by-side HTML comparison of any two files and saves it to disk (ideal for sharing diffs via email or viewing them in a browser).

It achieves this by combining `delta` with the utility `ansifilter`:

```zsh
# Zsh-Funktion: htmldiff
# Erstellt einen farbigen HTML-Diff von zwei Dateien mittels delta und ansifilter.
local fileA="$1"
local fileB="$2"

# ... (checks for files and tools existence) ...

local timestamp
zmodload zsh/datetime
strftime -s timestamp "%Y%m%d%H%M%S"

local nameA="${fileA:t}"
local nameB="${fileB:t}"
local outfile="${nameA}_${nameB}_diff_${timestamp}.html"

# Generate diff with delta and save as HTML via ansifilter
delta -s --light --no-gitconfig --file-decoration-style blue --hunk-header-decoration-style blue "$fileA" "$fileB" | ansifilter --html --encoding=utf-8 > "$outfile"
```

The `--light` flag ensures that the generated HTML is perfectly readable against the browser's default light background.

---

## Conclusion: Is the Switch Worth It?

Absolutely. If you spend a lot of time in the terminal, you will benefit greatly from the improved readability. Since both `bat` and `delta` are written in Rust, there is no noticeable overhead or delay – the tools feel just as fast as their decades-old predecessors but bring the comfort of a modern IDE right to your command line, without breaking old pipelines.

Do you already use modern alternatives to the classic Unix utilities? Let me know in the comments!

73 de DO3EET
