const express = require("express");

const {
  getActivities,
  createActivity,
  deleteActivity,
} = require("../controllers/activityController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getActivities);
router.post("/", protect, createActivity);

// Delete Activity - Admin only
router.delete("/:id", protect, adminOnly, deleteActivity);

module.exports = router;