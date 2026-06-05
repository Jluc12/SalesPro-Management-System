import React, { useEffect, useState } from 'react';
import API from '../services/api';

const StatCard = ({ label, value, icon, color, bgColor }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 card-hover animate-slide-up`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    API.get('/reports/summary')
      .then(res => { if (mounted) setSummary(res.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const fmt = (n) => new Intl.NumberFormat('en-RW').format(n || 0);

  const statCards = [
    { label: 'Total Customers', value: summary?.customers || 0, icon: '👥', color: 'border-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Total Products', value: summary?.products || 0, icon: '📦', color: 'border-green-500', bgColor: 'bg-green-50' },
    { label: 'Total Sales', value: summary?.sales || 0, icon: '🛒', color: 'border-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Revenue (RWF)', value: `RWF ${fmt(summary?.revenue)}`, icon: '💰', color: 'border-yellow-500', bgColor: 'bg-yellow-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your Sales Record Management System</p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">Top Selling Products</h2>
                <p className="text-xs text-gray-500 mt-0.5">Best performing products by revenue</p>
              </div>
              <span className="text-3xl">🏆</span>
            </div>

            {summary?.topProducts?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales Count</th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue (RWF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.topProducts.map((p, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 text-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-500">{i + 1}</span>
                            {p.productName}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{p.salesCount} sold</span>
                        </td>
                        <td className="py-3 font-semibold text-gray-900 text-right">{fmt(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-gray-400 text-sm">No sales data yet. Start recording sales to see insights!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
