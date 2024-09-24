const mongoose = require("mongoose");
const { Schema } = mongoose;
const visionSchema = new Schema({
  vision: String,
  photo: String,
});

const VisionPost = mongoose.model("/vision", visionSchema);

module.exports = VisionPost;
