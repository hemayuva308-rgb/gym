# 🔥 ForgeFit — Gym Fitness Website

A full-stack gym website with Node.js/Express backend and vanilla HTML/CSS/JS frontend.

## Tech Stack
- **Frontend**: HTML5, CSS3 (custom properties, grid, flexbox), Vanilla JS (fetch API, IntersectionObserver)
- **Backend**: Node.js + Express.js
- **Fonts**: Barlow Condensed (display) + DM Sans (body) via Google Fonts
- **Security**: Helmet, CORS, express-rate-limit

## Project Structure
```
forgefit/
├── server.js              # Express backend
├── package.json
├── .env
└── public/
    ├── index.html         # Main page (all 10 sections)
    ├── css/
    │   └── style.css      # All styles (dark theme)
    └── js/
        └── main.js        # API calls + UI logic
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/stats | Gym stats (members, retention, etc.) |
| GET | /api/programs | All programs (filter by ?category=) |
| GET | /api/trainers | Trainer profiles |
| GET | /api/pricing | Membership plans |
| GET | /api/testimonials | Member testimonials |
| POST | /api/contact | Contact form submission |
| POST | /api/membership | Membership signup |
| POST | /api/newsletter | Newsletter subscription |
| GET | /api/admin/summary | Admin overview |

## Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
open http://localhost:3000
```

## Color Palette
| Color | HEX | Usage |
|-------|-----|-------|
| Primary Red | `#E8293B` | CTAs, accents, borders |
| Gold | `#F5A623` | Stats, labels, icons |
| BG Dark | `#0D0D0D` | Hero, footer backgrounds |
| BG Mid | `#111111` | About, trainers sections |
| Card | `#141414` | All card backgrounds |
| Border | `#2A2A2A` | Card borders |
| Text | `#F5F4F0` | Primary text |
| Muted | `#8A8A8A` | Subtitles, body text |

## Fonts
- **Barlow Condensed 700/900** — All headings, stats, logo
- **DM Sans 400/500/600/700** — Body text, buttons, labels

## Production Notes
- Replace in-memory `db` object in `server.js` with a real database (MongoDB/PostgreSQL)
- Add real SMTP credentials in `.env` for email notifications
- Add real hero/trainer/gallery images in `/public/images/`
- Deploy to: Railway, Render, Vercel, or any Node.js host
