"use strict";

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, callback) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return callback(
      new Error("Foto cover harus berformat JPG, PNG, atau WEBP"),
    );
  }

  callback(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
