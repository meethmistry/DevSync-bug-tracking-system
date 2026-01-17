const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [15, "Username must be at most 15 characters"],
    },

    phone: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^[6-9]\d{9}$/.test(value);
        },
        message: "Invalid phone number",
      },
    },
    
    about: {
      type: String,
      trim: true,
      maxlength: [200, "About section cannot exceed 200 characters"],
    },

    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserProfile", userProfileSchema, "userprofiles");
