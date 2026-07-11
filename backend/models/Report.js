const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reporter: {
      type: String,
      required: true
    },

    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    reportedUser: {
      type: String
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "Inappropriate Content",
        "Spam",
        "Harassment",
        "Violence",
        "Misinformation",
        "Copyright",
        "Other"
      ]
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending"
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    resolution: {
      type: String
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    resolvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
