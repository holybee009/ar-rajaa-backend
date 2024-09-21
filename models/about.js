const mongoose = require("mongoose");
const { Schema } = mongoose;
const AboutSchema = new Schema({
    about: String
});

const AboutPost = mongoose.model("/about", AboutSchema);

module.exports = AboutPost;
