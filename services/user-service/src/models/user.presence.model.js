const mongoose = require("mongoose");

const userPresenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("UserPresence", userPresenceSchema, "userpresences");
