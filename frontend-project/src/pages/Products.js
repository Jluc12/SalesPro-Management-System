import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productName: '', quantitySold: '', unitPrice: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(() => {
    setFetching(true);
    API.get('/products').then(res => setProducts(res.data)).catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName.trim() || !form.quantitySold || !form.unitPrice) {
      toast.error('Please fill in all fields');
      return;
    }
    const qty = Number(form.quantitySold);
    const price = Number(form.unitPrice);
    if (qty < 0 || price < 0) {
      toast.error('Quantity and price must be positive numbers');
      return;
    }
    setLoading(true);
    try {
      await API.post('/products', { productName: form.productName.trim(), quantitySold: qty, unitPrice: price });
      toast.success('Product added successfully!');
      setForm({ productName: '', quantitySold: '', unitPrice: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    !search || p.productName.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (n) => new Intl.NumberFormat('en-RW').format(n);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1">Add and manage your product inventory</p>
        </div>
        <span className="text-3xl">📦</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-green-600 text-xs font-bold">+</span>
              Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                <input
                  value={form.productName}
                  onChange={e => setForm({ ...form, productName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Samsung TV 43\"" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Quantity Sold</label>
                <input
                  type="number" min="0"
                  value={form.quantitySold}
                  onChange={e => setForm({ ...form, quantitySold: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="0" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price (RWF)</label>
                <input
                  type="number" min="0" step="0.01"
                  value={form.unitPrice}
                  onChange={e => setForm({ ...form, unitPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="0.00" required
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : '+ Add Product'}
              </button>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <span className="text-xs text-gray-400">{filtered.length} product{filtered.length !== 1 && 's'}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['#', 'Product Code', 'Product Name', 'Qty Sold', 'Unit Price (RWF)', 'Date Added'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fetching ? (
                    <tr><td colSpan={6} className="text-center py-12"><span className="text-gray-400">Loading...</span></td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found.</td></tr>
                  ) : filtered.map((p, i) => (
                    <tr key={p.productCode} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">P{String(p.productCode).padStart(4, '0')}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.productName}</td>
                      <td className="px-4 py-3">
                        <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">{p.quantitySold}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-700">{fmt(p.unitPrice)}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString('en-RW', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
