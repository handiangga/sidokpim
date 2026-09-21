"use strict";

const express = require("express");
const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const activityRoutes = require("./activityRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/activities", activityRoutes);

module.exports = router;
