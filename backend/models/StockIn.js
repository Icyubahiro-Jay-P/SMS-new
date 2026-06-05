import mongoose from "mongoose";

const stockInSchema = new mongoose.Schema({
  ItemName: {
    type: String,
    required: [true, "Please provide an item name"],
  },
  Description: {
    type: String,
    default: "",
  },
  QuantityIn: {
    type: Number,
    required: [true, "Please provide quantity"],
    min: [1, "Quantity must be at least 1"],
  },
  TotalQuantityIn: {
    type: Number,
    required: true,
  },
  SupplierName: {
    type: String,
    required: [true, "Please provide supplier name"],
  },
  StockInDate: {
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

export default mongoose.model("StockIn", stockInSchema);
