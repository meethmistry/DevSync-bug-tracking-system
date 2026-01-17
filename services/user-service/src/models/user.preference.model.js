const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },

    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },

    privacy: {
      showOnlineStatus: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserPreference", userPreferenceSchema, "userpreferences");
