import React, { useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';

const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'Card'];
const PAGE_SIZE = 10;

const emptyForm = {
  customerNumber: '',
  productCode: '',
  salesDate: new Date().toISOString().split('T')[0],
  paymentMethod: 'Cash',
  totalAmountPaid: '',
};

const PAYMENT_BADGES = {
  'Cash': 'bg-green-50 text-green-700',
  'Mobile Money': 'bg-blue-50 text-blue-700',
  'Bank Transfer': 'bg-purple-50 text-purple-700',
  'Card': 'bg-orange-50 text-orange-700',
};

function getPaymentBadge(method) {
  return PAYMENT_BADGES[method] || 'bg-gray-50 text-gray-700';
}

const fmt = (n) => new Intl.NumberFormat('en-RW').format(n);

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0, total: 0 });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchListData = useCallback(() => {
    API.get('/customers/all').then(res => setCustomers(res.data)).catch(() => {});
    API.get('/products/all').then(res => setProducts(res.data)).catch(() => {});
  }, []);

  const fetchSales = useCallback((page = 1) => {
    setFetching(true);
    API.get(`/sales?page=${page}&limit=${PAGE_SIZE}`)
      .then(res => {
        setSales(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => { fetchSales(); fetchListData(); }, [fetchSales, fetchListData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { customerNumber, productCode, salesDate, paymentMethod, totalAmountPaid } = form;
    if (!customerNumber || !productCode || !salesDate || !paymentMethod || !totalAmountPaid) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await API.put(`/sales/${editId}`, form);
        toast.success('Sale updated successfully!');
      } else {
        await API.post('/sales', form);
        toast.success('Sale recorded successfully!');
      }
      setForm(emptyForm);
      setEditId(null);
      fetchSales(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving sale');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((sale) => {
    setEditId(sale.invoiceNumber);
    setForm({
      customerNumber: sale.customerNumber,
      productCode: sale.productCode,
      salesDate: sale.salesDate?.split('T')[0] || '',
      paymentMethod: sale.paymentMethod,
      totalAmountPaid: sale.totalAmountPaid,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/sales/${id}`);
      toast.success('Sale deleted successfully');
      setConfirmDelete(null);
      fetchSales(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting sale');
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchSales(page);
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    const pages = [];
    const start = Math.max(1, pagination.page - 2);
    const end = Math.min(pagination.totalPages, pagination.page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{pagination.total} total transactions</span>
        <div className="flex gap-1">
          <button
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="px-3 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Prev
          </button>
          {pages.map(p => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 text-xs rounded border transition-all ${
                p === pagination.page ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-3 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-500 text-sm mt-1">Record, update, and manage sales transactions</p>
        </div>
        <span className="text-3xl">🛒</span>
      </div>

      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 ${editId ? 'ring-2 ring-purple-200' : ''}`}>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${editId ? 'bg-yellow-50 text-yellow-600' : 'bg-purple-50 text-purple-600'}`}>
            {editId ? '✏' : '+'}
          </span>
          {editId ? `Edit Sale #INV-${String(editId).padStart(4, '0')}` : 'Record New Sale'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Customer</label>
            <select
              value={form.customerNumber}
              onChange={e => setForm({ ...form, customerNumber: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.customerNumber} value={c.customerNumber}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
            <select
              value={form.productCode}
              onChange={e => {
                const prod = products.find(p => p.productCode === Number(e.target.value));
                setForm({ ...form, productCode: e.target.value, totalAmountPaid: prod ? prod.unitPrice : '' });
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            >
              <option value="">-- Select Product --</option>
              {products.map(p => (
                <option key={p.productCode} value={p.productCode}>
                  {p.productName} — {fmt(p.unitPrice)} RWF
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sales Date</label>
            <input
              type="date"
              value={form.salesDate}
              onChange={e => setForm({ ...form, salesDate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Total Amount Paid (RWF)</label>
            <input
              type="number" min="0" step="0.01"
              value={form.totalAmountPaid}
              onChange={e => setForm({ ...form, totalAmountPaid: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="0.00" required
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit" disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : editId ? 'Update Sale' : '+ Record Sale'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <span className="text-xs text-gray-400">{pagination.total} transaction{pagination.total !== 1 && 's'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Invoice', 'Customer', 'Product', 'Date', 'Payment', 'Amount (RWF)', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr><td colSpan={7} className="text-center py-12"><span className="text-gray-400">Loading...</span></td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-gray-400 text-sm">No sales recorded yet.</p>
                </td></tr>
              ) : sales.map(s => (
                <tr key={s.invoiceNumber} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs">INV-{String(s.invoiceNumber).padStart(4, '0')}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-gray-700">{s.productName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.salesDate).toLocaleDateString('en-RW', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentBadge(s.paymentMethod)}`}>{s.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{fmt(s.totalAmountPaid)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEdit(s)} className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1.5 rounded hover:bg-yellow-100 transition-all font-medium">
                        Edit
                      </button>
                      <button onClick={() => setConfirmDelete(s.invoiceNumber)} className="text-xs bg-red-50 text-red-700 px-2.5 py-1.5 rounded hover:bg-red-100 transition-all font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full mx-4 animate-scale-in">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.09 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-2">Confirm Delete</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Are you sure you want to delete <strong>INV-{String(confirmDelete).padStart(4, '0')}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-5 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium">
                Delete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
