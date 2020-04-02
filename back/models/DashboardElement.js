const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    type: { type: String, enum: ["text", "audio", "image", "url"] },
    post: { type: ObjectId, ref: "post" },
    user: { type: ObjectId, ref: "user" },
    text: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DashboardElements", schema);
