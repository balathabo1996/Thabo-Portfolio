# Thabo.Portfolio

> A modern, full-stack portfolio website for **Balachandran Thabotharan** — Infrastructure Engineer & IT Professional.

Built with **Next.js 15**, **React 19**, and **MongoDB**, featuring a single-page design with dark/light theming, dynamic profile management, resume streaming, contact form email delivery, and fully documented REST APIs.

---

## Live Demo

| Environment | URL |
|---|---|
| Production | `https://thabo-portfolio.vercel.app` |
| API Docs (Swagger) | `https://thabo-portfolio.vercel.app/api-docs` |
| Local Dev | `http://localhost:3000` |

---

## Features

### User-Facing
- **Single-Page Layout** — Hero, About, Portfolio, and Contact sections on one page with smooth scroll navigation
- **Dark / Light Mode** — Toggle with persistent preference saved to `localStorage`; no flash on load
- **Scroll Reveal Animations** — Elements animate in/out using `IntersectionObserver`
- **Dynamic Tab Title & Favicon** — Browser tab updates as you scroll between sections
- **Dynamic Profile Photo** — Loaded server-side from MongoDB; falls back to a local image
- **Resume Viewer** — "View Resume" opens the latest PDF stored in MongoDB directly in the browser
- **Contact Form** — Validated form (react-hook-form) with honeypot anti-spam; delivers email via Gmail SMTP

### Technical
- **REST API** — 12 endpoints documented with OpenAPI 3.1 and testable via Swagger UI at `/api-docs`
- **Security Headers** — HSTS, CSP, X-Frame-Options, X-Content-Type-Options, and more via `next.config.mjs`
- **API Key Protection** — Profile update endpoint guarded by `x-api-key` header check
- **Mass-Assignment Protection** — Only whitelisted fields accepted on profile updates
- **PWA Ready** — `manifest.json` and theme-color viewport meta for installability

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Styling | CSS3 Custom Properties + Bootstrap 5.3 |
| Icons | Font Awesome 6 |
| Database | MongoDB Atlas (Mongoose 9) |
| Email | Nodemailer + Gmail SMTP |
| Forms | react-hook-form |
| API Docs | Swagger UI (OpenAPI 3.1) |
| Deployment | Vercel |

---

## Project Structure

```
Thabo-Portfolio/
│
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout — providers, global CSS, anti-flash script
│   ├── page.js                   # Home page (Hero · About · Portfolio · Contact)
│   ├── not-found.js              # Custom 404 "Signal Lost" page
│   │
│   ├── api/
│   │   ├── profile/route.js      # GET + PUT /api/profile
│   │   ├── experience/route.js   # GET + POST /api/experience
│   │   ├── projects/route.js     # GET + POST /api/projects
│   │   ├── contact/route.js      # POST /api/contact
│   │   ├── swagger/route.js      # GET /api/swagger  (OpenAPI JSON)
│   │   └── seed/route.js         # POST /api/seed    (Reset + Populate)
│   │
│   ├── api-docs/route.js         # GET /api-docs  (Swagger UI page)
│   └── resume/route.js           # GET /resume    (PDF stream)
│
├── components/
│   ├── Header.jsx                # Sticky nav with scroll-tracked active link
│   ├── Footer.jsx                # Social links + copyright
│   ├── ThemeProvider.jsx         # Dark/light mode context + useTheme hook
│   ├── ContactForm.jsx           # react-hook-form contact form + modal feedback
│   ├── DynamicMetadata.jsx       # Scroll-driven tab title + favicon updates
│   ├── ScrollReveal.jsx          # IntersectionObserver animation driver
│   └── ScrollToTop.jsx           # Floating theme toggle + scroll-to-top buttons
│
├── lib/
│   ├── mongodb.js                # Cached Mongoose connection (global singleton)
│   ├── swagger.js                # OpenAPI 3.0 specification (single source of truth)
│   └── models/
│       ├── Profile.js            # Mongoose schema — owner profile
│       ├── Experience.js         # Mongoose schema — work/edu history
│       ├── Project.js            # Mongoose schema — portfolio projects
│       └── Resume.js             # Mongoose schema — resume PDF binary
│
├── styles/
│   └── globals.css               # Full design system (variables, layout, animations)
│
├── public/
│   ├── images/                   # Static images (profile photo fallback)
│   ├── manifest.json             # PWA manifest
│   └── swagger-ui/               # Swagger UI assets (local — avoids CDN/CSP issues)
│
├── postman/
│   ├── Thabo-Portfolio.postman_collection.json   # All 11 API requests + test scripts
│   └── Thabo-Portfolio.postman_environment.json  # base_url + admin_api_key variables
│
├── next.config.mjs               # Security headers, image remote patterns
├── jsconfig.json                 # Path aliases (@/components, @/lib, etc.)
└── .env                          # Environment variables (git-ignored)
```

