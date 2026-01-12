const express = require("express");
const cors = require("cors");
const app = express();
const eqRoutes = require("./routes/eq");
const authRoutes = require("./routes/auth");
const sequelize = require("./config/database");

app.use(cors());
app.use(express.json());

// ⚠️ Pastikan ini mount ke /api, bukan /api/eq
app.use("/api", eqRoutes);
app.use("/api/auth", authRoutes);

sequelize.sync().then(() => {
  console.log("✅ Database synced");
  app.listen(3001, () =>
    console.log("🚀 Server running on http://localhost:3001")
  );
});
