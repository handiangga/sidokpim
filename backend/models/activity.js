"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  Activity.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Tanggal kegiatan wajib diisi",
          },
          isDate: {
            msg: "Format tanggal tidak valid",
          },
        },
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Nama kegiatan wajib diisi",
          },
        },
      },

      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Lokasi kegiatan wajib diisi",
          },
        },
      },

      cover_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      drive_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Tautan dokumentasi Google Drive wajib diisi",
          },
          isUrl: {
            msg: "Tautan dokumentasi harus berupa URL yang valid",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Activity",
      tableName: "Activities",
      timestamps: true,
    },
  );

  return Activity;
};
