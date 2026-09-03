const { getUserFromToken, readToken, send, wrap } = require('../_lib/auth');

module.exports = wrap(async function session(req, res) {
  if ((req.method || '') !== 'GET') return send(res, { error: 'method_not_allowed' }, 405);
  const user = await getUserFromToken(readToken(req));
  if (!user) return send(res, { user: null }, 401);
  return send(res, { user });
});
