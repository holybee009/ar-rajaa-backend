const mongoose = require("mongoose");
const { Schema } = mongoose;
const NewsSchema = new Schema({
  title: String,
  content: String,
  newsPhoto: String,
  date: Date,
});

const NewsPost = mongoose.model("/news", NewsSchema);

module.exports = NewsPost;
