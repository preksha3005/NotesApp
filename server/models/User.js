// const mongoose = require("mongoose");
import mongoose from 'mongoose';
const RegSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// const User = mongoose.model("User", RegSchema);
// module.exports = User;

export default mongoose.model('User', RegSchema);