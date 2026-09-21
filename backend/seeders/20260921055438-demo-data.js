"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const now = new Date();
      const passwordHash = await bcrypt.hash("Admin123!", 10);

      await queryInterface.bulkInsert(
        "Users",
        [
          {
            name: "Administrator",
            username: "admin",
            password_hash: passwordHash,
            createdAt: now,
            updatedAt: now,
          },
        ],
        { transaction },
      );

      const categories = await queryInterface.bulkInsert(
        "Categories",
        [
          {
            name: "Rapat dan Koordinasi",
            createdAt: now,
            updatedAt: now,
          },
          {
            name: "Kunjungan Kerja",
            createdAt: now,
            updatedAt: now,
          },
          {
            name: "Upacara dan Apel",
            createdAt: now,
            updatedAt: now,
          },
          {
            name: "Sosialisasi",
            createdAt: now,
            updatedAt: now,
          },
          {
            name: "Kegiatan Sosial",
            createdAt: now,
            updatedAt: now,
          },
        ],
        {
          returning: ["id", "name"],
          transaction,
        },
      );

      const categoryIds = Object.fromEntries(
        categories.map((category) => [category.name, category.id]),
      );

      await queryInterface.bulkInsert(
        "Activities",
        [
          {
            category_id: categoryIds["Rapat dan Koordinasi"],
            date: "2026-09-15",
            title: "Rapat Koordinasi Evaluasi Kinerja",
            location: "Aula Kejaksaan Negeri Sleman",
            cover_image: null,
            drive_url: "https://drive.google.com/",
            createdAt: now,
            updatedAt: now,
          },
          {
            category_id: categoryIds["Kunjungan Kerja"],
            date: "2026-09-10",
            title: "Kunjungan Kerja ke Pemerintah Kabupaten Sleman",
            location: "Kantor Pemerintah Kabupaten Sleman",
            cover_image: null,
            drive_url: "https://drive.google.com/",
            createdAt: now,
            updatedAt: now,
          },
          {
            category_id: categoryIds["Upacara dan Apel"],
            date: "2026-09-01",
            title: "Upacara Peringatan Hari Lahir Kejaksaan",
            location: "Halaman Kejaksaan Negeri Sleman",
            cover_image: null,
            drive_url: "https://drive.google.com/",
            createdAt: now,
            updatedAt: now,
          },
          {
            category_id: categoryIds.Sosialisasi,
            date: "2026-08-25",
            title: "Sosialisasi Pelayanan Hukum kepada Masyarakat",
            location: "Kecamatan Depok, Sleman",
            cover_image: null,
            drive_url: "https://drive.google.com/",
            createdAt: now,
            updatedAt: now,
          },
          {
            category_id: categoryIds["Kegiatan Sosial"],
            date: "2026-08-17",
            title: "Bakti Sosial Kejaksaan Negeri Sleman",
            location: "Kabupaten Sleman",
            cover_image: null,
            drive_url: "https://drive.google.com/",
            createdAt: now,
            updatedAt: now,
          },
        ],
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete(
        "Activities",
        {
          title: [
            "Rapat Koordinasi Evaluasi Kinerja",
            "Kunjungan Kerja ke Pemerintah Kabupaten Sleman",
            "Upacara Peringatan Hari Lahir Kejaksaan",
            "Sosialisasi Pelayanan Hukum kepada Masyarakat",
            "Bakti Sosial Kejaksaan Negeri Sleman",
          ],
        },
        { transaction },
      );

      await queryInterface.bulkDelete(
        "Categories",
        {
          name: [
            "Rapat dan Koordinasi",
            "Kunjungan Kerja",
            "Upacara dan Apel",
            "Sosialisasi",
            "Kegiatan Sosial",
          ],
        },
        { transaction },
      );

      await queryInterface.bulkDelete(
        "Users",
        { username: "admin" },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
