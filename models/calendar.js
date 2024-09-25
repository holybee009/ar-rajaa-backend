const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the calendar object
const SingleSchema = new Schema({
    selectedNumber: {type: Number},
    startDate:{type: Date}, 
    endDate:{type: Date}, 
    scheduleName:{type: String},
  });

const CalendarSchema = new Schema({
  selectedYear: String,
  calendarData: [SingleSchema],
    term:String,
});

const CalendarPost = mongoose.model("/calendar", CalendarSchema);

module.exports = CalendarPost;
