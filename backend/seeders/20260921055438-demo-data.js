"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash("Admin123!", 10);

    await queryInterface.bulkInsert("Users", [
      {
        name: "Administrator",
        username: "admin",
        password_hash: passwordHash,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Categories", [
      {
        id: 1,
        name: "Rapat dan Koordinasi",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: "Kunjungan Kerja",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: "Upacara dan Apel",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: "Sosialisasi",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        name: "Kegiatan Sosial",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Activities", [
      {
        category_id: 1,
        date: "2026-09-15",
        title: "Rapat Koordinasi Evaluasi Kinerja",
        location: "Aula Kejaksaan Negeri Sleman",
        cover_image: null,
        drive_url: "https://drive.google.com/",
        createdAt: now,
        updatedAt: now,
      },
      {
        category_id: 2,
        date: "2026-09-10",
        title: "Kunjungan Kerja ke Pemerintah Kabupaten Sleman",
        location: "Kantor Pemerintah Kabupaten Sleman",
        cover_image: null,
        drive_url: "https://drive.google.com/",
        createdAt: now,
        updatedAt: now,
      },
      {
        category_id: 3,
        date: "2026-09-01",
        title: "Upacara Peringatan Hari Lahir Kejaksaan",
        location: "Halaman Kejaksaan Negeri Sleman",
        cover_image: null,
        drive_url: "https://drive.google.com/",
        createdAt: now,
        updatedAt: now,
      },
      {
        category_id: 4,
        date: "2026-08-25",
        title: "Sosialisasi Pelayanan Hukum kepada Masyarakat",
        location: "Kecamatan Depok, Sleman",
        cover_image: null,
        drive_url: "https://drive.google.com/",
        createdAt: now,
        updatedAt: now,
      },
      {
        category_id: 5,
        date: "2026-08-17",
        title: "Bakti Sosial Kejaksaan Negeri Sleman",
        location: "Kabupaten Sleman",
        cover_image: null,
        drive_url: "https://drive.google.com/",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Activities", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
