# Thabo.Portfolio

> A modern, full-stack portfolio website for **Balachandran Thabotharan** — Infrastructure Engineer & IT Professional.

Built with **Next.js 16**, **React 19**, **MongoDB**, and **Cloudinary**, featuring a single-page design with dark theming, dynamic profile management, Google Drive resume linking, contact form email delivery, and fully documented REST APIs.

---

## Live Demo

| Environment | URL |
|---|---|
| Production | `https://thabo-portfolio.vercel.app` |
| API Docs (Swagger) | `https://thabo-portfolio.vercel.app/api-docs` |
| Admin Dashboard | `https://thabo-portfolio.vercel.app/admin` |
| Local Dev | `http://localhost:3000` |

---

## Features

### User-Facing
- **Lenis Smooth Scrolling** — Buttery-smooth, physics-based scrolling interpolation across the entire app
- **Magnetic Micro-Interactions** — Buttons and social links follow the user's cursor using Framer Motion spring physics
- **Fluid Animated Typography** — Hero headers feature flowing, continuous liquid color gradients
- **Cyber-Network Particle Engine** — An ambient, physics-driven canvas background that flows continuously
- **Glassmorphism & 3D Depth** — Frosted glass navigation bars and project cards that physically tilt and lift on hover
- **Dynamic Profile Photo** — Uploaded to Cloudinary via the Admin Dashboard; served globally via CDN
- **Resume Link** — "View Resume" opens a Google Drive PDF link; managed via the Admin Dashboard
- **Contact Form** — Validated form (react-hook-form) with honeypot anti-spam and backend IP rate limiting; delivers email via Gmail SMTP
- **Custom 404 Page** — Dark-mode "Signal Lost" page with glitch animation for any unknown routes

### Technical
- **Admin CMS Dashboard** — Protected by `x-api-key`; manage profile, experience, projects, and skills from a single UI at `/admin`
- **Cloudinary Image Uploads** — Profile photo uploads go directly to Cloudinary with automatic overwrite (`overwrite: true`)
- **REST API** — 10 endpoints documented with OpenAPI 3.1 and testable via Swagger UI at `/api-docs`
- **Security Headers** — HSTS, X-Frame-Options, X-Content-Type-Options, and more via `next.config.mjs`
- **API Key Protection** — Write endpoints guarded by `x-api-key` header check
- **Mass-Assignment Protection** — Only whitelisted fields accepted on profile updates
- **PWA Ready** — `manifest.json` and theme-color viewport meta for installability
- **ISR Disabled** — `revalidate = 0` ensures all pages are always dynamically rendered from live DB data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI Library | React 19 |
| Styling | CSS3 Custom Properties + Bootstrap 5.3 |
| Animations | Framer Motion + Lenis Smooth Scroll |
| Icons | Font Awesome 6 |
| Database | MongoDB Atlas (Mongoose 9) |
| Image Hosting | Cloudinary (free tier — images only) |
| Resume Hosting | Google Drive (shareable PDF link) |
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
│   ├── layout.js                 # Root layout — global CSS, fonts, providers
│   ├── not-found.js              # Custom 404 "Signal Lost" page
│   │
│   ├── (site)/
│   │   ├── layout.js             # Site layout — Header, Footer, DynamicMetadata
│   │   └── page.js               # Home page (Hero · Mission · Experience · Projects · Skills · Contact)
│   │
│   ├── admin/
│   │   └── page.jsx              # Admin CMS Dashboard (protected by x-api-key)
│   │
│   ├── api/
│   │   ├── profile/route.js      # GET + PUT /api/profile
│   │   ├── experience/route.js   # GET + POST + PUT + DELETE /api/experience
│   │   ├── projects/route.js     # GET + POST + PUT + DELETE /api/projects
│   │   ├── skills/route.js       # GET + POST + PUT + DELETE /api/skills
│   │   ├── analytics/resume/     # POST /api/analytics/resume (download tracking)
│   │   ├── contact/route.js      # POST /api/contact
│   │   ├── upload/route.js       # POST /api/upload (Cloudinary image upload)
│   │   ├── swagger/route.js      # GET /api/swagger  (OpenAPI JSON)
│   │   └── api-docs/             # GET /api-docs  (Swagger UI page)
│   │
│   └── opengraph-image.jsx       # Dynamic OG image generation
│
├── components/
│   ├── Hero.jsx                  # Hero section with profile photo and resume button
│   ├── Header.jsx                # Frosted glass nav with scroll-tracked active link
│   ├── Footer.jsx                # Social links + copyright
│   ├── ResumeButton.jsx          # CTA button — tracks clicks, opens Google Drive PDF
│   ├── ContactForm.jsx           # react-hook-form contact form + modal feedback
│   ├── DynamicMetadata.jsx       # Scroll-driven tab title + favicon updates
│   ├── SmoothScrolling.jsx       # Lenis physics-based smooth scroll engine
│   ├── Magnetic.jsx              # Framer motion spring physics for buttons
│   ├── NetworkBackground.jsx     # Ambient HTML5 Canvas particle background
│   └── ScrollToTop.jsx           # Floating scroll-to-top button
│
├── lib/
│   ├── mongodb.js                # Cached Mongoose connection (global singleton)
│   ├── swagger.js                # OpenAPI 3.1 specification (single source of truth)
│   └── models/
│       ├── Profile.js            # Mongoose schema — owner profile
│       ├── Experience.js         # Mongoose schema — work/edu history
│       ├── Project.js            # Mongoose schema — portfolio projects
│       └── Skill.js              # Mongoose schema — skills
│
├── styles/
│   └── globals.css               # Full design system (variables, layout, animations)
│
├── public/
│   ├── favicon.png               # Site favicon
│   ├── manifest.json             # PWA manifest
│   └── apple-icon.png            # Apple touch icon
│
├── postman/
│   ├── Thabo-Portfolio.postman_collection.json   # API requests + test scripts
│   └── Thabo-Portfolio.postman_environment.json  # base_url + admin_api_key variables
│
├── next.config.mjs               # Security headers, Cloudinary + Drive image domains
├── jsconfig.json                 # Path aliases (@/components, @/lib, etc.)
└── .env                          # Environment variables (git-ignored)
```

---

## API Reference

Full interactive documentation available at **`/api-docs`**.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profile` | — | Fetch owner profile (auto-creates if missing) |
| `PUT` | `/api/profile` | `x-api-key` | Update whitelisted profile fields |
| `GET` | `/api/experience` | — | Fetch all experience entries |
| `POST` | `/api/experience` | `x-api-key` | Add new experience entry |
| `PUT` | `/api/experience` | `x-api-key` | Update experience entry by ID |
| `DELETE` | `/api/experience` | `x-api-key` | Delete experience entry by ID |
| `GET` | `/api/projects` | — | Fetch all portfolio projects |
| `POST` | `/api/projects` | `x-api-key` | Add new project |
| `PUT` | `/api/projects` | `x-api-key` | Update project by ID |
| `DELETE` | `/api/projects` | `x-api-key` | Delete project by ID |
| `GET` | `/api/skills` | — | Fetch all skills |
| `POST` | `/api/skills` | `x-api-key` | Add new skill |
| `PUT` | `/api/skills` | `x-api-key` | Update skill by ID |
| `DELETE` | `/api/skills` | `x-api-key` | Delete skill by ID |
| `POST` | `/api/upload` | `x-api-key` | Upload profile image to Cloudinary |
| `POST` | `/api/contact` | — | Send contact form email via Gmail |
| `POST` | `/api/analytics/resume` | — | Track resume download click |
| `GET` | `/api/swagger` | — | Raw OpenAPI 3.1 JSON spec |
| `GET` | `/api-docs` | — | Interactive Swagger UI page |

