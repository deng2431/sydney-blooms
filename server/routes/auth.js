const router  = require('express').Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

let adminPassHash;
(async () => {
  adminPassHash = await bcrypt.hash(process.env.ADMIN_PASS, 10);
})();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USER) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, adminPassHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 86_400_000 });
  res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/check', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;
