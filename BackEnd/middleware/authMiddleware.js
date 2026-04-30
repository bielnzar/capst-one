const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1. Ambil header authorization
  const authHeader = req.headers["authorization"];

  // 2. Validasi keberadaan header dan format Bearer[cite: 5]
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Otorisasi ditolak, format token salah",
    });
  }

  // 3. Ekstrak token murni
  const token = authHeader.split(" ")[1];

  // 4. Validasi apakah token murni (mencegah string "null"/"undefined")[cite: 5]
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      message: "Token malformed atau kosong",
    });
  }

  try {
    // 5. Verifikasi menggunakan Secret Key dari .env[cite: 5]
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6. Simpan data user ke request agar bisa diakses Controller[cite: 5]
    req.user = decoded;
    next();
  } catch (err) {
    console.error("🔥 JWT Error:", err.message);
    return res.status(401).json({
      message: "Sesi tidak valid atau kedaluwarsa",
    });
  }
};
