const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const schema = new Schema(
  {
    type: { type: String, enum: ["text", "audio", "image", "url"] },
    user: { type: ObjectId, ref: 'User' },
    folder: { type: ObjectId, ref: "Folder" },
    image: Object,
    text: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Element", schema);
