const express = require("express");

const {
  getDeals,
  createDeal,
  deleteDeal,
  updateDeal,
} = require("../controllers/dealController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getDeals);
router.post("/", protect, createDeal);
router.put("/:id", protect, updateDeal);

// Delete Deal - Admin only
router.delete("/:id", protect, adminOnly, deleteDeal);

module.exports = router;