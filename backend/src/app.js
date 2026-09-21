"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",

  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      // Request tanpa origin, misalnya Postman atau server-to-server.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("Origin tidak diizinkan oleh CORS");
      error.status = 403;

      return callback(error);
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

// Hanya untuk membaca cover lokal lama saat development.
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API SIDOKPIM berjalan",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Ukuran foto cover maksimal 5 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Terjadi kesalahan pada server",
  });
});

module.exports = app;
