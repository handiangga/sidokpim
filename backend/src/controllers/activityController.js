"use strict";

const { Op } = require("sequelize");
const { Activity, Category } = require("../../models");
const { uploadCover, deleteCover } = require("../utils/cloudinaryHelper");

exports.getAllActivities = async (req, res, next) => {
  try {
    const { search, category_id } = req.query;
    const where = {};

    if (search?.trim()) {
      const keyword = search.trim();

      where[Op.or] = [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { location: { [Op.iLike]: `%${keyword}%` } },
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
  let uploadedCover = null;

  try {
    const { category_id, date, title, location, drive_url } = req.body;

    if (
      !category_id ||
      !date ||
      !title?.trim() ||
      !location?.trim() ||
      !drive_url?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Kategori, tanggal, nama kegiatan, lokasi, dan link wajib diisi",
      });
    }

    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Kategori tidak valid",
      });
    }

    if (req.file) {
      uploadedCover = await uploadCover(req.file.buffer);
    }

    const activity = await Activity.create({
      category_id,
      date,
      title: title.trim(),
      location: location.trim(),
      drive_url: drive_url.trim(),
      cover_image: uploadedCover?.url || null,
      cover_public_id: uploadedCover?.publicId || null,
    });

    res.status(201).json({
      success: true,
      message: "Kegiatan berhasil ditambahkan",
      data: activity,
    });
  } catch (error) {
    if (uploadedCover?.publicId) {
      await deleteCover(uploadedCover.publicId);
    }

    next(error);
  }
};

exports.updateActivity = async (req, res, next) => {
  let uploadedCover = null;

  try {
    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Kegiatan tidak ditemukan",
      });
    }

    const { category_id, date, title, location, drive_url } = req.body;

    if (category_id) {
      const category = await Category.findByPk(category_id);

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Kategori tidak valid",
        });
      }
    }

    if (req.file) {
      uploadedCover = await uploadCover(req.file.buffer);
    }

    const oldCoverPublicId = activity.cover_public_id;

    await activity.update({
      category_id: category_id || activity.category_id,
      date: date || activity.date,
      title: title?.trim() || activity.title,
      location: location?.trim() || activity.location,
      drive_url: drive_url?.trim() || activity.drive_url,

      cover_image: uploadedCover ? uploadedCover.url : activity.cover_image,

      cover_public_id: uploadedCover
        ? uploadedCover.publicId
        : activity.cover_public_id,
    });

    if (uploadedCover && oldCoverPublicId) {
      await deleteCover(oldCoverPublicId);
    }

    res.status(200).json({
      success: true,
      message: "Kegiatan berhasil diperbarui",
      data: activity,
    });
  } catch (error) {
    if (uploadedCover?.publicId) {
      await deleteCover(uploadedCover.publicId);
    }

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

    const coverPublicId = activity.cover_public_id;

    await activity.destroy();

    if (coverPublicId) {
      await deleteCover(coverPublicId);
    }

    res.status(200).json({
      success: true,
      message: "Kegiatan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
