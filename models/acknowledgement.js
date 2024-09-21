const mongoose = require("mongoose");
const { Schema } = mongoose;
const AcknowledgementSchema = new Schema({
  acknowledgement: String,
  photo: String,
});

const AcknowledgementPost = mongoose.model("/acknowledgement", AcknowledgementSchema);

module.exports = AcknowledgementPost;
