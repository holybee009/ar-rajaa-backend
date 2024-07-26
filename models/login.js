const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  username: String,
  password: String,
});

const AdminLogin = mongoose.model("/login", AdminSchema);

module.exports = AdminLogin;
