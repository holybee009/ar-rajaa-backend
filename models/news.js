const mongoose = require("mongoose");
const { Schema } = mongoose;
const NewsSchema = new Schema({
  title: String,
  content: String,
  photo: String,
});

const NewsPost = mongoose.model("/news", NewsSchema);

module.exports = NewsPost;
