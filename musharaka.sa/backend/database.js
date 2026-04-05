'use strict';
const Database = require('better-sqlite3');
const path     = require('path');
const bcrypt   = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'musharaka.db');

// Create /data dir if missing
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/* ─────────────────────────────────────────
   SCHEMA
───────────────────────────────────────── */
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username   TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    name       TEXT    NOT NULL DEFAULT 'Administrator',
    role       TEXT    NOT NULL DEFAULT 'admin',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS account_requests (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_no          TEXT    UNIQUE NOT NULL,
    type            TEXT    NOT NULL CHECK(type IN ('individual','entity')),
    status          TEXT    NOT NULL DEFAULT 'pending'
                             CHECK(status IN ('pending','reviewing','approved','rejected')),
    -- Common
    full_name       TEXT,
    national_id     TEXT,
    nationality     TEXT,
    dob             TEXT,
    phone           TEXT,
    email           TEXT,
    address         TEXT,
    city            TEXT,
    -- Individual specific
    employment      TEXT,
    employer_name   TEXT,
    income_source   TEXT,
    annual_income   TEXT,
    investment_goal TEXT,
    risk_level      TEXT,
    wallet_platform TEXT,
    wallet_address  TEXT,
    -- Entity specific
    entity_name     TEXT,
    entity_type     TEXT,
    cr_number       TEXT,
    vat_number      TEXT,
    entity_address  TEXT,
    auth_person     TEXT,
    auth_id         TEXT,
    auth_phone      TEXT,
    services        TEXT,   -- JSON array
    -- Meta
    ip_address      TEXT,
    notes           TEXT,
    submitted_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT,
    phone       TEXT,
    subject     TEXT,
    message     TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'unread'
                         CHECK(status IN ('unread','read','replied')),
    ip_address  TEXT,
    received_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id   INTEGER,
    action     TEXT    NOT NULL,
    entity     TEXT,
    entity_id  INTEGER,
    detail     TEXT,
    ip         TEXT,
    logged_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key   TEXT PRIMARY KEY,
    value TEXT,
    label TEXT
  );
`);

/* ─── Seed default admin if table is empty ─── */
const adminCount = db.prepare('SELECT COUNT(*) AS c FROM admins').get().c;
if (adminCount === 0) {
  const hash = bcrypt.hashSync('Admin@1234', 10);
  db.prepare(`INSERT INTO admins (username, password, name, role)
              VALUES (?, ?, ?, ?)`)
    .run('admin', hash, 'مدير النظام', 'superadmin');
  console.log('[DB] Default admin created → username: admin | password: Admin@1234');
}

/* ─── Seed default settings ─── */
const settingsCount = db.prepare('SELECT COUNT(*) AS c FROM site_settings').get().c;
if (settingsCount === 0) {
  const defaults = [
    ['whatsapp_number', '966582062882',          'رقم واتساب'],
    ['phone_number',    '+966582062882',          'رقم الهاتف'],
    ['company_name',    'مشاركة المالية',         'اسم الشركة'],
    ['company_email',   'info@musharaka.sa',      'البريد الإلكتروني'],
    ['license_number',  '27-13169',               'رقم الترخيص'],
  ];
  const ins = db.prepare('INSERT OR IGNORE INTO site_settings (key, value, label) VALUES (?,?,?)');
  defaults.forEach(([k, v, l]) => ins.run(k, v, l));
}

module.exports = db;
