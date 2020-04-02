const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const schema = new Schema({
  username: { type: String, required: true, lowercase: true },
  password: { type: String, required: true, lowercase: true },
  email: { type: String, required: true },
  elements: [{ type: ObjectId, ref: 'Element' }],
  displayName: String,
  image: { type: Object }
}, {
  timestamps: true
});

/*
const defaultPicture =
  "https://ugc.kn3.net/i/760x/http://hotbeans.files.wordpress.com/2008/04/mustache-_0006_ned-flanders.jpg";
schema.virtual("profilepic").get(function () {
  // Try to get as local path
  let pic = _.get(this, "picture.path");
  if (!pic) {
    // Try to get as cloudinary url
    pic = _.get(this, "picture.url");
    if (!pic) {
      // none work, then use default picture
      pic = defaultPicture;
    } else {
      // Get as thumnbnail from cloudinary
      let public_id = _.get(this, "picture.public_id");
      const cloudUrlCroped = cloudinary.url(public_id, {
        width: 50,
        crop: "scale",
        secure: true
      });
      pic = cloudUrlCroped;
      console.log(cloudUrlCroped);
    }
  }
  // Place the root bar if we are serving the file from our express server
  return pic.startsWith("http") ? pic : `/${pic}`;
});
*/
module.exports = mongoose.model("User", schema);