const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
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


const adminSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "SINGLE_ADMIN",
    },

    pinHash: {
      type: String,
      required: true,
    },

    pinLastChangedAt: {
      type: Date,
      default: Date.now,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    failedAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    tokens: {
      type: [tokenSchema],
      default: [],
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

module.exports = mongoose.model("Admin", adminSchema, "admin");  
