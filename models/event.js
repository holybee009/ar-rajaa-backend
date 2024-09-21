const mongoose = require("mongoose");
const { Schema } = mongoose;
const EventSchema = new Schema({
  eventName: String,
  eventVenue: String,
  date: Date,
});

const EventInfo = mongoose.model("/event", EventSchema);

module.exports = EventInfo;
