const { createHash, randomBytes } = require('crypto');
const bcrypt = require('bcryptjs');
const { createDb, ensureAuthTables } = require('./db');

const SESSION_COOKIE = 'dji_session';
const SESSION_TTL_DAYS = 30;
const BCRYPT_ROUNDS = 12;

function sessionMaxAge() {
  return SESSION_TTL_DAYS * 24 * 60 * 60;
}

function adminEmails() {
  const set = new Set();
  const single = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.trim().toLowerCase();
  if (single) set.add(single);
  for (const entry of (process.env.ADMIN_EMAILS || '').split(',')) {
    const normalized = entry.trim().toLowerCase();
    if (normalized) set.add(normalized);
  }
  return set;
}

function resolveRole(email) {
  return adminEmails().has(email.trim().toLowerCase()) ? 'admin' : 'customer';
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function generateSessionToken() {
  return randomBytes(32).toString('base64url');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function mapUser(row) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name
  };
}

async function findUserByEmail(email) {
  await ensureAuthTables();
  const sql = createDb();
  const rows = await sql`
    SELECT id, email, password_hash, role, first_name, last_name
    FROM users
    WHERE lower(email) = ${normalizeEmail(email)}
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0];
  return { ...mapUser(row), passwordHash: row.password_hash };
}

async function createUser({ email, password, firstName, lastName }) {
  await ensureAuthTables();
  const normalized = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Enter a valid email address');
  }
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  const role = resolveRole(normalized);
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const sql = createDb();
  const rows = await sql`
    INSERT INTO users (email, password_hash, role, first_name, last_name)
    VALUES (
      ${normalized},
      ${passwordHash},
      ${role},
      ${firstName ? String(firstName).trim() : null},
      ${lastName ? String(lastName).trim() : null}
    )
    RETURNING id, email, role, first_name, last_name
  `;
  return mapUser(rows[0]);
}

async function createSession(userId) {
  await ensureAuthTables();
  const sql = createDb();
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + sessionMaxAge() * 1000);
  await sql`
    INSERT INTO auth_sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${hashToken(token)}, ${expiresAt.toISOString()})
  `;
  return token;
}

async function deleteSession(token) {
  if (!token) return;
  await ensureAuthTables();
  const sql = createDb();
  await sql`DELETE FROM auth_sessions WHERE token_hash = ${hashToken(token)}`;
}

async function getUserFromToken(token) {
  if (!token) return null;
  await ensureAuthTables();
  const sql = createDb();
  const rows = await sql`
    SELECT u.id, u.email, u.role, u.first_name, u.last_name
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)}
      AND s.expires_at > now()
    LIMIT 1
  `;
  if (!rows.length) return null;
  return mapUser(rows[0]);
}

function cookieHeader(req) {
  if (!req) return '';
  if (typeof req.headers?.get === 'function') return req.headers.get('cookie') || '';
  return req.headers?.cookie || '';
}

function readToken(req) {
  const match = cookieHeader(req).match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function sessionCookie(token) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${sessionMaxAge()}; Secure`;
}

function clearedSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Secure`;
}

function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function send(res, body, status = 200, cookie) {
  if (res && typeof res.status === 'function') {
    if (cookie) res.setHeader('Set-Cookie', cookie);
    res.setHeader('Content-Type', 'application/json');
    return res.status(status).json(body);
  }
  const headers = { 'content-type': 'application/json' };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(JSON.stringify(body), { status, headers });
}

function wrap(handler) {
  return async function authHandler(req, res) {
    try {
      return await handler(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'internal_error';
      return send(res, { error: message }, 500);
    }
  };
}

module.exports = {
  bcrypt,
  findUserByEmail,
  createUser,
  createSession,
  deleteSession,
  getUserFromToken,
  readToken,
  readBody,
  sessionCookie,
  clearedSessionCookie,
  send,
  wrap
};
