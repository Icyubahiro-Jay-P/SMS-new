import React, { useState, useEffect } from "react";
import { getDailyStockReport, getAllItems } from "../api/apiClient";

const ReportsPage = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await getDailyStockReport({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilter = () => {
    fetchReport();
  };

  const calculateTotals = () => {
    return {
      totalReceived: report.reduce(
        (sum, item) => sum + item.TotalQuantityReceived,
        0,
      ),
      totalIssued: report.reduce(
        (sum, item) => sum + item.TotalQuantityIssued,
        0,
      ),
      totalRemaining: report.reduce(
        (sum, item) => sum + item.RemainingQuantityInStock,
        0,
      ),
      totalValue: report.reduce((sum, item) => sum + item.StockValue, 0),
    };
  };

  const totals = calculateTotals();

  if (loading) {
    return <div className="text-center py-8">Loading report...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Stock Status Report
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <button onClick={handleFilter} className="btn-primary w-full">
              Filter Report
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Received</div>
            <div className="text-2xl font-bold text-blue-600">
              {totals.totalReceived}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Issued</div>
            <div className="text-2xl font-bold text-red-600">
              {totals.totalIssued}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Remaining</div>
            <div className="text-2xl font-bold text-green-600">
              {totals.totalRemaining}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="text-2xl font-bold text-purple-600">
              RWF {totals.totalValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Item Name</th>
              <th className="px-4 py-3 text-left font-semibold">
                Total Received
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Total Issued
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Remaining Stock
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Stock Value (RWF)
              </th>
            </tr>
          </thead>
          <tbody>
            {report.length > 0 ? (
              report.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.ItemName}</td>
                  <td className="px-4 py-3">{item.TotalQuantityReceived}</td>
                  <td className="px-4 py-3">{item.TotalQuantityIssued}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded font-semibold ${
                        item.RemainingQuantityInStock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.RemainingQuantityInStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    RWF {item.StockValue.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No items in inventory
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
