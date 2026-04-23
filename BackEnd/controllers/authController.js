const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nrp, password, full_name } = req.body;
  try {
    const userExist = await db.query("SELECT * FROM users WHERE nrp = $1", [
      nrp,
    ]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "NRP sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO users (nrp, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING nrp, full_name",
      [nrp, hashedPassword, full_name, "student"],
    );

    res
      .status(201)
      .json({ message: "Registrasi berhasil", user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { nrp, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE nrp = $1", [nrp]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "NRP tidak terdaftar" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.user_id, nrp: user.nrp },
      process.env.JWT_SECRET || "spark_dti_secret_2026",
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login sukses",
      token,
      user: {
        nrp: user.nrp,
        nama: user.full_name,
        semester: user.semester || 6,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
