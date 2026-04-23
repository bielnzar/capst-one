const { Pool } = require("pg");
require("dotenv").config();

// Koneksi ke Supabase menggunakan Connection String
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Wajib diaktifkan untuk koneksi ke layanan cloud (Supabase)
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
