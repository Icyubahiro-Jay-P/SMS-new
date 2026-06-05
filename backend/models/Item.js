import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  ItemName: {
    type: String,
    required: [true, "Please provide an item name"],
    unique: true,
    trim: true,
  },
  Description: {
    type: String,
    default: "",
  },
  CurrentStock: {
    type: Number,
    default: 0,
    min: 0,
  },
  UnitPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Item", itemSchema);
