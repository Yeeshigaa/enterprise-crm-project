const express = require("express");

const {
  getLeads,
  createLead,
  deleteLead,
  updateLead,
} = require("../controllers/leadController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getLeads);
router.post("/", protect, createLead);
router.put("/:id", protect, updateLead);

// Delete Lead - Admin only
router.delete("/:id", protect, adminOnly, deleteLead);

module.exports = router;