const mongoose = require("mongoose");
const { Schema } = mongoose;
const ActivitiesSchema = new Schema({
  activity: String,
  activityPhotos: [String],
});

const ActivitiesPost = mongoose.model("/activities", ActivitiesSchema);

module.exports = ActivitiesPost;
