
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const register = async (req, res) => {
  try {
    const { nama, username, password } = req.body;

    if (!nama || !username || !password) {
      return res.status(400).json({
        message: "Nama, username, dan password wajib diisi"
      });
    }

    const usernameNormal = username.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [usernameNormal]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Username sudah terdaftar"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (nama, username, password_hash)
       VALUES ($1, $2, $3)`,
      [nama.trim(), usernameNormal, passwordHash]
    );

    return res.status(201).json({
      message: "Registrasi berhasil"
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server"
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi"
      });
    }

    const result = await pool.query(
      "SELECT id, nama, username, password_hash FROM users WHERE username = $1",
      [username.trim().toLowerCase()]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        message: "Username atau password salah"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET belum dikonfigurasi");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username
      }
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server"
    });
  }
};

module.exports = { register, login };