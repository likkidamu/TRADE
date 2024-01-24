const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saveSchema = new Schema({
   title: { type: String, required: [true, "Title is required"] },
  category: { type: String, required: [true, "Category is required"] },
  SavedBy: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
});

const saveItem = mongoose.model("save", saveSchema);

module.exports = saveItem;