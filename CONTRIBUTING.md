# Contributing to XTND Design System

## Prerequisites

- A modern browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local server) or any static file server
- Git

No npm install, no build tools, no dependencies to set up.

## Local Development

```bash
# Clone the repo
git clone git@github.com:innomizetech/cc-design-system.git
cd cc-design-system

# Start a local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080/ui_kit/
```

That's it. Edit any `.jsx` or `.css` file, refresh the browser, and see changes immediately.

**Tip:** Use hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) to avoid Babel caching stale code.

## Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-description
```

### 2. Make Changes

- Edit files in `ui_kit/` for components
- Edit `components.css` or `ui_kit/data-grid/data-grid.css` for styles
- Edit `colors_and_type.css` for design tokens

### 3. Test Locally

- Start local server and verify in browser
- Check browser console for JavaScript errors
- Navigate to all affected screens
- Test both light and dark themes
- Test all three density modes on DataGrid pages (compact/default/comfortable)

### 4. Open a Pull Request

```bash
git add .
git commit -m "Brief description of change"
git push -u origin your-branch-name
```

Then open a PR on GitHub. Netlify will automatically generate a **deploy preview** — a unique URL where reviewers can see your changes live without running anything locally.

### 5. Review Cycle

- Reviewers check the Netlify preview link (posted as a comment on the PR)
- Address feedback, push new commits
- Preview updates automatically on each push

## Deploy Preview

Every pull request gets an automatic Netlify deploy preview. The Netlify bot comments on the PR with a link like:

```
https://deploy-preview-42--your-site.netlify.app
```

Use this to review visual changes before merging. No setup required — it's automatic.

## Production Deployment

The `main` branch auto-deploys to Netlify at:

**https://cc-design-system.netlify.app/ui_kit/**

Merging a PR to `main` triggers deployment automatically.

## Project Structure

```
cc-design-system/
├── colors_and_type.css    # Design tokens (colors, typography, spacing, density)
├── components.css         # Shared component styles
├── fonts/                 # Web fonts (Inter, JetBrains Mono)
├── docs/                  # Design specifications
├── ui_kit/                # React components (JSX, transpiled in-browser)
│   ├── index.html         # App entry point
│   ├── data-grid/         # DataGrid component system
│   └── *.jsx              # Individual components
├── CLAUDE.md              # AI/LLM guide for this codebase
└── AGENTS.md              # Agent-specific instructions
```

## Key Conventions

### No Build Step

This project uses React + Babel Standalone — JSX is transpiled in the browser. There is no webpack, vite, or npm. Don't add build tools.

### CSS Naming

- All classes use `x-` prefix: `.x-btn`, `.x-grid`, `.x-card`
- Variants use BEM modifiers: `.x-btn--primary`, `.x-badge--success`
- State uses `is-` prefix: `.is-active`, `.is-collapsed`

### Design Tokens

Use semantic tokens, not raw values:

```css
/* Good */
color: var(--fg-2);
background: var(--bg-surface);
padding: var(--sp-4);

/* Bad */
color: #6b7280;
background: #ffffff;
padding: 16px;
```

### Component Exports

Every component file must export to `window` at the bottom:

```jsx
Object.assign(window, { YourComponent });
```

### Script Loading

When adding a new `.jsx` file, add a `<script type="text/babel" src="...">` tag in `ui_kit/index.html`. Order matters — place it after any files it depends on.

## Design Specs

Detailed design documentation lives in `docs/`:

- `design-system.md` — Full specification (tokens, patterns, principles, components)
- `datagrid-toolbar.md` — DataGrid toolbar layout and interaction spec

Read these before making significant design changes.

## Questions?

Open an issue on GitHub or reach out to the team.
