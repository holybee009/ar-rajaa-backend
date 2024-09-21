const mongoose = require("mongoose");
const { Schema } = mongoose;
const visionSchema = new Schema({
  title: String,
  content: String,
  newsPhoto: String,
  date: Date,
});

const VisionPost = mongoose.model("/vision", visionSchema);

module.exports = VisionPost;
