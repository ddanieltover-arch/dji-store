const {
  findUserByEmail,
  createUser,
  createSession,
  readBody,
  sessionCookie,
  send,
  wrap
} = require('../_lib/auth');

module.exports = wrap(async function signup(req, res) {
  if ((req.method || '') !== 'POST') return send(res, { error: 'method_not_allowed' }, 405);

  const body = readBody(req);
  const email = String(body.email || '');
  const password = String(body.password || '');
  if (!email.trim() || !password) return send(res, { error: 'missing_fields' }, 400);

  const existing = await findUserByEmail(email);
  if (existing) return send(res, { error: 'email_taken' }, 409);

  const user = await createUser({
    email,
    password,
    firstName: body.firstName ? String(body.firstName) : undefined,
    lastName: body.lastName ? String(body.lastName) : undefined
  });
  const token = await createSession(user.id);
  return send(res, { user }, 200, sessionCookie(token));
});
