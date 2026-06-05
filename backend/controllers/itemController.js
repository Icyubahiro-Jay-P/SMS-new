import Item from "../models/Item.js";

// Pre-configured items for the system
const PREDEFINED_ITEMS = [
  {
    ItemName: "Steel bars",
    Description: "Construction steel bars",
    UnitPrice: 150,
  },
  {
    ItemName: "Wheelbarrows",
    Description: "Construction wheelbarrows",
    UnitPrice: 200,
  },
  {
    ItemName: "Ceramic tiles",
    Description: "Floor and wall ceramic tiles",
    UnitPrice: 50,
  },
  { ItemName: "Cement", Description: "Portland cement bags", UnitPrice: 80 },
  {
    ItemName: "Painting brush",
    Description: "Various sizes painting brushes",
    UnitPrice: 15,
  },
  {
    ItemName: "Color Paint",
    Description: "Exterior and interior paint",
    UnitPrice: 120,
  },
  {
    ItemName: "masonry nails",
    Description: "Masonry construction nails",
    UnitPrice: 10,
  },
  {
    ItemName: "iron sheets",
    Description: "Corrugated iron sheets",
    UnitPrice: 300,
  },
];

export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const { ItemName, Description, UnitPrice } = req.body;

    if (!ItemName) {
      return res
        .status(400)
        .json({ success: false, message: "Item name is required" });
    }

    const item = await Item.create({
      ItemName,
      Description,
      UnitPrice: UnitPrice || 0,
    });

    res
      .status(201)
      .json({ success: true, message: "Item created successfully", item });
  } catch (error) {
    next(error);
  }
};

export const initializeItems = async (req, res, next) => {
  try {
    const existingItems = await Item.countDocuments();

    if (existingItems > 0) {
      return res.status(400).json({
        success: false,
        message: "Items already exist in the system. Skipping initialization.",
        itemCount: existingItems,
      });
    }

    const createdItems = await Item.insertMany(PREDEFINED_ITEMS);

    res.status(201).json({
      success: true,
      message: "Predefined items initialized successfully",
      itemsCount: createdItems.length,
      items: createdItems,
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ success: true, message: "Item updated successfully", item });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
