const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const schema = new Schema(
  {
    folder:String,
    folderUrl:String,
    layout: Object,
    user: { type: ObjectId, ref: 'User' },
    path:String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Folder", schema);
