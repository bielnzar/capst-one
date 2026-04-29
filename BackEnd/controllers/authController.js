const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nrp, password, full_name } = req.body;

  try {
    const { data: userExist } = await supabase
      .from("users")
      .select("nrp")
      .eq("nrp", nrp)
      .single();

    if (userExist) {
      return res.status(400).json({ message: "NRP sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([{ nrp, password_hash: hashedPassword, role: "mahasiswa" }])
      .select()
      .single();

    if (userError) throw userError;

    const { error: profileError } = await supabase
      .from("student_profiles")
      .insert([
        {
          user_id: newUser.user_id,
          full_name,
          nrp,
          current_semester: 6,
        },
      ]);

    if (profileError) throw profileError;

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: { nrp: newUser.nrp, full_name },
    });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.login = async (req, res) => {
  const { nrp, password } = req.body;

  try {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select(
        `
        user_id, nrp, password_hash,
        student_profiles (full_name, current_semester)
      `,
      )
      .eq("nrp", nrp)
      .single();

    if (!user || fetchError) {
      return res.status(401).json({ message: "NRP atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "NRP atau password salah" });
    }

    const token = jwt.sign(
      { id: user.user_id, nrp: user.nrp },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      message: "Login sukses",
      token,
      user: {
        nrp: user.nrp,
        nama: user.student_profiles[0]?.full_name || "Mahasiswa",
        semester: user.student_profiles[0]?.current_semester || 6,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
