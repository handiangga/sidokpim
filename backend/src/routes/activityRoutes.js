"use strict";

const express = require("express");
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Publik
router.get("/", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);

// Administrator
router.post(
  "/",
  authMiddleware,
  upload.single("cover_image"),
  activityController.createActivity,
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("cover_image"),
  activityController.updateActivity,
);

router.delete("/:id", authMiddleware, activityController.deleteActivity);

module.exports = router;
