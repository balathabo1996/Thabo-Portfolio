/**
 * Swagger UI Page  —  app/api-docs/route.js
 * ==========================================
 * A professional, high-fidelity API documentation experience 
 * with enriched developer details and native Swagger branding.
 */
import swaggerSpec from '@/lib/swagger';

export async function GET() {
  const specJson = JSON.stringify(swaggerSpec).replace(/<\/script>/gi, '<\\/script>');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Documentation Explorer | Thabo.Portfolio</title>
  <link rel="icon" type="image/png" href="https://static1.smartbear.co/swagger/media/assets/images/favicon-32x32.png?v=2" sizes="32x32" />
  <link rel="icon" type="image/png" href="https://static1.smartbear.co/swagger/media/assets/images/favicon-16x16.png?v=2" sizes="16x16" />
  <link rel="shortcut icon" href="https://static1.smartbear.co/swagger/media/assets/images/favicon-32x32.png?v=2" />
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">

  <style>
    :root {
      --swagger-green: #89bf04;
      --swagger-dark: #1b1b1b;
      --bg-body: #ffffff;
      --bg-alt: #f8fafc;
      --text-main: #2d3748;
      --text-muted: #718096;
      --border-light: #e2e8f0;
      --accent-blue: #3182ce;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-body);
      color: var(--text-main);
      line-height: 1.6;
    }

    /* ─── Top Navbar ────────────────────────────────────────── */
    .navbar {
      background-color: var(--swagger-dark);
      padding: 14px 0;
      border-bottom: 2px solid var(--swagger-green);
      width: 100%;
      display: flex;
      justify-content: center;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .navbar-content {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
    }
    .logo-circle {
      height: 40px;
      width: 40px;
      background: var(--swagger-green);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--swagger-dark);
      font-weight: 800;
      font-size: 1.2rem;
    }
    .navbar-text { display: flex; flex-direction: column; }
    .navbar-title { color: white; font-size: 1.6rem; font-weight: 400; line-height: 1; }
    .navbar-sub { color: rgba(255,255,255,0.7); font-size: 9px; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

    /* ─── Layout ────────────────────────────────────────────── */
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 20px 100px;
    }

    /* ─── Rich Header ───────────────────────────────────────── */
    .hero { margin-bottom: 50px; }
    .hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
    .hero-title { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 800; color: #1a202c; letter-spacing: -1px; }
    
    .badges { display: flex; gap: 8px; margin-top: 10px; }
    .badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .badge-v { background: #ebf8ff; color: #3182ce; border: 1px solid #bee3f8; }
    .badge-s { background: #f0fff4; color: #38a169; border: 1px solid #c6f6d5; }
    .status-dot { width: 6px; height: 6px; background: #48bb78; border-radius: 50%; animation: pulse 2s infinite; }

    .hero-desc { color: var(--text-muted); font-size: 1.05rem; max-width: 750px; line-height: 1.7; }

    /* ─── Detail Cards ──────────────────────────────────────── */
    .grid-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .card {
      background: var(--bg-alt);
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 24px;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .card:hover { 
      transform: translateY(-8px); 
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); 
      border-color: #3182ce; 
    }
    .card-icon { font-size: 1.5rem; margin-bottom: 15px; display: block; }
    .card-title { font-size: 1.1rem; font-weight: 700; color: #1a202c; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
    .card-text { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
    .card-list { margin-top: 12px; list-style: none; }
    .card-list li { font-size: 0.85rem; margin-bottom: 6px; display: flex; gap: 10px; align-items: center; }
    .card-list li::before { content: "→"; color: var(--accent-blue); font-weight: bold; }

    /* ─── Quick Start ───────────────────────────────────────── */
    .quick-start {
      background: #1a202c;
      color: #e2e8f0;
      padding: 25px;
      border-radius: 16px;
      margin-bottom: 40px;
      font-family: 'JetBrains Mono', monospace;
    }
    .qs-title { color: #a0aec0; font-size: 0.8rem; margin-bottom: 15px; display: block; text-transform: uppercase; letter-spacing: 1.5px; }
    .code-line { color: #63b3ed; word-break: break-all; font-size: 0.9rem; position: relative; padding-left: 20px; }
    .code-line::before { content: "$"; position: absolute; left: 0; color: #4a5568; }

    /* ─── Control Bar ───────────────────────────────────────── */
    .control-bar {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 15px 25px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .server-info { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 0.9rem; }
    .server-info select { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-light); background: white; outline: none; }

    /* ─── Swagger Overrides ─────────────────────────────────── */
    .swagger-ui .info, .swagger-ui .topbar, .swagger-ui .scheme-container { display: none !important; }
    .swagger-ui .opblock-tag { 
      font-family: 'Outfit', sans-serif !important;
      font-size: 1.4rem !important; 
      border-bottom: 2px solid #edf2f7 !important; 
      padding-bottom: 10px !important; 
      margin: 40px 0 20px !important; 
      color: #1a202c !important; 
      font-weight: 800 !important; 
    }
    .swagger-ui .opblock .opblock-summary-method {
      font-family: 'JetBrains Mono', monospace !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
    }
    .swagger-ui .opblock .opblock-summary-path {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 0.95rem !important;
      font-weight: 600 !important;
      color: #2d3748 !important;
    }
    .swagger-ui .opblock .opblock-summary-description {
      font-family: 'Inter', sans-serif !important;
      font-size: 0.9rem !important;
    }
    .swagger-ui .opblock { 
      border-radius: 12px !important; 
      margin-bottom: 15px !important; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important; 
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .swagger-ui .opblock:hover {
      transform: translateY(-6px) !important;
      box-shadow: 0 12px 25px rgba(0,0,0,0.1) !important;
    }
    .swagger-ui .btn.execute { 
      background: var(--swagger-dark) !important; 
      border-radius: 8px !important; 
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
    }
    .swagger-ui .btn.authorize { 
      color: var(--text-main) !important; 
      border-color: var(--border-light) !important; 
      border-radius: 8px !important; 
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
    }
    .swagger-ui table thead tr td, .swagger-ui table thead tr th {
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
      color: #4a5568 !important;
    }
    .swagger-ui .model-title {
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
    }
    .swagger-ui .parameter__name {
      font-family: 'JetBrains Mono', monospace !important;
      font-weight: 700 !important;
    }
    .swagger-ui code, .swagger-ui .microlight {
      font-family: 'JetBrains Mono', monospace !important;
    }

    @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }

    @media (max-width: 768px) {
      .hero-top { flex-direction: column; align-items: flex-start; }
      .control-bar { flex-direction: column; gap: 15px; align-items: flex-start; }
    }
  </style>
</head>
<body>

  <nav class="navbar">
    <a href="/api-docs" class="navbar-content">
      <div class="logo-circle">{...}</div>
      <div class="navbar-text">
        <span class="navbar-title">Swagger</span>
        <span class="navbar-sub">Supported by <strong>SMARTBEAR</strong></span>
      </div>
    </a>
  </nav>

  <div class="container">
    <header class="hero">
      <div class="hero-top">
        <div>
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 5px;">
            <div style="width: 38px; height: 38px; background: #89bf04; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1b1b1b; font-weight: 800; font-size: 1rem;">{...}</div>
            <h1 class="hero-title" style="margin-bottom: 0;">Thabo Portfolio API</h1>
          </div>
          <div class="badges">
            <span class="badge badge-v">v1.1.0 Stable</span>
            <span class="badge badge-s"><div class="status-dot"></div> API Operational</span>
          </div>
        </div>
        <div style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">
          Last Updated: <strong>April 2026</strong><br>
          Cloud: <strong>MongoDB Atlas</strong>
        </div>
      </div>
      <p class="hero-desc">
        Welcome to the technical gateway of my portfolio. This REST API facilitates high-speed content delivery for my professional biography, dynamic project showcases, and automated communication services.
      </p>
    </header>

    <div class="grid-info">
      <div class="card">
        <span class="card-icon">🔑</span>
        <h3 class="card-title">Authentication</h3>
        <p class="card-text">Secure your requests using the <code>x-api-key</code> header. This is mandatory for all write operations (POST, PUT, DELETE).</p>
        <ul class="card-list">
          <li>Primary Auth: <code>x-api-key</code></li>
          <li>Scope: Full Admin Access</li>
        </ul>
      </div>

      <div class="card">
        <span class="card-icon">⚡</span>
        <h3 class="card-title">Best Practices</h3>
        <p class="card-text">We follow standard REST principles with predictable JSON error responses and HTTP status codes.</p>
        <ul class="card-list">
          <li>Content-Type: <code>application/json</code></li>
          <li>Response: UTF-8 Encoded</li>
        </ul>
      </div>

      <div class="card">
        <span class="card-icon">🏗️</span>
        <h3 class="card-title">Integration</h3>
        <p class="card-text">Directly compatible with Next.js Server Components, React-Query, or any standard HTTP client.</p>
        <ul class="card-list">
          <li>Next.js 15+ Optimized</li>
          <li>CORS: Whitelisted Origins</li>
        </ul>
      </div>
    </div>

    <div class="quick-start">
      <span class="qs-title">Quick Start (cURL)</span>
      <div class="code-line">curl -X GET "https://thabo-portfolio.vercel.app/api/profile" -H "accept: application/json"</div>
    </div>

    <div class="control-bar">
      <div class="server-info">
        <span>Target Server:</span>
        <select id="server-select">
          <option value="/">Current Origin (Auto-detect)</option>
        </select>
      </div>
      <div id="auth-container"></div>
    </div>

    <div id="swagger-ui"></div>
  </div>

  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec: ${specJson},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
        defaultModelsExpandDepth: 1,
        displayRequestDuration: true,
        tryItOutEnabled: true,
        onComplete: () => {
          const authBtn = document.querySelector('.auth-wrapper');
          if (authBtn) {
            document.getElementById('auth-container').appendChild(authBtn);
          }
        }
      });
    };
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
