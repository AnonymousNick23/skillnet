# SkillNest

A small learning-platform front end: landing page, sign up / log in, dashboard,
course catalogue and settings. Vanilla HTML, CSS and JavaScript — no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

Then visit http://localhost:8000

## Files

| File | What it does |
| --- | --- |
| `index.html` | Landing page with the SkillNest mark and the two entry points |
| `signup.html` / `login.html` | Account forms with inline validation |
| `dashboard.html` | Stats, enrolled courses with progress, activity feed |
| `explore.html` | Course catalogue with working search and category filters |
| `settings.html` | Profile fields, photo upload, dark mode, email updates |
| `styles.css` | The one stylesheet every page uses |
| `app.js` | Shared state, route guard, mobile nav, course catalogue |
| `logo.svg` | The nest mark, also used as the favicon |

## How the "account" works

Everything lives in `localStorage` under the key `skillnest:user`. That makes the
flow demo-able without a server, but it is **not** authentication — the password
sits in the browser in plain text and anyone with devtools can read or change it.

When you add a backend, replace `store.signUp`, `store.logIn` and `store.logOut`
in `app.js` with fetch calls to your API, hash passwords server-side, and keep the
session in an httpOnly cookie rather than localStorage. The rest of the UI reads
from `store`, so the pages won't need to change.

## Breakpoints

- Above 1000px — full layout, sidebar pinned
- 1000px — stats and cards drop to two columns, panels stack
- 860px — sidebar becomes a slide-in drawer behind the ☰ button
- 520px — single column throughout
# skillnet
