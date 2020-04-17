const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  username: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  folders: [{ type: ObjectId, ref: 'Folder' }],
  layout: [{ type: Object }],
  displayName: String,
  profilePic: { type: Object, default: { public_id: "" } },
  bio: { type: String, default: "" }
}, {
  timestamps: true
});


module.exports = mongoose.model("User", schema);