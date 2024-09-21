const mongoose = require("mongoose");
const { Schema } = mongoose;
const StudentsSchema = new Schema({
    selectedYear: String,
    studentName: String,
    studentClass: String,
    uploadedFileUrl: String
});

const StudentsPost = mongoose.model("/students", StudentsSchema);

module.exports = StudentsPost;