---

## API Reference

Full interactive developer documentation is available at **`/api-docs`**. This premium Swagger UI allows you to test all 11 endpoints interactively with real-time feedback.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profile` | — | Fetch owner profile (auto-creates if missing) |
| `PUT` | `/api/profile` | `x-api-key` | Update profile fields |
| `GET` | `/api/experience` | — | Fetch work, education, achievements, and voluntary work |
| `POST` | `/api/experience` | `x-api-key` | Add new work, education, achievement, or voluntary entry |
| `GET` | `/api/projects` | — | Fetch all portfolio projects |
| `POST` | `/api/projects` | `x-api-key` | Add new portfolio project |
| `GET` | `/resume` | — | Stream latest resume PDF inline |
| `POST` | `/api/resume` | `x-api-key` | Upload new resume PDF |
| `POST` | `/api/contact` | — | Send contact form email via Gmail |
| `POST` | `/api/seed` | `x-api-key` | Reset and populate DB with professional demo data |
| `GET` | `/api/swagger` | — | Raw OpenAPI 3.1 JSON spec |
| `GET` | `/api-docs` | — | Interactive Swagger UI page |

### Authentication

The `PUT /api/profile` endpoint requires an `x-api-key` header matching `ADMIN_API_KEY` in `.env`:

```http
PUT /api/profile
x-api-key: your_admin_api_key
Content-Type: application/json

{
  "profileImageUrl": "https://example.com/photo.jpg",
  "name": "Balachandran Thabotharan",
  "role": "Infrastructure Engineer",
  "bio": "Experienced IT professional.",
  "location": "Scarborough, Ontario, Canada",
  "email": "balathabo96@gmail.com",
  "phone": "+1 (437) 383-1996"
}
```

Only whitelisted fields are written — all other keys in the request body are silently ignored.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **MongoDB Atlas** account (free tier works)
- **Gmail** account with an [App Password](https://myaccount.google.com/apppasswords) enabled

### 1. Clone the repository

```bash
git clone <repository-url>
cd Thabo-Portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
MONGO_DB=Thabo-Portfolio
MONGO_COLLECTION=Resume

# Admin API key  — protects PUT /api/profile
ADMIN_API_KEY=your_strong_secret_key

# Gmail SMTP  — for contact form email delivery
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx    # Gmail App Password (not your account password)
```

### 4. Start the development server

```bash
npm run dev
```

| URL | What you see |
|---|---|
| `http://localhost:3000` | Portfolio site |
| `http://localhost:3000/api-docs` | Swagger API docs |
| `http://localhost:3000/api/swagger` | Raw OpenAPI JSON |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with hot reload |
| `npm run build` | Create an optimised production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint across the project |

---

## Dynamic Content

### Updating the Profile Photo

Send a `PUT /api/profile` request with a new `profileImageUrl`. The home page fetches the profile server-side, so the change appears immediately on the next page load — no redeployment needed.

### Uploading a New Resume

Insert a new document into the `Resume` MongoDB collection with:

```js
{
  name: "resume.pdf",
  data: <Buffer>,          // raw PDF binary
  contentType: "application/pdf",
  uploadDate: new Date()
}
```

`GET /resume` always streams the document with the **latest** `uploadDate`.

---

## Postman Collection

Two files are included in the `postman/` folder:

| File | Purpose |
|---|---|
| `Thabo-Portfolio.postman_collection.json` | All 11 requests with automated test scripts |
| `Thabo-Portfolio.postman_environment.json` | `base_url` and `admin_api_key` variables |

**Steps to use:**
1. Open Postman → **Import** both JSON files
2. Select the **Thabo Portfolio — Local** environment
3. Set `admin_api_key` to the value of `ADMIN_API_KEY` in your `.env`
4. Start the dev server and run any request

---

## Deployment

The project deploys to **Vercel** automatically on every push to `main`.

Vercel auto-detects Next.js — no additional configuration file is needed. Add all `.env` variables to your Vercel project under **Settings → Environment Variables** before deploying.

---

## Security

| Feature | Implementation |
|---|---|
| Strict security headers | HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| API key authentication | `x-api-key` header check on `PUT /api/profile` |
| Mass-assignment protection | Whitelisted fields only on profile updates |
| Bot / spam protection | Hidden honeypot field on the contact form |
| Client-side validation | react-hook-form rules on all contact form fields |
| No CDN scripts | Swagger UI assets served locally to satisfy the CSP |

---

## License

ISC License — © 2025 Balachandran Thabotharan
