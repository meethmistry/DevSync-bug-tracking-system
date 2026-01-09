const mongoose = require("mongoose");

const programmingLanguageSchema = new mongoose.Schema(
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

module.exports = mongoose.model("ProgrammingLanguage", programmingLanguageSchema, "languages");