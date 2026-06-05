import React, { useState, useEffect } from "react";
import { createStockOut, updateStockOut, getAllItems } from "../api/apiClient";

const StockOutModal = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    ItemName: "",
    QuantityOut: "",
    StockOutDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItems();
        setItems(response.data.items);
      } catch (err) {
        console.error("Failed to load items");
      }
    };

    fetchItems();

    if (record) {
      setFormData({
        ItemName: record.ItemName,
        QuantityOut: record.QuantityOut,
        StockOutDate: record.StockOutDate.split("T")[0],
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (record) {
        await updateStockOut(record._id, formData);
      } else {
        await createStockOut(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {record ? "Edit Stock Out" : "Issue Stock"}
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
            <select
              name="ItemName"
              value={formData.ItemName}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select item to issue</option>
              {items.map((item) => (
                <option key={item._id} value={item.ItemName}>
                  {item.ItemName} (Available: {item.CurrentStock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Out
            </label>
            <input
              type="number"
              name="QuantityOut"
              value={formData.QuantityOut}
              onChange={handleChange}
              className="input-field"
              placeholder="Quantity to issue"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Out Date
            </label>
            <input
              type="date"
              name="StockOutDate"
              value={formData.StockOutDate}
              onChange={handleChange}
              className="input-field"
              required
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

export default StockOutModal;
