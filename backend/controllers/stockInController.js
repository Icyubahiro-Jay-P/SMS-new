import StockIn from "../models/StockIn.js";
import Item from "../models/Item.js";

export const createStockIn = async (req, res, next) => {
  try {
    const { ItemName, Description, QuantityIn, SupplierName, StockInDate } =
      req.body;

    if (!ItemName || !QuantityIn || !SupplierName) {
      return res.status(400).json({
        success: false,
        message: "ItemName, QuantityIn, and SupplierName are required",
      });
    }

    // Find or create item
    let item = await Item.findOne({ ItemName });
    if (!item) {
      item = await Item.create({ ItemName, Description });
    }

    // Create stock in record
    const stockIn = await StockIn.create({
      ItemName,
      Description,
      QuantityIn,
      TotalQuantityIn: QuantityIn,
      SupplierName,
      StockInDate: StockInDate || Date.now(),
      recordedBy: req.user.id,
    });

    // Update item current stock
    item.CurrentStock += QuantityIn;
    await item.save();

    res.status(201).json({
      success: true,
      message: "Stock in recorded successfully",
      stockIn,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockInRecords = async (req, res, next) => {
  try {
    const { itemName, startDate, endDate } = req.query;
    let query = {};

    if (itemName) {
      query.ItemName = { $regex: itemName, $options: "i" };
    }

    if (startDate && endDate) {
      query.StockInDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stockInRecords = await StockIn.find(query)
      .populate("recordedBy", "User_Name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, stockInRecords });
  } catch (error) {
    next(error);
  }
};

export const getStockInById = async (req, res, next) => {
  try {
    const stockIn = await StockIn.findById(req.params.id).populate(
      "recordedBy",
      "User_Name",
    );

    if (!stockIn) {
      return res
        .status(404)
        .json({ success: false, message: "Stock in record not found" });
    }

    res.status(200).json({ success: true, stockIn });
  } catch (error) {
    next(error);
  }
};

export const updateStockIn = async (req, res, next) => {
  try {
    const stockIn = await StockIn.findById(req.params.id);

    if (!stockIn) {
      return res
        .status(404)
        .json({ success: false, message: "Stock in record not found" });
    }

    const oldQuantity = stockIn.QuantityIn;
    const newQuantity = req.body.QuantityIn || oldQuantity;

    // Update item stock
    const item = await Item.findOne({ ItemName: stockIn.ItemName });
    if (item) {
      item.CurrentStock -= oldQuantity;
      item.CurrentStock += newQuantity;
      await item.save();
    }

    const updatedStockIn = await StockIn.findByIdAndUpdate(
      req.params.id,
      { ...req.body, QuantityIn: newQuantity, TotalQuantityIn: newQuantity },
      { new: true, runValidators: true },
    ).populate("recordedBy", "User_Name");

    res
      .status(200)
      .json({
        success: true,
        message: "Stock in updated successfully",
        stockIn: updatedStockIn,
      });
  } catch (error) {
    next(error);
  }
};

export const deleteStockIn = async (req, res, next) => {
  try {
    const stockIn = await StockIn.findById(req.params.id);

    if (!stockIn) {
      return res
        .status(404)
        .json({ success: false, message: "Stock in record not found" });
    }

    // Revert item stock
    const item = await Item.findOne({ ItemName: stockIn.ItemName });
    if (item) {
      item.CurrentStock -= stockIn.QuantityIn;
      await item.save();
    }

    await StockIn.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Stock in record deleted successfully" });
  } catch (error) {
    next(error);
  }
};
