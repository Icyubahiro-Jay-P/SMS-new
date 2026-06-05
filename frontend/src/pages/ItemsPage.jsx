import React, { useState, useEffect } from "react";
import { getAllItems, deleteItem, createItem } from "../api/apiClient";
import ItemModal from "../components/ItemModal";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getAllItems();
      setItems(response.data.items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id);
        setItems(items.filter((i) => i._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete item");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedItem(null);
    fetchItems();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Items Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add New Item
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showModal && (
        <ItemModal item={selectedItem} onClose={handleModalClose} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.ItemName}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {item.Description || "No description"}
              </p>
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm text-gray-600">Current Stock</p>
                <p className="text-2xl font-bold text-blue-600">
                  {item.CurrentStock}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Unit Price: RWF {item.UnitPrice}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 btn-danger text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No items found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
