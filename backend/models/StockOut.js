import mongoose from "mongoose";

const stockOutSchema = new mongoose.Schema({
  ItemName: {
    type: String,
    required: [true, "Please provide an item name"],
  },
  QuantityOut: {
    type: Number,
    required: [true, "Please provide quantity"],
    min: [1, "Quantity must be at least 1"],
  },
  TotalQuantityOut: {
    type: Number,
    required: true,
  },
  StockOutDate: {
    type: Date,
    default: Date.now,
  },
  recordedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StockOut", stockOutSchema);
