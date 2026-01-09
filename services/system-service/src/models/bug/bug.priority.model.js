const mongoose = require("mongoose");

const bugPrioritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BugPriority", bugPrioritySchema, "bugpriorities");
