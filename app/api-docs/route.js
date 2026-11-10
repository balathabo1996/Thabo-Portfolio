import swaggerSpec from '../../lib/swagger.js';

export async function GET() {
  const specJson = JSON.stringify(swaggerSpec).replace(/</g, '\\u003c');
  const operations = Object.values(swaggerSpec.paths).flatMap(path => Object.values(path));
  const protectedCount = operations.filter(operation => operation.security?.length).length;
  const groups = swaggerSpec.tags.map(tag => `<a href="#/${encodeURIComponent(tag.name)}">${tag.name}<span>${operations.filter(operation => operation.tags.includes(tag.name)).length}</span></a>`).join('');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="description" content="Explore every Thabo Portfolio API route, request schema, response, and JWT authentication flow.">
<title>API Studio | Thabo.Portfolio</title>
<link rel="icon" href="/favicon.png">
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
<style>
:root{--bg:#0d1210;--panel:#161d18;--mint:#b9f582;--ink:#f0f2eb;--muted:#a4afa7;--line:#ffffff20;--paper:#fafbf8;--text:#233026}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:100px}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit}button,input,select,textarea{font:inherit}a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #639c31;outline-offset:4px}code,pre{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}code{overflow-wrap:anywhere}.skip{position:absolute;top:-100px;left:20px;background:var(--mint);color:var(--bg);padding:10px;z-index:10}.skip:focus{top:10px}
.topbar{position:sticky;top:0;z-index:20;background:#0d1210f5;border-bottom:1px solid var(--line)}.topbar-inner{max-width:1440px;margin:auto;min-height:76px;padding:12px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{text-decoration:none;font-size:26px;letter-spacing:-1.5px;font-weight:650}.brand em{color:var(--mint);font-family:Georgia,serif}.brand small{font-size:12px;letter-spacing:.12em;font-weight:400;margin-left:22px;color:var(--muted)}.top-links{display:flex;gap:24px;font-size:13px;color:var(--muted)}.top-links a{text-decoration:none}.top-links a:hover{color:var(--mint)}
.shell{max-width:1440px;margin:auto;padding:44px 32px 64px}.intro{display:grid;grid-template-columns:1.5fr 1fr;gap:48px;align-items:end;margin-bottom:40px}.eyebrow{font:11px ui-monospace,monospace;letter-spacing:.17em;color:var(--mint);margin:0 0 20px}h1{font-size:clamp(40px,5vw,72px);line-height:1.05;font-weight:550;letter-spacing:-.06em;margin:0 0 22px}h1 em{font-family:Georgia,serif;font-weight:400;color:var(--mint)}.intro p:not(.eyebrow){max-width:650px;color:var(--muted);margin:0;font-size:16px}.version{display:inline-block;border:1px solid var(--line);border-radius:20px;padding:5px 12px;font:11px ui-monospace,monospace;margin-bottom:18px}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-bottom:7px}.stat{border-top:1px solid var(--line);padding-top:15px}.stat strong{display:block;color:var(--mint);font-size:34px;font-weight:500;line-height:1.3}.stat span{font-size:11px;color:var(--muted)}
.workspace{display:grid;grid-template-columns:210px minmax(0,1fr);gap:30px;align-items:start}.sidebar{position:sticky;top:104px}.sidebar-title{font:10px ui-monospace,monospace;letter-spacing:.15em;color:var(--muted);margin:0 0 15px}.route-nav{display:grid;gap:3px}.route-nav a{display:flex;align-items:center;justify-content:space-between;padding:8px 11px;text-decoration:none;border-radius:6px;font-size:13px}.route-nav a:hover{background:var(--panel);color:var(--mint)}.route-nav span{font:10px ui-monospace,monospace;color:var(--muted)}.sidebar-note{font-size:12px;line-height:1.8;color:var(--muted);border-top:1px solid var(--line);margin-top:25px;padding-top:20px}.sidebar-note code{color:var(--mint)}.workspace-main{min-width:0}.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}.guide{padding:24px;border:1px solid var(--line);background:var(--panel);border-radius:12px;min-width:0}.guide h2{font-size:16px;font-weight:550;margin:0 0 10px}.guide p,.guide li{font-size:13px;color:var(--muted)}.guide p{margin:8px 0}.guide ol{padding-left:20px;margin-bottom:0}.guide code{color:var(--mint);font-size:12px}.guide .step-label{color:var(--mint);font:10px ui-monospace,monospace;letter-spacing:.1em;margin-bottom:15px;display:block}.quickstart{border:1px solid var(--line);border-radius:12px;margin-bottom:24px;overflow:hidden}.code-heading{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 20px;border-bottom:1px solid var(--line);font-size:12px;color:var(--muted)}[hidden]{display:none!important}.copy{background:transparent;color:var(--mint);border:1px solid var(--line);border-radius:5px;padding:8px 12px;min-height:40px;cursor:pointer}.quickstart pre{padding:20px;margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;color:var(--mint)}.explorer{border-radius:14px;background:var(--paper);padding:24px;min-height:300px;color:var(--text)}.explorer-header{display:flex;align-items:center;justify-content:space-between;gap:15px;border-bottom:1px solid #dbe2d7;padding-bottom:18px;margin-bottom:20px}.explorer-header h2{margin:0;font-size:19px;font-weight:600}.explorer-header span{font:11px ui-monospace,monospace;color:#566351}#load-status{padding:20px;font-size:14px}.footer{color:var(--muted);font-size:12px;border-top:1px solid var(--line);padding-top:25px;margin-top:40px;display:flex;justify-content:space-between;gap:20px}.footer a{color:var(--mint)}
.swagger-ui{color:var(--text);font-family:inherit}.swagger-ui .wrapper{padding:0}.swagger-ui .info,.swagger-ui .topbar{display:none}.swagger-ui .scheme-container{padding:16px;background:#eef3e8;border:1px solid #d6e0cd;border-radius:8px;box-shadow:none;margin:0 0 20px}.swagger-ui .scheme-container .schemes{gap:18px}.swagger-ui .servers>label{font-size:12px}.swagger-ui .opblock-tag{font-family:inherit;font-size:19px;color:var(--text);padding:16px 0;margin:14px 0;border-bottom:1px solid #dbe2d7;scroll-margin-top:100px}.swagger-ui .opblock-tag small{font-size:12px;line-height:1.6;color:#566351}.swagger-ui .opblock{box-shadow:none;border-radius:8px;overflow:hidden;margin-bottom:12px}.swagger-ui .opblock .opblock-summary{padding:10px}.swagger-ui .opblock .opblock-summary-method{border-radius:4px;font:650 12px ui-monospace,monospace;min-width:68px;padding:7px 8px}.swagger-ui .opblock .opblock-summary-path{font:600 13px ui-monospace,monospace;overflow-wrap:anywhere}.swagger-ui .opblock .opblock-summary-description{font-size:12px;line-height:1.5}.swagger-ui .btn{border-radius:5px;box-shadow:none}.swagger-ui .btn.authorize{color:#365d21;border-color:#527e39}.swagger-ui .btn.authorize svg{fill:#365d21}.swagger-ui .filter-container{padding:0 0 20px}.swagger-ui .filter-container .operation-filter-input{border:1px solid #b9c7b0;border-radius:6px;min-height:44px;background:white}.swagger-ui :is(input,select,textarea){max-width:100%;font-size:16px}.swagger-ui table{display:block;overflow-x:auto}.swagger-ui .parameters-col_description{min-width:180px}.swagger-ui .model-box{background:#eef3e8}.swagger-ui section.models{border-color:#dbe2d7;border-radius:8px}.swagger-ui .dialog-ux .modal-ux{max-height:85vh;overflow:auto}.swagger-ui .dialog-ux .modal-ux-content{overflow-wrap:anywhere}.swagger-ui .dialog-ux .modal-ux-header h3{font-size:20px}.swagger-ui .authorization__btn{min-height:36px;min-width:36px}.swagger-ui .download-contents{color:#222}
@media(max-width:1050px){.workspace{grid-template-columns:170px minmax(0,1fr);gap:20px}.guide-grid{grid-template-columns:1fr}.intro{gap:25px}.swagger-ui .opblock .opblock-summary-description{display:none}}
@media(max-width:760px){.topbar-inner{padding:12px 18px}.brand small{display:none}.top-links{gap:16px;font-size:12px}.shell{padding:30px 16px}.intro{grid-template-columns:1fr;gap:24px}.stats{max-width:440px}.workspace{grid-template-columns:minmax(0,1fr)}.sidebar{position:static}.route-nav{display:flex;overflow:auto;gap:8px;padding-bottom:10px}.route-nav a{white-space:nowrap;border:1px solid var(--line);gap:15px;min-height:44px}.sidebar-note,.sidebar-title{display:none}.explorer{padding:14px}.explorer-header{flex-wrap:wrap}.swagger-ui .opblock .opblock-summary-path{font-size:11px}.swagger-ui .opblock .opblock-summary{padding:8px 4px}.swagger-ui .opblock .opblock-summary-method{min-width:54px;font-size:10px}.footer{flex-direction:column}}
/* Keep Swagger summary controls readable at narrow widths. */
.swagger-ui,.swagger-ui button,.swagger-ui input,.swagger-ui select,.swagger-ui textarea{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.swagger-ui .opblock .opblock-summary{display:flex;align-items:center;gap:8px;min-height:56px}
.swagger-ui .opblock-summary-control{display:flex;align-items:center;flex:1 1 auto;min-width:0;gap:10px;text-align:left;font:inherit;color:inherit}
.swagger-ui .opblock .opblock-summary-method{flex:0 0 68px;min-width:68px;text-align:center}
.swagger-ui .opblock .opblock-summary-path{min-width:0;flex:0 1 auto;line-height:1.6;word-break:normal}
.swagger-ui .opblock-summary-path a{overflow-wrap:anywhere}
.swagger-ui .opblock-summary-operation-id{display:none}
.swagger-ui .opblock .opblock-summary-description{flex:1 1 auto;min-width:0;margin-left:8px}
.swagger-ui .opblock-summary svg,.swagger-ui .opblock-tag svg{width:20px;height:20px;flex-shrink:0}
@media(max-width:760px){.swagger-ui .opblock .opblock-summary{padding:10px 8px;gap:4px}.swagger-ui .opblock-summary-control{gap:8px}.swagger-ui .opblock .opblock-summary-method{flex-basis:56px;min-width:56px;font-size:11px}.swagger-ui .opblock .opblock-summary-path{font-size:13px}.swagger-ui .opblock-summary .authorization__btn{min-width:28px;padding:4px}.swagger-ui .opblock-tag small{display:none}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<a class="skip" href="#explorer">Skip to API explorer</a>
<nav class="topbar" aria-label="Documentation navigation"><div class="topbar-inner"><a class="brand" href="/"><em>T</em>habo.<small>DEVELOPER STUDIO</small></a><div class="top-links"><a href="/">Portfolio ↗</a><a href="/api/swagger" download="thabo-openapi.json">OpenAPI JSON ↓</a></div></div></nav>
<main class="shell">
<header class="intro"><div><p class="eyebrow">THE SYSTEM BEHIND THE PORTFOLIO</p><span class="version">API v${swaggerSpec.info.version} · OPENAPI ${swaggerSpec.openapi}</span><h1>Explore the<br><em>connections.</em></h1><p>One reference for content, media, analytics, and communication. Inspect the schemas, authenticate, and try requests against this environment.</p></div><div class="stats"><div class="stat"><strong>${operations.length}</strong><span>operations</span></div><div class="stat"><strong>${Object.keys(swaggerSpec.paths).length}</strong><span>paths</span></div><div class="stat"><strong>${protectedCount}</strong><span>protected operations</span></div></div></header>
<div class="workspace"><aside class="sidebar"><p class="sidebar-title">EXPLORE BY SERVICE</p><nav class="route-nav" aria-label="API groups">${groups}</nav><p class="sidebar-note">Requests target <code id="current-origin">this origin</code>.<br><br>Try it out uses real services. Writes change data; contact requests send email.</p></aside><div class="workspace-main">
<section class="guide-grid" aria-label="Getting started"><article class="guide"><span class="step-label">01 / AUTHENTICATE</span><h2>A passphrase in. A token out.</h2><ol><li>Open <code>POST /api/auth/verify</code> below.</li><li>Send <code>{ "key": "YOUR_ADMIN_PASSPHRASE" }</code>.</li><li>Copy the returned token into Swagger’s <strong>Authorize</strong> dialog.</li></ol><p>Use the raw JWT in <code>x-api-key</code>, without <code>Bearer</code>. Tokens expire after eight hours.</p></article><article class="guide"><span class="step-label">02 / MAKE A REQUEST</span><h2>Choose the right payload.</h2><p>Most operations use JSON. Image upload uses <code>multipart/form-data</code> with a <code>file</code> part.</p><p>Collection deletes use <code>?id=…</code>; media deletion uses a JSON <code>public_id</code>. Contact and resume tracking are public write exceptions.</p><p>Authorization is kept in memory only and cleared on refresh.</p></article></section>
<section class="quickstart" aria-label="Quick-start example"><div class="code-heading"><span>START WITH A PUBLIC REQUEST</span><button class="copy" id="copy-command" type="button">Copy cURL</button></div><pre><code id="quick-command">curl --request GET '/api/profile' --header 'Accept: application/json'</code></pre><span id="copy-status" role="status" class="code-heading" hidden></span></section>
<section class="explorer" id="explorer" aria-labelledby="explorer-title"><div class="explorer-header"><h2 id="explorer-title">API explorer</h2><span>SCHEMAS / EXAMPLES / RESPONSES</span></div><p id="load-status" role="status">Loading API explorer… If it does not load, <a href="/api/swagger">open the JSON specification</a>.</p><noscript><p>JavaScript is required for Swagger UI. <a href="/api/swagger">Read the JSON specification</a> instead.</p></noscript><div id="swagger-ui"></div></section>
</div></div><footer class="footer"><span>Thabo.Portfolio / Developer reference</span><a href="/api/swagger">Machine-readable OpenAPI specification ↗</a></footer>
</main>
<script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
<script>
(function () {
  document.getElementById('current-origin').textContent = location.origin;
  const command = "curl --request GET '" + location.origin + "/api/profile' --header 'Accept: application/json'";
  document.getElementById('quick-command').textContent = command;
  document.getElementById('copy-command').addEventListener('click', async function () {
    const status = document.getElementById('copy-status');
    status.hidden = false;
    try { await navigator.clipboard.writeText(command); status.textContent = 'Command copied.'; }
    catch { status.textContent = 'Copy unavailable. Select the command above to copy it manually.'; }
  });
  if (typeof SwaggerUIBundle === 'undefined') {
    document.getElementById('load-status').textContent = 'Swagger UI could not load from the CDN. Use the OpenAPI JSON link above or retry with an internet connection.';
    return;
  }
  window.ui = SwaggerUIBundle({
    spec: ${specJson}, dom_id: '#swagger-ui', deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis], layout: 'BaseLayout',
    docExpansion: 'list', filter: true, displayOperationId: false,
    displayRequestDuration: true, defaultModelsExpandDepth: 0, defaultModelExpandDepth: 2,
    persistAuthorization: false, validatorUrl: null,
    tryItOutEnabled: false, syntaxHighlight: { activated: true, theme: 'agate' },
    onComplete: function () { document.getElementById('load-status').hidden = true; }
  });
})();
</script>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
