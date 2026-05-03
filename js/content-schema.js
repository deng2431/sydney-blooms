/**
 * Canonical registry of all editable content keys.
 * A key not listed here cannot appear in the DB seed, admin form, or content-loader.
 * Add new keys here first — everything else follows.
 */
const CONTENT_SCHEMA = {
  // Home page — hero
  hero_eyebrow:   { page: 'home',  label: 'Small label above headline', fallback: 'Welcome to Sydney Blooms' },
  hero_title:     { page: 'home',  label: 'Main headline',              fallback: 'Fresh. Curated. Delivered.' },
  hero_subtitle:  { page: 'home',  label: 'Subtitle below headline',    fallback: "Sydney's finest hand-tied bouquets, crafted with love" },

  // About page — story
  about_eyebrow:  { page: 'about', label: 'Small label above title',    fallback: 'How It Started' },
  about_title:    { page: 'about', label: 'Story heading',              fallback: "From a kitchen table to Sydney's hearts" },
  about_para1:    { page: 'about', label: 'Story paragraph 1',          fallback: '' },
  about_para2:    { page: 'about', label: 'Story paragraph 2',          fallback: '' },
  about_para3:    { page: 'about', label: 'Story paragraph 3',          fallback: '' },
};

const CONTACT_SCHEMA = {
  address_line1:  { label: 'Street address',    fallback: 'Your Street Address' },
  address_line2:  { label: 'Suburb / postcode', fallback: 'Suburb, Sydney NSW XXXX' },
  phone:          { label: 'Phone number',      fallback: '(02) XXXX XXXX' },
  email:          { label: 'Email address',     fallback: 'hello@sydneyblooms.com.au' },
  hours_weekday:  { label: 'Mon – Fri hours',   fallback: 'Mon – Fri: 8am – 6pm' },
  hours_saturday: { label: 'Saturday hours',    fallback: 'Saturday: 8am – 4pm' },
  hours_sunday:   { label: 'Sunday hours',      fallback: 'Sunday: Closed' },
};
