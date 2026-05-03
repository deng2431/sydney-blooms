require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',     require('./server/routes/auth'));
app.use('/api/products', require('./server/routes/products'));
app.use('/api/content',  require('./server/routes/content'));
app.use('/api/contact',  require('./server/routes/contact'));
app.use('/api/messages', require('./server/routes/messages'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Sydney Blooms running at http://localhost:${PORT}`);
  console.log(`  Admin panel:          http://localhost:${PORT}/admin\n`);
});
