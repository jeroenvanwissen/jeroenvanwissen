---
title: "Hello World - Welcome to my GitHub Profile"
date: 2026-02-26
description: "First post on my auto-generated GitHub profile README. Here's how it works."
---

# Hello World

Welcome to my GitHub profile! This README is **auto-generated** using a custom TypeScript script that runs as a GitHub Action.

## How it works

1. A GitHub Action runs on a schedule (weekly) and on every push
2. It fetches my latest GitHub stats via the GitHub API
3. Generates animated SVGs for language stats, profile stats, and social badges
4. Scans the `/posts` directory for markdown files with YAML frontmatter
5. Assembles everything into a fresh `README.md`

## Writing a new post

To add a new post, simply create a markdown file in the `posts/` directory with the following frontmatter:

```yaml
---
title: "Your Post Title"
date: 2026-02-26
description: "A short description of your post"
---
```

The post will automatically appear in the **Latest Posts** section of the README on the next generation cycle.

## Tech Stack

- **TypeScript** with `tsx` for running scripts
- **Octokit** for GitHub API access
- **gray-matter** for parsing YAML frontmatter
- **CSS animations** in SVGs (no JavaScript needed)

---

_Thanks for visiting!_
