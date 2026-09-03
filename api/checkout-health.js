const { createDb, ensureOrdersTable } = require('./_lib/db');
const { send, wrap } = require('./_lib/auth');

module.exports = wrap(async function checkoutHealth(_req, res) {
  const env = {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
    hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
    hasEmailFrom: Boolean(process.env.EMAIL_FROM)
  };

  try {
    await ensureOrdersTable();
    const sql = createDb();
    const rows = await sql`SELECT count(*)::int AS count FROM orders`;
    return send(res, {
      ok: true,
      env,
      orderCount: rows[0]?.count ?? 0
    });
  } catch (err) {
    return send(
      res,
      {
        ok: false,
        env,
        error: err instanceof Error ? err.message : 'health_failed'
      },
      500
    );
  }
});
