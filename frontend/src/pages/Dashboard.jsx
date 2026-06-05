import React, { useState, useEffect } from "react";
import { getDashboardStats } from "../api/apiClient";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-blue-50 border-l-4 border-blue-600">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalItems}
              </div>
              <div className="text-gray-600">Total Items</div>
            </div>

            <div className="card bg-green-50 border-l-4 border-green-600">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalStock}
              </div>
              <div className="text-gray-600">Total Stock Units</div>
            </div>

            <div className="card bg-purple-50 border-l-4 border-purple-600">
              <div className="text-2xl font-bold text-purple-600">
                RWF {stats.totalStockValue.toLocaleString()}
              </div>
              <div className="text-gray-600">Stock Value</div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Recent Transactions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Item Name</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Recorded By</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions &&
                    stats.recentTransactions.map((trans, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{trans.ItemName}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              trans.QuantityIn
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {trans.QuantityIn ? "Stock In" : "Stock Out"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {trans.QuantityIn || trans.QuantityOut}
                        </td>
                        <td className="px-4 py-2">
                          {trans.recordedBy?.User_Name}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(trans.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
