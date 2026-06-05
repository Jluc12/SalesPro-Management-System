import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';

const tabs = [
  { key: 'Daily', icon: '📅' },
  { key: 'Weekly', icon: '📆' },
  { key: 'Monthly', icon: '📊' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Daily');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setData(null);
    try {
      let res;
      if (activeTab === 'Daily') res = await API.get(`/reports/daily?date=${date}`);
      else if (activeTab === 'Weekly') res = await API.get('/reports/weekly');
      else res = await API.get(`/reports/monthly?month=${month}`);
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [activeTab, date, month]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const fmt = (n) => new Intl.NumberFormat('en-RW').format(n || 0);

  const printReport = () => window.print();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-500 text-sm mt-1">View and analyze your sales performance</p>
        </div>
        <button onClick={printReport} className="no-print bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>

      {/* Tabs */}
      <div className="no-print flex gap-1 bg-gray-100 p-1 rounded-xl mb-4 w-fit shadow-sm">
        {tabs.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === key ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{icon}</span>
            {key}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="no-print flex gap-3 mb-5">
        {activeTab === 'Daily' && (
          <div className="flex gap-2 items-center bg-white rounded-lg border border-gray-200 p-1">
            <input
              type="date" value={date}
              onChange={e => setDate(e.target.value)}
              className="border-0 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={fetchReport} className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all">
              Load
            </button>
          </div>
        )}
        {activeTab === 'Monthly' && (
          <div className="flex gap-2 items-center bg-white rounded-lg border border-gray-200 p-1">
            <input
              type="month" value={month}
              onChange={e => setMonth(e.target.value)}
              className="border-0 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={fetchReport} className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all">
              Load
            </button>
          </div>
        )}
        {activeTab === 'Weekly' && (
          <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Showing data from the last 7 days
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading report...
          </div>
        </div>
      ) : data ? (
        <div className="animate-fade-in">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">Period</span>
              </div>
              <p className="font-semibold text-gray-900">{data.date || data.period}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">Total Transactions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.summary?.totalSales || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">Total Revenue (RWF)</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{fmt(data.summary?.totalRevenue)}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-semibold text-gray-800 text-sm">{activeTab} Report — {data.date || data.period}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Invoice', 'Date', 'Customer', 'Product', 'Payment', 'Amount (RWF)'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.sales?.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No sales recorded for this period.</td></tr>
                  ) : data.sales?.map(s => (
                    <tr key={s.invoiceNumber} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs">INV-{String(s.invoiceNumber).padStart(4, '0')}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.salesDate).toLocaleDateString('en-RW', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="px-4 py-3 text-gray-800">{s.firstName} {s.lastName}</td>
                      <td className="px-4 py-3 text-gray-700">{s.productName}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{s.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{fmt(s.totalAmountPaid)}</td>
                    </tr>
                  ))}
                </tbody>
                {data.sales?.length > 0 && (
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">Total Revenue:</td>
                      <td className="px-4 py-3 font-bold text-green-700 text-base">{fmt(data.summary?.totalRevenue)} RWF</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📊</div>
          <p>Select a report type to view data</p>
        </div>
      )}
    </div>
  );
}
