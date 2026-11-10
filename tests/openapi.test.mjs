import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import spec from '../lib/swagger.js';
import { GET as docsPage } from '../app/api-docs/route.js';
import { proxy } from '../proxy.js';

const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);
async function routeFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    return entry.isDirectory() ? routeFiles(url) : entry.name === 'route.js' ? [url] : [];
  }))).flat();
}

test('OpenAPI describes every API and documentation handler, with no phantom routes', async () => {
  const root = new URL('../app/', import.meta.url);
  const files = [...await routeFiles(new URL('api/', root)), new URL('api-docs/route.js', root)];
  const actual = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const path = '/' + decodeURIComponent(file.pathname.slice(root.pathname.length)).replace(/\/route\.js$/, '');
    for (const match of source.matchAll(/export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*\(/g)) actual.push(`${match[1].toLowerCase()} ${path}`);
  }
  const documented = Object.entries(spec.paths).flatMap(([path, operations]) => Object.keys(operations).filter(method => methods.has(method)).map(method => `${method} ${path}`));
  assert.deepEqual(documented.sort(), actual.sort());
});

test('all operations have unique IDs, declared tags, successful responses, and explicit security', async () => {
  const ids = new Set();
  const tags = new Set(spec.tags.map(tag => tag.name));
  for (const [path, operations] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(operations)) {
      assert.ok(operation.operationId && !ids.has(operation.operationId), `${method} ${path}: unique ID`);
      ids.add(operation.operationId);
      assert.ok(operation.tags.every(tag => tags.has(tag)));
      assert.ok(Object.keys(operation.responses).some(status => /^2\d\d$/.test(status)));
      assert.ok(Array.isArray(operation.security));
      const result = await proxy({ nextUrl: { pathname: path }, method: method.toUpperCase(), headers: new Headers() });
      assert.equal(Boolean(operation.security.length), result.status === 401, `${method} ${path}: security matches middleware`);
      if (operation.security.length) assert.ok(operation.responses[401]);
    }
  }
});

test('every schema reference resolves inside the document', () => {
  function inspect(value) {
    if (!value || typeof value !== 'object') return;
    if (value.$ref) {
      assert.ok(value.$ref.startsWith('#/'));
      const resolved = value.$ref.slice(2).split('/').reduce((node, key) => node?.[key.replace(/~1/g, '/').replace(/~0/g, '~')], spec);
      assert.ok(resolved, `Unresolved ${value.$ref}`);
    }
    Object.values(value).forEach(inspect);
  }
  inspect(spec);
});

test('authentication, upload, deletion, and reordering payloads match their route contracts', () => {
  const scheme = spec.components.securitySchemes.AdminToken;
  assert.equal(scheme.type, 'apiKey');
  assert.equal(scheme.name, 'x-api-key');
  assert.equal(scheme.in, 'header');
  assert.ok(spec.paths['/api/upload'].post.requestBody.content['multipart/form-data']);
  assert.ok(spec.paths['/api/media'].delete.requestBody.content['application/json']);
  for (const path of ['/api/projects', '/api/experience', '/api/skills']) {
    assert.equal(spec.paths[path].delete.parameters[0].name, 'id');
    assert.equal(spec.paths[path].patch.requestBody.content['application/json'].schema.$ref, '#/components/schemas/Reorder');
  }
  assert.deepEqual(spec.paths['/api/analytics/resume'].post.security, []);
  assert.deepEqual(spec.paths['/api/contact'].post.security, []);
});

test('API Studio HTML loads the same spec, uses safe defaults, and has valid JavaScript', async () => {
  const response = await docsPage();
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  const html = await response.text();
  assert.match(html, /28<\/strong><span>operations/);
  assert.match(html, /13<\/strong><span>paths/);
  assert.match(html, /persistAuthorization: false/);
  assert.match(html, /validatorUrl: null/);
  assert.match(html, /href="\/api\/swagger"/);
  assert.doesNotMatch(html, /API Operational|Supported by|\/api\/seed/);
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    if (match[1].trim()) assert.doesNotThrow(() => new Script(match[1]));
  }
});
