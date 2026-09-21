"use strict";

const cloudinary = require("../../config/cloudinary");

function uploadCover(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "sidokpim/covers",
        resource_type: "image",
        format: "webp",
        transformation: [
          {
            width: 1600,
            height: 1200,
            crop: "limit",
            quality: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
}

async function deleteCover(publicId) {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (error) {
    console.error(
      `Gagal menghapus cover Cloudinary ${publicId}:`,
      error.message,
    );
  }
}

module.exports = {
  uploadCover,
  deleteCover,
};
