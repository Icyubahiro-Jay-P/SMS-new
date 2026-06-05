import StockOut from "../models/StockOut.js";
import Item from "../models/Item.js";

export const createStockOut = async (req, res, next) => {
  try {
    const { ItemName, QuantityOut, StockOutDate } = req.body;

    if (!ItemName || !QuantityOut) {
      return res.status(400).json({
        success: false,
        message: "ItemName and QuantityOut are required",
      });
    }

    // Check if item exists and has sufficient stock
    const item = await Item.findOne({ ItemName });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in inventory",
      });
    }

    if (item.CurrentStock < QuantityOut) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${item.CurrentStock}, Requested: ${QuantityOut}`,
      });
    }

    // Create stock out record
    const stockOut = await StockOut.create({
      ItemName,
      QuantityOut,
      TotalQuantityOut: QuantityOut,
      StockOutDate: StockOutDate || Date.now(),
      recordedBy: req.user.id,
    });

    // Update item current stock
    item.CurrentStock -= QuantityOut;
    await item.save();

    res.status(201).json({
      success: true,
      message: "Stock out recorded successfully",
      stockOut,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockOutRecords = async (req, res, next) => {
  try {
    const { itemName, startDate, endDate } = req.query;
    let query = {};

    if (itemName) {
      query.ItemName = { $regex: itemName, $options: "i" };
    }

    if (startDate && endDate) {
      query.StockOutDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stockOutRecords = await StockOut.find(query)
      .populate("recordedBy", "User_Name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, stockOutRecords });
  } catch (error) {
    next(error);
  }
};

export const getStockOutById = async (req, res, next) => {
  try {
    const stockOut = await StockOut.findById(req.params.id).populate(
      "recordedBy",
      "User_Name",
    );

    if (!stockOut) {
      return res
        .status(404)
        .json({ success: false, message: "Stock out record not found" });
    }

    res.status(200).json({ success: true, stockOut });
  } catch (error) {
    next(error);
  }
};

export const updateStockOut = async (req, res, next) => {
  try {
    const stockOut = await StockOut.findById(req.params.id);

    if (!stockOut) {
      return res
        .status(404)
        .json({ success: false, message: "Stock out record not found" });
    }

    const oldQuantity = stockOut.QuantityOut;
    const newQuantity = req.body.QuantityOut || oldQuantity;

    // Check if update is valid
    const item = await Item.findOne({ ItemName: stockOut.ItemName });
    if (item) {
      const availableStock = item.CurrentStock + oldQuantity; // Add back old quantity
      if (availableStock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for update. Available: ${availableStock}, Requested: ${newQuantity}`,
        });
      }

      // Update item stock
      item.CurrentStock -= newQuantity;
      item.CurrentStock += oldQuantity;
      item.CurrentStock -= newQuantity;
      await item.save();
    }

    const updatedStockOut = await StockOut.findByIdAndUpdate(
      req.params.id,
      { ...req.body, QuantityOut: newQuantity, TotalQuantityOut: newQuantity },
      { new: true, runValidators: true },
    ).populate("recordedBy", "User_Name");

    res
      .status(200)
      .json({
        success: true,
        message: "Stock out updated successfully",
        stockOut: updatedStockOut,
      });
  } catch (error) {
    next(error);
  }
};

export const deleteStockOut = async (req, res, next) => {
  try {
    const stockOut = await StockOut.findById(req.params.id);

    if (!stockOut) {
      return res
        .status(404)
        .json({ success: false, message: "Stock out record not found" });
    }

    // Revert item stock
    const item = await Item.findOne({ ItemName: stockOut.ItemName });
    if (item) {
      item.CurrentStock += stockOut.QuantityOut;
      await item.save();
    }

    await StockOut.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({
        success: true,
        message: "Stock out record deleted successfully",
      });
  } catch (error) {
    next(error);
  }
};
