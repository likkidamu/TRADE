const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  title: { type: String, required: [true, "Title is required"] },
  category: { type: String, required: [true, "Category is required"] },
  OfferedBy: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
});

const offerTrade = mongoose.model("offer", offerSchema);

module.exports = offerTrade;