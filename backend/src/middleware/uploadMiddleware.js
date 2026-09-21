"use strict";

const multer = require("multer");

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
  storage: multer.memoryStorage(),

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
