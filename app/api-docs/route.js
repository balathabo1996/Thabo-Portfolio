/**
 * Swagger UI Page  —  app/api-docs/route.js
 * ==========================================
 * GET /api-docs — Returns a fully styled, self-contained HTML page that
 * renders the interactive Swagger UI using locally served assets (no CDN).
 *
 * Assets served from /public/swagger-ui/ (copied from node_modules/swagger-ui-react)
 * so the page works within the strict Content-Security-Policy set in next.config.mjs.
 *
 * The OpenAPI spec is embedded directly — no extra network request needed.
 * Raw JSON spec is also available at GET /api/swagger.
 */
import swaggerSpec from '@/lib/swagger';

export async function GET() {
  /* Escape </script> so it cannot break the HTML parser */
  const specJson = JSON.stringify(swaggerSpec).replace(/<\/script>/gi, '<\\/script>');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Docs | Thabo.Portfolio</title>
  <meta name="description" content="Interactive REST API documentation for Thabo.Portfolio" />
  <link rel="stylesheet" href="/swagger-ui/swagger-ui.css" />

  <style>
    /* ─── Reset ─────────────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f1f5f9;
      min-height: 100vh;
      color: #1e293b;
    }

    /* ─── Top Navigation Bar ─────────────────────────────────────── */
    .topnav {
      background: #0f172a;
      padding: 0 36px;
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 999;
      box-shadow: 0 2px 16px rgba(0,0,0,0.45);
    }

    .topnav-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
    }

    /* ── Swagger icon ── */
    .swagger-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 6px rgba(133,234,45,0.4));
    }

    .brand-text { display: flex; flex-direction: column; line-height: 1.2; }
    .brand-text .name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.3px;
    }
    .brand-text .name em { color: #60a5fa; font-style: normal; }
    .brand-text .sub {
      font-size: 0.68rem;
      color: #64748b;
      font-weight: 500;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .topnav-actions { display: flex; align-items: center; gap: 10px; }

    .btn-nav {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-nav.outline {
      color: #94a3b8;
      border: 1px solid #1e293b;
      background: transparent;
    }
    .btn-nav.outline:hover {
      color: #f1f5f9;
      background: #1e293b;
      border-color: #334155;
    }
    .btn-nav.primary {
      color: #0f172a;
      background: #85EA2D;
      border: 1px solid transparent;
      font-weight: 700;
    }
    .btn-nav.primary:hover {
      background: #74d124;
      box-shadow: 0 4px 14px rgba(133,234,45,0.35);
      transform: translateY(-1px);
    }
    .btn-nav svg { flex-shrink: 0; }

    /* ─── Hero / Info Bar ────────────────────────────────────────── */
    .hero-bar {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 32px 36px;
      border-bottom: 1px solid #1e293b;
    }
    .hero-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 28px;
    }

    .hero-left .api-name {
      font-size: 1.85rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 6px;
    }
    .version-tag {
      display: inline-flex;
      align-items: center;
      background: rgba(133,234,45,0.12);
      color: #85EA2D;
      border: 1px solid rgba(133,234,45,0.3);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }
    .hero-left .api-desc {
      color: #94a3b8;
      font-size: 0.88rem;
      line-height: 1.65;
      max-width: 580px;
    }

    /* Stat cards */
    .stats { display: flex; gap: 6px; flex-wrap: wrap; }
    .stat-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      padding: 14px 22px;
      text-align: center;
      min-width: 80px;
      transition: border-color 0.2s;
    }
    .stat-card:hover { border-color: rgba(96,165,250,0.3); }
    .stat-num {
      font-size: 1.9rem;
      font-weight: 800;
      color: #60a5fa;
      line-height: 1;
      margin-bottom: 3px;
    }
    .stat-label {
      font-size: 0.65rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 600;
    }

    /* ─── Swagger UI Container ───────────────────────────────────── */
    .sw-wrap {
      max-width: 1280px;
      margin: 0 auto;
      padding: 28px 24px 100px;
    }

    /* ─── Swagger UI Overrides ───────────────────────────────────── */

    /* Hide elements we've replaced */
    .swagger-ui .topbar       { display: none !important; }
    .swagger-ui .info         { display: none !important; }

    /* Server selector */
    .swagger-ui .scheme-container {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      padding: 18px 24px !important;
      margin-bottom: 24px !important;
    }

    /* Tag / group headings */
    .swagger-ui .opblock-tag {
      font-size: 1.05rem !important;
      font-weight: 700 !important;
      color: #0f172a !important;
      border-bottom: 2px solid #e2e8f0 !important;
      padding: 14px 0 10px !important;
      margin: 0 !important;
    }
    .swagger-ui .opblock-tag:hover { background: transparent !important; }

    /* Operation blocks */
    .swagger-ui .opblock {
      border-radius: 10px !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07) !important;
      margin-bottom: 10px !important;
      border-width: 1px !important;
      overflow: hidden !important;
      transition: box-shadow 0.2s !important;
    }
    .swagger-ui .opblock:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
    }

    /* GET — blue */
    .swagger-ui .opblock-get { border-color: #3b82f6 !important; background: rgba(59,130,246,0.04) !important; }
    .swagger-ui .opblock-get  .opblock-summary-method { background: #3b82f6 !important; }

    /* POST — green */
    .swagger-ui .opblock-post { border-color: #22c55e !important; background: rgba(34,197,94,0.04) !important; }
    .swagger-ui .opblock-post .opblock-summary-method { background: #22c55e !important; }

    /* PUT — amber */
    .swagger-ui .opblock-put  { border-color: #f59e0b !important; background: rgba(245,158,11,0.04) !important; }
    .swagger-ui .opblock-put  .opblock-summary-method { background: #f59e0b !important; }

    /* DELETE — red */
    .swagger-ui .opblock-delete { border-color: #ef4444 !important; background: rgba(239,68,68,0.04) !important; }
    .swagger-ui .opblock-delete .opblock-summary-method { background: #ef4444 !important; }

    /* Method badge */
    .swagger-ui .opblock-summary-method {
      border-radius: 6px !important;
      font-size: 0.73rem !important;
      font-weight: 800 !important;
      letter-spacing: 0.6px !important;
      min-width: 72px !important;
      padding: 6px 0 !important;
    }

    /* Summary path text */
    .swagger-ui .opblock-summary-path {
      font-size: 0.92rem !important;
      font-weight: 600 !important;
      color: #1e293b !important;
    }

    /* Execute / Try-it button */
    .swagger-ui .btn.execute {
      background: #3b82f6 !important;
      border-color: #3b82f6 !important;
      color: #fff !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
    }
    .swagger-ui .btn.execute:hover {
      background: #2563eb !important;
      border-color: #2563eb !important;
    }

    /* Authorize button */
    .swagger-ui .btn.authorize {
      color: #3b82f6 !important;
      border-color: #3b82f6 !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
    }
    .swagger-ui .btn.authorize svg { fill: #3b82f6 !important; }

    /* Response code */
    .swagger-ui .response-col_status { font-weight: 700 !important; font-size: 0.9rem !important; }

    /* Code blocks */
    .swagger-ui .microlight,
    .swagger-ui .highlight-code { border-radius: 8px !important; }

    /* Models section */
    .swagger-ui section.models {
      border: 1px solid #e2e8f0 !important;
      border-radius: 12px !important;
      overflow: hidden !important;
    }
    .swagger-ui section.models h4 {
      font-size: 1rem !important;
      font-weight: 700 !important;
    }

    /* Inputs */
    .swagger-ui input[type=text],
    .swagger-ui input[type=email],
    .swagger-ui input[type=password],
    .swagger-ui textarea,
    .swagger-ui select {
      border-radius: 8px !important;
      border-color: #cbd5e1 !important;
      font-size: 0.88rem !important;
    }
    .swagger-ui input[type=text]:focus,
    .swagger-ui textarea:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
      outline: none !important;
    }

    /* ─── Footer ─────────────────────────────────────────────────── */
    .page-footer {
      text-align: center;
      padding: 24px 20px;
      color: #94a3b8;
      font-size: 0.78rem;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
      letter-spacing: 0.2px;
    }
    .page-footer a { color: #60a5fa; text-decoration: none; }
    .page-footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>

  <!-- ── Top Navigation ───────────────────────────────────────────── -->
  <nav class="topnav">
    <a class="topnav-brand" href="/">
      <!-- Official Swagger icon (green rounded square with S symbol) -->
      <svg class="swagger-icon" viewBox="0 0 87 87" xmlns="http://www.w3.org/2000/svg" aria-label="Swagger">
        <rect width="87" height="87" rx="13" fill="#85EA2D"/>
        <circle cx="43.5" cy="43.5" r="25" fill="none" stroke="white" stroke-width="4.5"/>
        <path d="M33 37.5c0-3.6 2.9-6.5 6.5-6.5h2c3.6 0 6.5 2.9 6.5 6.5 0 2.1-1 4-2.6 5.2l-3 2.1c-1 .7-1.4 1.7-1.4 2.7v1" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/>
        <circle cx="43.5" cy="56" r="2.5" fill="white"/>
      </svg>
      <div class="brand-text">
        <div class="name"><em>T</em>habo.Portfolio</div>
        <div class="sub">REST API Documentation</div>
      </div>
    </a>

    <div class="topnav-actions">
      <a href="/" class="btn-nav outline">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Portfolio
      </a>
      <a href="/api/swagger" target="_blank" rel="noopener noreferrer" class="btn-nav primary">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3v2H7v14h14v-7h2v7a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7zm7 0v8h-2V6.41l-9.3 9.3-1.41-1.42L18.58 5H14V3h7z"/></svg>
        OpenAPI JSON
      </a>
    </div>
  </nav>

  <!-- ── Hero Info Bar ─────────────────────────────────────────────── -->
  <div class="hero-bar">
    <div class="hero-inner">
      <div class="hero-left">
        <div class="api-name">
          Thabo Portfolio API
          <span class="version-tag">v1.0.0</span>
        </div>
        <p class="api-desc">
          Complete REST API for managing profile data, resume PDF delivery,
          and contact form email submissions. All endpoints documented and testable below.
        </p>
      </div>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-num">6</div>
          <div class="stat-label">Endpoints</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">4</div>
          <div class="stat-label">Tags</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">5</div>
          <div class="stat-label">Schemas</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">1</div>
          <div class="stat-label">Auth</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Swagger UI ────────────────────────────────────────────────── -->
  <div class="sw-wrap">
    <div id="swagger-ui"></div>
  </div>

  <!-- ── Footer ───────────────────────────────────────────────────── -->
  <footer class="page-footer">
    Built with <a href="https://nextjs.org" target="_blank" rel="noopener">Next.js 15</a>
    &nbsp;&middot;&nbsp;
    Documented with <a href="https://swagger.io" target="_blank" rel="noopener">Swagger / OpenAPI 3.0</a>
    &nbsp;&middot;&nbsp;
    &copy; 2025 Balachandran Thabotharan
  </footer>

  <!-- Swagger UI bundle (local — avoids CSP issues) -->
  <script src="/swagger-ui/swagger-ui-bundle.js"></script>
  <script>
    window.addEventListener('load', function () {
      SwaggerUIBundle({
        spec: ${specJson},
        dom_id: '#swagger-ui',
        deepLinking: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 1,
        displayRequestDuration: true,
        tryItOutEnabled: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
      });
    });
  </script>

</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
