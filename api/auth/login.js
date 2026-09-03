const {
  bcrypt,
  findUserByEmail,
  createSession,
  readBody,
  sessionCookie,
  send,
  wrap
} = require('../_lib/auth');

module.exports = wrap(async function login(req, res) {
  const method = req.method || '';
  if (method !== 'POST') return send(res, { error: 'method_not_allowed' }, 405);

  const body = readBody(req);
  const email = String(body.email || '');
  const password = String(body.password || '');
  if (!email.trim() || !password) return send(res, { error: 'missing_fields' }, 400);

  const user = await findUserByEmail(email);
  if (!user) return send(res, { error: 'invalid_credentials' }, 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return send(res, { error: 'invalid_credentials' }, 401);

  const { passwordHash, ...safeUser } = user;
  const token = await createSession(user.id);
  return send(res, { user: safeUser }, 200, sessionCookie(token));
});