### Authentication

All write endpoints require an `x-api-key` header:

```http
PUT /api/profile
x-api-key: your_admin_api_key
Content-Type: application/json

{
  "profileImageUrl": "https://res.cloudinary.com/...",
  "resumeUrl": "https://drive.google.com/file/d/.../view",
  "firstName": "Balachandran",
  "lastName": "Thabotharan",
  "role": "Infrastructure Engineer",
  "location": "Scarborough, Ontario, Canada",
  "email": "balathabo96@gmail.com",
  "phone": "(437) 383-1996"
}
```

Only whitelisted fields are written — all other keys are silently ignored.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **MongoDB Atlas** account (free tier works)
- **Gmail** account with an [App Password](https://myaccount.google.com/apppasswords) enabled
- **Cloudinary** account (free tier — for profile image uploads)

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

# Admin API key — protects all write endpoints
ADMIN_API_KEY=your_strong_secret_key

# Gmail SMTP — for contact form email delivery
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx    # Gmail App Password

# Cloudinary — for profile image uploads (images only)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the development server

```bash
npm run dev
```

| URL | What you see |
|---|---|
| `http://localhost:3000` | Portfolio site |
| `http://localhost:3000/admin` | Admin CMS Dashboard |
| `http://localhost:3000/api-docs` | Swagger API docs |
| `http://localhost:3000/api/swagger` | Raw OpenAPI JSON |

---

## Admin Dashboard

The Admin Dashboard at `/admin` is a protected CMS that lets you manage all dynamic content without touching code:

| Section | What you can do |
|---|---|
| **Overview** | View resume download stats |
| **Profile** | Update name, title, bio, contact info, upload profile photo to Cloudinary, set resume Google Drive link |
| **Projects** | Add, edit, delete portfolio projects |
| **Experience** | Add, edit, delete work/education entries |
| **Skills** | Add, edit, delete skills with category and icon |

**Authentication:** Enter your `ADMIN_API_KEY` from `.env` on the login screen.

---

## Asset Management

### Profile Image
- Uploaded directly from the Admin Dashboard → Profile tab
- Stored on **Cloudinary** with automatic CDN delivery and cache invalidation
- Overwrites the previous image on re-upload (fixed `public_id: profileImageUrl`)

### Resume
- Store your PDF on **Google Drive**
- Share it as "Anyone with the link can view"
- Paste the shareable link into Admin Dashboard → Profile → Resume URL field
- The "View Resume" button opens the PDF in Google Drive's built-in viewer

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Create an optimised production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint across the project |

---

## Postman Collection

Two files are included in the `postman/` folder:

| File | Purpose |
|---|---|
| `Thabo-Portfolio.postman_collection.json` | API requests with automated test scripts |
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
| Strict security headers | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| API key authentication | `x-api-key` header check on all write endpoints |
| Mass-assignment protection | Whitelisted fields only on profile updates |
| Bot / spam protection | Hidden honeypot field on the contact form |
| Client-side validation | react-hook-form rules on all contact form fields |
| Cloudinary access control | `access_mode: 'public'` enforced on all uploads |

---

## License

ISC License — © 2026 Balachandran Thabotharan
