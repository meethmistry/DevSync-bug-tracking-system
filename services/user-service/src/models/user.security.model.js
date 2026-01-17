const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    loggedInAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSecuritySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lastLoginAttempt: Date,
    lastLogin: Date,

    isLocked: {
      type: Boolean,
      default: false,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    tokens: {
      type: [tokenSchema],
      default: [],
    },

    pinEnabled: {
      type: Boolean,
      default: false,
    },

    pinHash: {
      type: String,
      default: null,
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

module.exports = mongoose.model("UserSecurity", userSecuritySchema, "usersecurity");