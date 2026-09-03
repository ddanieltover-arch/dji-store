module.exports = function health(_req, res) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ ok: true });
};
