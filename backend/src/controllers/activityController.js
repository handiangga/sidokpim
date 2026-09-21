"use strict";

const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const { Activity, Category } = require("../../models");

function removeCover(coverImage) {
  if (!coverImage) return;

  const filename = path.basename(coverImage);
  const filePath = path.join(__dirname, "../../uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

exports.getAllActivities = async (req, res, next) => {
  try {
    const { search, category_id } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (category_id) {
      where.category_id = category_id;
    }

    const activities = await Activity.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [
        ["date", "DESC"],
        ["id", "DESC"],
      ],
    });

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

exports.getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Kegiatan tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

exports.createActivity = async (req, res, next) => {
  try {
    const { category_id, date, title, location, drive_url } = req.body;

    if (
      !category_id ||
      !date ||
      !title?.trim() ||
      !location?.trim() ||
      !drive_url?.trim()
    ) {
      if (req.file) removeCover(req.file.filename);

      return res.status(400).json({
        success: false,
        message:
          "Kategori, tanggal, nama kegiatan, lokasi, dan link wajib diisi",
      });
    }

    const category = await Category.findByPk(category_id);

    if (!category) {
      if (req.file) removeCover(req.file.filename);

      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    const activity = await Activity.create({
      category_id,
      date,
      title: title.trim(),
      location: location.trim(),
      drive_url: drive_url.trim(),
      cover_image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: "Kegiatan berhasil ditambahkan",
      data: activity,
    });
  } catch (error) {
    if (req.file) removeCover(req.file.filename);
    next(error);
  }
};

exports.updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      if (req.file) removeCover(req.file.filename);

      return res.status(404).json({
        success: false,
        message: "Kegiatan tidak ditemukan",
      });
    }

    const { category_id, date, title, location, drive_url } = req.body;

    if (category_id) {
      const category = await Category.findByPk(category_id);

      if (!category) {
        if (req.file) removeCover(req.file.filename);

        return res.status(400).json({
          success: false,
          message: "Kategori tidak valid",
        });
      }
    }

    const oldCover = activity.cover_image;

    await activity.update({
      category_id: category_id || activity.category_id,
      date: date || activity.date,
      title: title?.trim() || activity.title,
      location: location?.trim() || activity.location,
      drive_url: drive_url?.trim() || activity.drive_url,
      cover_image: req.file
        ? `/uploads/${req.file.filename}`
        : activity.cover_image,
    });

    if (req.file && oldCover) {
      removeCover(oldCover);
    }

    res.status(200).json({
      success: true,
      message: "Kegiatan berhasil diperbarui",
      data: activity,
    });
  } catch (error) {
    if (req.file) removeCover(req.file.filename);
    next(error);
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Kegiatan tidak ditemukan",
      });
    }

    const coverImage = activity.cover_image;

    await activity.destroy();
    removeCover(coverImage);

    res.status(200).json({
      success: true,
      message: "Kegiatan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
