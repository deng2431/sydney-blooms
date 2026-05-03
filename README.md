# Sydney Blooms

Flower shop website for Sydney Blooms — a brochure + catalogue site with a built-in admin panel for managing products and content.

## Stack

- **Frontend:** Plain HTML / CSS / JS (no framework, no build step)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT via httpOnly cookie

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Start PostgreSQL
sudo service postgresql start

# 4. Create database and seed it (first time only)
psql $DATABASE_URL -f migrations/001_init.sql

# 5. Start the server
node server.js
```

Site → http://localhost:3000  
Admin → http://localhost:3000/admin

## Docs

- **[GUIDE.md](GUIDE.md)** — plain-English guide for the site owner (how to log in, manage products, update content, go live)
- **[CLAUDE.md](CLAUDE.md)** — architecture reference for developers
