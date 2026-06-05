import React, { useState, useEffect } from "react";
import { getStockOutRecords, deleteStockOut } from "../api/apiClient";
import StockOutModal from "../components/StockOutModal";

const StockOutPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await getStockOutRecords({ itemName: searchTerm });
      setRecords(response.data.stockOutRecords);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteStockOut(id);
        setRecords(records.filter((r) => r._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete record");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedRecord(null);
    fetchRecords();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Stock Out Records</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Issue Stock
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {showModal && (
        <StockOutModal record={selectedRecord} onClose={handleModalClose} />
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Item Name</th>
              <th className="px-4 py-3 text-left font-semibold">Quantity</th>
              <th className="px-4 py-3 text-left font-semibold">Recorded By</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{record.ItemName}</td>
                  <td className="px-4 py-3">{record.QuantityOut}</td>
                  <td className="px-4 py-3">{record.recordedBy?.User_Name}</td>
                  <td className="px-4 py-3">
                    {new Date(record.StockOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="btn-danger text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOutPage;
