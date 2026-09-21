"use strict";

const { Category, Activity } = require("../../models");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "createdAt", "updatedAt"],
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      attributes: ["id", "name", "createdAt", "updatedAt"],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi",
      });
    }

    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Nama kategori sudah digunakan",
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi",
      });
    }

    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory && existingCategory.id !== category.id) {
      return res.status(409).json({
        success: false,
        message: "Nama kategori sudah digunakan",
      });
    }

    await category.update({ name });

    res.status(200).json({
      success: true,
      message: "Kategori berhasil diperbarui",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const activityCount = await Activity.count({
      where: { category_id: category.id },
    });

    if (activityCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Kategori tidak dapat dihapus karena masih digunakan oleh kegiatan",
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};
