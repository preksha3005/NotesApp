const mongoose = require("mongoose");
const NotesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
});
const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;
