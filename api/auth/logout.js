const { deleteSession, readToken, clearedSessionCookie, send, wrap } = require('../_lib/auth');

module.exports = wrap(async function logout(req, res) {
  if ((req.method || '') !== 'POST') return send(res, { error: 'method_not_allowed' }, 405);
  await deleteSession(readToken(req));
  return send(res, { ok: true }, 200, clearedSessionCookie());
});
