"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Activity, {
        foreignKey: "category_id",
        as: "activities",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Nama kategori sudah digunakan",
        },
        validate: {
          notEmpty: {
            msg: "Nama kategori wajib diisi",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories",
      timestamps: true,
    },
  );

  return Category;
};
