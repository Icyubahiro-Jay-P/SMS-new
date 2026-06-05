import Item from "../models/Item.js";

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

export const initializeItems = async () => {
  try {
    const existingItems = await Item.countDocuments();

    if (existingItems > 0) {
      console.log(
        `✓ Items already exist in the system (${existingItems} items). Skipping initialization.`,
      );
      return { success: false, message: "Items already exist" };
    }

    const createdItems = await Item.insertMany(PREDEFINED_ITEMS);
    console.log(
      `✓ Initialized ${createdItems.length} predefined items successfully`,
    );

    return {
      success: true,
      message: "Items initialized successfully",
      itemsCount: createdItems.length,
      items: createdItems,
    };
  } catch (error) {
    console.error("Error initializing items:", error.message);
    return { success: false, message: error.message };
  }
};
