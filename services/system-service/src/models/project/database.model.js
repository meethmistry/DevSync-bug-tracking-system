const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Database", databaseSchema, "databases");