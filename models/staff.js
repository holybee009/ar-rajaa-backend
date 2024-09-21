const mongoose = require("mongoose");
const { Schema } = mongoose;
const StaffSchema = new Schema({
    selectedYear: String,
    staffName: String,
    staffClass: String,
    uploadedFileUrl: String
});

const StaffPost = mongoose.model("/staff", StaffSchema);

module.exports = StaffPost;
