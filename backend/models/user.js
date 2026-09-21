"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
      // User hanya digunakan untuk autentikasi administrator.
      // Belum memiliki relasi dengan tabel lain.
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Nama wajib diisi",
          },
        },
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Username sudah digunakan",
        },
        validate: {
          notEmpty: {
            msg: "Username wajib diisi",
          },
        },
      },

      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password wajib diisi",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    },
  );

  return User;
};
