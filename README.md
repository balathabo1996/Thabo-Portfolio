<div align="center">

# Thabo.Portfolio

**Infrastructure. Security. Development.**

A personal portfolio and content-management system for **Balachandran Thabotharan** — Infrastructure Engineer & IT Professional.

[Portfolio](https://thabo-portfolio.vercel.app) · [API Studio](https://thabo-portfolio.vercel.app/api-docs) · [OpenAPI JSON](https://thabo-portfolio.vercel.app/api/swagger)

![Next.js 16](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?logo=mongodb&logoColor=white)
![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-6ba539?logo=openapiinitiative&logoColor=white)

</div>

---

## At a glance

A responsive, server-rendered portfolio with a graphite-and-mint identity, animated typography, an optimized transparent portrait, project showcases, categorized skills, an experience timeline, and a contact form. A separate admin dashboard manages portfolio content, uploaded images, and display order.

| Experience | What it includes |
| --- | --- |
| **Public portfolio** | Theme switching, scroll reveals, magnetic buttons, project previews, resume links, and reduced-motion support |
| **Admin workspace** | Profile editing, projects, skills, experience, draft status, drag-and-drop ordering, media management, and JSON export |
| **API Studio** | 28 documented operations across 13 paths, request and response schemas, JWT instructions, route filtering, and interactive requests |
| **Backend services** | MongoDB persistence, Cloudinary images, Gmail SMTP delivery, and resume-click analytics |

## Contents

- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [Commands and checks](#commands-and-checks)
- [API reference](#api-reference)
- [Authentication](#authentication)
- [Content and assets](#content-and-assets)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Current behavior and limitations](#current-behavior-and-limitations)

## Run locally

**Requirements:** Node.js **20.9 or newer** (the installed Next.js requirement), npm, and a reachable MongoDB database. Cloudinary is needed for media features; a Gmail App Password is needed for contact email delivery.

1. Open the repository directory and install dependencies:

   ```bash
   npm ci
   ```

2. Create a `.env` file using the settings below. Keep it out of version control; this repository ignores `.env`.
3. Generate a signing secret, then place its output in `JWT_SECRET`:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
   ```

4. Start development:

   ```bash
   npm run dev
   ```

| Local address | Purpose |
| --- | --- |
| [localhost:3000](http://localhost:3000) | Portfolio |
| [localhost:3000/admin](http://localhost:3000/admin) | Admin login and dashboard |
| [localhost:3000/api-docs](http://localhost:3000/api-docs) | Interactive API reference |
| [localhost:3000/api/swagger](http://localhost:3000/api/swagger) | OpenAPI JSON |

## Environment variables

```dotenv
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
MONGODB_DB=thabo-portfolio

# Admin passphrase and a separate JWT signing secret
ADMIN_API_KEY=replace-with-a-strong-admin-passphrase
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters

# Gmail SMTP; use a Gmail App Password
EMAIL_USER=your-account@gmail.com
EMAIL_PASS=your-gmail-app-password

# Cloudinary image service
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

| Variable | Used for | Required by |
| --- | --- | --- |
| `MONGODB_URI`, `MONGODB_DB` | Database connection and database name | Portfolio data, content APIs, analytics, backups |
| `ADMIN_API_KEY` | Admin login passphrase | `POST /api/auth/verify` |
| `JWT_SECRET` | HS256 signing and verification; minimum 32 characters | Admin login and authenticated requests |
| `EMAIL_USER`, `EMAIL_PASS` | Gmail SMTP credentials; mail is delivered to `EMAIL_USER` | Contact form |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials | Image upload and media routes |

`MONGO_URI` and `MONGO_DB` are supported as legacy aliases. The `MONGODB_*` values take precedence. Do not prefix secrets with `NEXT_PUBLIC_` or commit populated environment files.

## Commands and checks

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Compile and generate the production build |
| `npm start` | Serve the production build |
| `npm test` | Run the security and documentation regression checks |
| `node --test tests/security.test.mjs` | Verify JWT handling and protected routes without a database |
| `node --test tests/openapi.test.mjs` | Verify route coverage, schemas, authentication declarations, and documentation HTML |

The project uses the production build and regression tests as its configured checks. There is no lint command or unused lint toolchain installed.

The security tests cover protected write methods including PATCH, authenticated backup export, public-route exceptions, token tampering, expired tokens, incorrect signing algorithms, non-admin tokens, and missing or short secrets. Documentation tests compare the specification against actual route exports to catch missing or stale operations.

## API reference

**[Open API Studio →](https://thabo-portfolio.vercel.app/api-docs)**

The maintained specification lives in [`lib/swagger.js`](lib/swagger.js). Swagger UI consumes the same document returned by `/api/swagger`. Route handlers contain implementation notes; API schemas are maintained in this single specification.

All paths below are relative to the current site. JSON is the default request/response format; upload uses multipart form data, and `/api-docs` returns HTML.

| Path | Methods | Authentication and behavior |
| --- | --- | --- |
| `/api/auth/verify` | POST | Public login; exchanges `{ "key": "…" }` for an eight-hour admin JWT |
| `/api/profile` | GET, PUT | GET is public; PUT requires JWT and accepts supported profile fields only |
| `/api/projects` | GET, POST, PUT, PATCH, DELETE | GET is public; every write requires JWT |
| `/api/experience` | GET, POST, PUT, PATCH, DELETE | GET is public; every write requires JWT |
| `/api/skills` | GET, POST, PUT, PATCH, DELETE | GET is public; every write requires JWT |
| `/api/upload` | POST | JWT required; multipart `file` plus optional `field`; images only |
| `/api/media` | GET, DELETE | GET is public and lists up to 100 assets; DELETE requires JWT and JSON `{ "public_id": "…" }` |
| `/api/contact` | POST | Public; sends email; per-instance IP rate limit and honeypot |
| `/api/analytics/resume` | GET, POST | Public; GET reads count, POST increments it without a body |
| `/api/stats` | GET | Public dashboard counts, including draft counts |
| `/api/backup` | GET | JWT required; downloads a JSON content snapshot |
| `/api/swagger` | GET | Public OpenAPI 3.1 document |
| `/api-docs` | GET | Public branded Swagger UI |

### Request conventions

- **Create:** POST a resource payload. Project creation requires `title` and `description`; experience requires `role` and `company`; skills require `name` and `category`.
- **Update:** PUT JSON containing `_id` and the fields to change. Profile PUT is a single-document update and does not use `_id`.
- **Reorder:** PATCH `{ "items": [{ "_id": "OBJECT_ID", "order": 0 }] }`.
- **Delete content:** DELETE `/api/projects?id=OBJECT_ID` (the same convention applies to experience and skills).
- **Delete media:** DELETE `/api/media` with a JSON `public_id`, not an `id` query parameter.
- **Include drafts:** Projects and experience accept `?all=true`. This is currently public. The skills GET route already returns all records, including drafts.

### Authentication

The header is named `x-api-key` for compatibility, but **its value is the JWT**, not the admin passphrase.

1. Send `POST /api/auth/verify` with JSON `{ "key": "YOUR_ADMIN_PASSPHRASE" }`.
2. Copy `token` from the response.
3. In API Studio, select **Authorize** and paste the raw token. Do not add `Bearer`.
4. Use the header below for protected requests:

   ```http
   x-api-key: YOUR_JWT_TOKEN
   ```

Tokens expire after **eight hours** and must contain `admin: true`. Missing or short `JWT_SECRET` values prevent signing and cause protected requests to be rejected. Missing `ADMIN_API_KEY` makes login return 503. Changing the signing secret invalidates existing sessions.

Swagger authorization stays in memory and is cleared on refresh. The explorer targets its current origin. **Try it out sends real requests**: mutations modify stored content, uploads use Cloudinary, and contact submissions send email.

### Examples

Read public content:

```bash
curl 'http://localhost:3000/api/projects' --header 'Accept: application/json'
```

Reorder projects with a token obtained from login:

```bash
curl --request PATCH 'http://localhost:3000/api/projects' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: YOUR_JWT_TOKEN' \
  --data '{"items":[{"_id":"6650e8f2c3d4b5e6f7a8b9c0","order":0}]}'
```

These examples use POSIX-shell quoting. On Windows, use Swagger UI or PowerShell `Invoke-RestMethod` with the equivalent headers and body. Use placeholders in shared examples, never real tokens.

### Response conventions

| Status | Current use |
| --- | --- |
| `200` | Successful read, update, reorder, delete, login, upload, contact, or analytics operation |
| `201` | Project, experience, or skill created |
| `400` | Missing IDs, missing upload file or media ID, invalid reorder shape, or no supported profile fields |
| `401` | Invalid login credentials or missing/invalid admin JWT |
| `415` | Unsupported upload MIME type |
| `429` | Contact endpoint rate limit exceeded |
| `500` | Server, database, configuration, schema validation, or upstream-service failure |
| `503` | Admin login passphrase is not configured |

Most errors return `{ "error": "…" }`; some also include `success: false`. PUT routes for projects, experience, and skills currently return `null` with 200 when the ID has no matching record; they do not return 404. See each operation in Swagger for its actual responses.

## Content and assets

- **Profile:** Manage identity, biography, contact information, mission text, and resume URL through the admin dashboard.
- **Homepage portrait:** The current hero explicitly uses [`public/images/thabo-cutout.png`](public/images/thabo-cutout.png), optimized through Next.js Image. Updating `profileImageUrl` in the CMS does not replace this local hero asset.
- **Projects, experience, skills:** Publish or draft entries and reorder them in the admin dashboard. The homepage excludes drafts.
- **Images:** `/api/upload` stores images in Cloudinary under `thabo-portfolio` with a `field_timestamp` public ID. It returns a secure URL. The upload route does not accept resume PDFs.
- **Resume:** Store a shareable document URL in `resumeUrl`. The resume button appears when that field is populated. Analytics count clicks, not confirmed downloads.
- **Backup:** `/api/backup` exports profile, projects, experiences, and skills, including drafts. It does not include analytics, image file contents, or environment variables. There is no restore API.

## Project structure

```text
app/
  (site)/                  Public portfolio page and layout
  admin/                   Admin login and CMS
  api/                     Content, auth, contact, media, analytics, and docs routes
  api-docs/route.js        Branded API Studio HTML
  layout.js                Fonts, theme provider, global styles, and scrolling
  opengraph-image.jsx      Social-sharing image
  robots.js / sitemap.js   Search-engine discovery
components/                Portfolio sections and interaction components
lib/
  auth.js                  HS256 token signing and verification
  mongodb.js               Cached Mongoose connection
  models/                  Profile, Project, Experience, Skill, and Analytics
  swagger.js               Maintained OpenAPI specification
styles/
  globals.css              Shared design system and existing component styles
  studio.css               Scoped public portfolio styling
public/                    Icons, manifest, project images, and portrait
tests/                     Security and documentation regression checks
proxy.js                   API authorization boundary
```

The OpenAPI document is the current API reference. Import `/api/swagger` into an API client when a collection is needed.

## Deployment

The project is configured for standard Next.js hosting; the listed production URL uses Vercel.

1. Configure the environment variables in your hosting provider. Local `.env` changes are not copied to deployment settings.
2. Allow the deployment environment to reach MongoDB and the required upstream services.
3. Run the security and documentation tests, then `npm run build`.
4. Deploy the Next.js application. For a self-hosted Node deployment, run `npm start` after building.
5. Verify public content, admin login, an authenticated update, contact delivery, media upload, and `/api-docs` in the deployed environment.

The build fetches the existing Google Fonts through `next/font/google`, so build-time internet access is required. Swagger UI uses pinned CDN assets and needs an internet connection for its interactive interface; `/api/swagger` remains directly available without those assets.

## Current behavior and limitations

- **Draft status is presentation filtering, not confidentiality.** Public `?all=true` content reads, skill reads, and statistics can expose draft data or counts. Do not store private material there.
- **Contact validation differs between frontend and server.** The frontend validates required fields, email syntax, and message length. The server currently handles honeypot and rate limiting without repeating all field validation.
- **Rate limiting is in memory per server instance.** It is not a shared distributed limit and resets when the process restarts.
- **Database reads are dynamic.** The portfolio uses `revalidate = 0`; database failure can leave dynamic sections empty while fallback profile text remains.
- **Browser support needs device verification.** Responsive layouts, touch targets, visual fallbacks, reduced-motion handling, and high-contrast adjustments are implemented. They do not replace testing on Safari, Firefox, Edge, Chrome, iOS, and Android.
- **Animation respects reduced-motion preferences.** The capability strip also provides a pause control. The previously added 3D background was removed.

For future API changes, update `lib/swagger.js` and run the documentation coverage test so the explorer and route inventory stay aligned.
