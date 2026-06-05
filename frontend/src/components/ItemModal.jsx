import React, { useState, useEffect } from "react";
import { createItem, updateItem } from "../api/apiClient";

const ItemModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    ItemName: "",
    Description: "",
    UnitPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setFormData({
        ItemName: item.ItemName,
        Description: item.Description,
        UnitPrice: item.UnitPrice,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (item) {
        await updateItem(item._id, formData);
      } else {
        await createItem(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {item ? "Edit Item" : "Add New Item"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="ItemName"
              value={formData.ItemName}
              onChange={handleChange}
              className="input-field"
              placeholder="Item name"
              required
              disabled={!!item}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="input-field"
              placeholder="Item description"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price (RWF)
            </label>
            <input
              type="number"
              name="UnitPrice"
              value={formData.UnitPrice}
              onChange={handleChange}
              className="input-field"
              placeholder="Unit price"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
