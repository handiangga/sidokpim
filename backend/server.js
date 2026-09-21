"use strict";

require("dotenv").config();

const app = require("./src/app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Database PostgreSQL berhasil terhubung.");

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal menghubungkan database:", error.message);
    process.exit(1);
  }
}

startServer();
