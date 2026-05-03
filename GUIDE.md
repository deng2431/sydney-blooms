# Sydney Blooms — Website Guide

A plain-English guide to running and managing your flower shop website.

---

## Starting the website

You need to start two things before the site works: the database, then the server.

**1. Start the database** (only needed once per computer restart):
```
sudo service postgresql start
```

**2. Start the website server:**
```
node server.js
```

You'll see:
```
  Sydney Blooms running at http://localhost:3000
  Admin panel:          http://localhost:3000/admin
```

Open your browser and go to **http://localhost:3000** to see the public site.  
Leave the terminal window open — closing it stops the server.

**To stop the server:** press `Ctrl + C` in the terminal.

---

## Admin panel

Go to **http://localhost:3000/admin** in your browser.

**Login credentials:**
- Username: `admin`
- Password: `blooms2025`

> **Important:** Change your password before going live. Open the `.env` file and update `ADMIN_PASS`.

Once logged in you'll see a dashboard with three sections.

---

## Managing products

Go to **Admin → Products**.

### Add a new product
1. Click **Add Product**
2. Fill in the fields:
   - **Category** — Bouquet, Wedding, or Seasonal
   - **Sort Order** — controls the order within its category (1 = first, 2 = second, etc.)
   - **Product Name** — e.g. *Autumn Blush Bouquet*
   - **Description** — 1–2 sentences shown on the card
   - **Price** — e.g. `From $75`
   - **Tag / Badge** — a small label like `Best Seller`, `New`, or `Limited`
   - **Product Image** — upload a photo (JPEG or PNG, max 5MB)
3. Click **Save Product**

### Edit an existing product
1. Find the product in the table
2. Click **Edit**
3. Change any fields — leave the image blank to keep the current photo
4. Click **Save Product**

### Delete a product
1. Click **Delete** next to the product
2. Confirm the prompt

The change appears on the public site immediately after saving — no refresh needed.

---

## Editing page text

Go to **Admin → Page Content**.

You can edit:

| Field | Where it appears |
|-------|-----------------|
| Small Label | Tiny text above the home page headline |
| Main Headline | The large italic text on the home page hero |
| Subtitle | The line below the headline |
| Story Label | Small text above the About title |
| Story Title | The heading on the About page |
| Paragraphs 1–3 | The three story paragraphs on the About page |

Click **Save All Changes** when done. Changes appear on the site immediately.

---

## Updating contact details

Go to **Admin → Contact Info**.

Fill in your real:
- Street address (two lines)
- Phone number
- Email address
- Opening hours for weekdays, Saturday, and Sunday

Click **Save Changes**. The contact page and footer update automatically.

---

## Replacing product images manually

If you want to swap an image without going through the admin panel, you can replace the file directly:

1. Open the `images/` folder inside the project
2. Replace the file with your new photo using the **exact same filename**
   - e.g. replace `bouquet-1.jpg` with your new photo, named `bouquet-1.jpg`
3. Refresh the browser — the new image appears straight away

---

## Updating the contact form email

When a visitor submits the contact form, it currently opens their email app pre-addressed. To connect it to a proper form service:

1. Sign up for free at **formspree.io**
2. Create a form and copy your endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`)
3. Open `contact.html`, find the `<form` tag, and change the `action="mailto:..."` to your Formspree URL
4. Also add `method="POST"` and remove `enctype="text/plain"`

---

## Backing up your content

Your product listings, page text, and contact details all live in the PostgreSQL database. To create a backup:

```
pg_dump postgresql://sydneyblooms:blooms2025@localhost:5432/sydneyblooms > backup.sql
```

To restore from a backup:
```
psql postgresql://sydneyblooms:blooms2025@localhost:5432/sydneyblooms < backup.sql
```

---

## Going live

When you're ready to publish the site on the internet, you'll need to:

1. Choose a hosting provider — **Railway** (railway.app) or **Render** (render.com) both have free tiers and support Node.js + PostgreSQL
2. Push your code to GitHub (already set up at github.com/deng2431/sydney-blooms)
3. Create a PostgreSQL database on the hosting provider
4. Set these environment variables on the host:
   - `DATABASE_URL` — the connection string from your hosted database
   - `ADMIN_USER` — your admin username
   - `ADMIN_PASS` — a strong password (change from `blooms2025`)
   - `JWT_SECRET` — a new random secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
5. Run the migration once: `psql $DATABASE_URL -f migrations/001_init.sql`

Your website will then be accessible at a public URL provided by the hosting service.
