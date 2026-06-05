import Item from "../models/Item.js";
import StockIn from "../models/StockIn.js";
import StockOut from "../models/StockOut.js";

export const getDailyStockReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let stockInQuery = {};
    let stockOutQuery = {};

    if (startDate && endDate) {
      const dateFilter = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
      stockInQuery.StockInDate = dateFilter;
      stockOutQuery.StockOutDate = dateFilter;
    }

    // Get all items
    const items = await Item.find();

    // Get stock in and stock out for date range
    const stockInRecords = await StockIn.find(stockInQuery);

    const stockOutRecords = await StockOut.find(stockOutQuery);

    // Build report
    const report = items.map((item) => {
      const totalIn = stockInRecords
        .filter((si) => si.ItemName === item.ItemName)
        .reduce((sum, si) => sum + si.QuantityIn, 0);

      const totalOut = stockOutRecords
        .filter((so) => so.ItemName === item.ItemName)
        .reduce((sum, so) => sum + so.QuantityOut, 0);

      return {
        ItemName: item.ItemName,
        TotalQuantityReceived: totalIn,
        TotalQuantityIssued: totalOut,
        RemainingQuantityInStock: item.CurrentStock,
        StockValue: item.CurrentStock * item.UnitPrice,
      };
    });

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalItems = await Item.countDocuments();
    const items = await Item.find();

    const totalStock = items.reduce((sum, item) => sum + item.CurrentStock, 0);
    const totalStockValue = items.reduce(
      (sum, item) => sum + item.CurrentStock * item.UnitPrice,
      0,
    );

    const recentStockIn = await StockIn.find()
      .populate("recordedBy", "User_Name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentStockOut = await StockOut.find()
      .populate("recordedBy", "User_Name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        totalStock,
        totalStockValue,
        recentTransactions: [...recentStockIn, ...recentStockOut]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};
