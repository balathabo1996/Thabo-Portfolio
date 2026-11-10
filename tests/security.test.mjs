import test from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT } from 'jose';
import { signToken, verifyToken } from '../lib/auth.js';
import { proxy } from '../proxy.js';

const secret = 'security-regression-test-secret-at-least-32-characters';
function request(path, method, token) {
  return { nextUrl: { pathname: path }, method, headers: new Headers(token ? { 'x-api-key': token } : {}) };
}

test('admin authentication regression checks', async t => {
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = secret;
  try {
    const token = await signToken({ admin: true });
    await t.test('a valid token round-trips; tampered tokens fail', async () => {
      assert.equal((await verifyToken(token)).admin, true);
      assert.equal(await verifyToken(`${token}invalid`), null);
    });
    await t.test('all administrative write methods require authentication', async () => {
      for (const path of ['/api/projects', '/api/skills', '/api/experience', '/api/profile', '/api/upload', '/api/media']) {
        for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
          assert.equal((await proxy(request(path, method))).status, 401, `${method} ${path}`);
          assert.equal((await proxy(request(path, method, token))).status, 200, `${method} ${path} with admin token`);
        }
      }
    });
    await t.test('public reads and contact submission remain accessible', async () => {
      assert.equal((await proxy(request('/api/projects', 'GET'))).status, 200);
      assert.equal((await proxy(request('/api/contact', 'POST'))).status, 200);
      assert.equal((await proxy(request('/api/auth/verify', 'POST'))).status, 200);
    });
    await t.test('backups require authentication even for GET', async () => {
      assert.equal((await proxy(request('/api/backup', 'GET'))).status, 401);
      assert.equal((await proxy(request('/api/backup', 'GET', token))).status, 200);
    });
    await t.test('a signed non-admin token cannot write', async () => {
      const ordinaryToken = await signToken({ admin: false });
      assert.equal((await proxy(request('/api/projects', 'PATCH', ordinaryToken))).status, 401);
    });
    await t.test('expired and wrong-algorithm tokens fail', async () => {
      const key = new TextEncoder().encode(secret);
      const expired = await new SignJWT({ admin: true }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('0s').sign(key);
      const wrongAlgorithm = await new SignJWT({ admin: true }).setProtectedHeader({ alg: 'HS384' }).setExpirationTime('1h').sign(key);
      assert.equal(await verifyToken(expired), null);
      assert.equal(await verifyToken(wrongAlgorithm), null);
    });
    await t.test('missing and weak secrets fail closed', async () => {
      for (const value of ['', 'short']) {
        process.env.JWT_SECRET = value;
        await assert.rejects(signToken({ admin: true }), /JWT_SECRET/);
        assert.equal(await verifyToken(token), null);
        assert.equal((await proxy(request('/api/projects', 'PATCH', token))).status, 401);
      }
    });
  } finally {
    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
  }
});
