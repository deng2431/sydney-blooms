-- Sydney Blooms database schema

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  category    VARCHAR(50)  NOT NULL,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       VARCHAR(50),
  tag         VARCHAR(100),
  image_path  VARCHAR(500),
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_content (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_info (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Default site content
INSERT INTO site_content (key, value) VALUES
  ('hero_eyebrow',  'Welcome to Sydney Blooms'),
  ('hero_title',    'Fresh. Curated. Delivered.'),
  ('hero_subtitle', 'Sydney''s finest hand-tied bouquets, crafted with love'),
  ('about_eyebrow', 'How It Started'),
  ('about_title',   'From a kitchen table to Sydney''s hearts'),
  ('about_para1',   'Sydney Blooms started simply — a dining table covered in stems, ribbon, and shears, and a deep belief that beautiful flowers should be accessible to everyone.'),
  ('about_para2',   'We source the freshest blooms from local Sydney growers each morning, choosing varieties that are in season, sustainably grown, and selected with care. No filler, no compromise.'),
  ('about_para3',   'Every arrangement that leaves our hands is a little piece of us. We pour real craft and genuine warmth into every single bouquet — whether it''s a $40 bunch for a Tuesday or a full wedding installation.')
ON CONFLICT (key) DO NOTHING;

-- Default contact info
INSERT INTO contact_info (key, value) VALUES
  ('address_line1',  'Your Street Address'),
  ('address_line2',  'Suburb, Sydney NSW XXXX'),
  ('phone',          '(02) XXXX XXXX'),
  ('email',          'hello@sydneyblooms.com.au'),
  ('hours_weekday',  'Mon – Fri: 8am – 6pm'),
  ('hours_saturday', 'Saturday: 8am – 4pm'),
  ('hours_sunday',   'Sunday: Closed')
ON CONFLICT (key) DO NOTHING;

-- Default products
INSERT INTO products (category, name, description, price, tag, image_path, sort_order) VALUES
  ('bouquet',  'Classic White Bouquet',    'Timeless white roses and peonies, hand-tied with a satin ribbon. Effortlessly elegant.',                       'From $65',       'Best Seller',  '/images/bouquet-1.jpg',  1),
  ('bouquet',  'Garden Romance',           'A lush mix of garden roses, ranunculus, and eucalyptus. Loose, romantic, and full of texture.',                'From $85',       'New Arrival',  '/images/bouquet-2.jpg',  2),
  ('wedding',  'Cascading Bridal Bouquet', 'A flowing, romantic cascade of white and blush blooms. Designed to complement any dress silhouette.',          'From $180',      'Bridal',       '/images/wedding-1.jpg',  1),
  ('wedding',  'Table Centrepieces',       'Lush centrepieces in low or tall styles. Tailored to your colour palette, venue, and vision.',                 'From $140 each', 'Venue',        '/images/wedding-2.jpg',  2),
  ('seasonal', 'The Market Bunch',         'A generous, just-picked handful of whatever is freshest at market this week. Always a surprise.',              'From $45',       'Seasonal',     '/images/seasonal-1.jpg', 1),
  ('seasonal', 'Seasonal Posie',           'A sweet, compact arrangement of in-season blooms. Ideal for a desk, bedside table, or small gift.',            'From $35',       'Seasonal',     '/images/seasonal-2.jpg', 2)
ON CONFLICT DO NOTHING;
