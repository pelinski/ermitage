const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const schema = new Schema(
  {
    folder: String,
    folderUrl: String,
    layout: [{ type: Object }],
    user: { type: ObjectId, ref: 'User' },
    elements: [{ type: ObjectId, ref: "Element" }],
    path: String,
    isPrivate: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Folder", schema);
