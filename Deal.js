const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    leadName: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    stage: {
      type: String,
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);