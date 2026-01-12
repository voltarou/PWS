require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function seedUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  console.log("✅ Connected to MySQL");

  const users = [
    {
      username: "admin",
      email: "admin@eqapp.com",
      password: "admin123",
      role: "admin"
    },
    {
      username: "bagus",
      email: "bagus@gmail.com",
      password: "user123",
      role: "user"
    },
    {
      username: "andi",
      email: "andi@gmail.com",
      password: "user123",
      role: "user"
    },
    {
      username: "sinta",
      email: "sinta@gmail.com",
      password: "user123",
      role: "user"
    }
  ];

  for (const user of users) {
    // Cek apakah email sudah ada
    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [user.email]
    );

    if (existing.length > 0) {
      console.log(`⚠️  User ${user.email} sudah ada, dilewati`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await connection.execute(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [user.username, user.email, hashedPassword, user.role]
    );

    console.log(`✅ User ${user.email} berhasil ditambahkan`);
  }

  await connection.end();
  console.log("🎉 Seeder selesai");
}

seedUsers().catch(err => {
  console.error("❌ Error:", err);
});
