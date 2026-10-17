import React, { useEffect, useState } from 'react';
import { adminAPI } from '../config/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getCoupons();
      setCoupons(res.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!code.trim()) return setError('Coupon code is required');
    if (value === '' || Number(value) < 0) return setError('Enter a valid value');

    try {
      setSaving(true);
      await adminAPI.createCoupon({
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        description: description.trim(),
      });
      setCode('');
      setDescription('');
      setType('percent');
      setValue('');
      setSuccess('Coupon created');
      await load();
    } catch (err) {
      setError(err?.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await adminAPI.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      setSuccess('Coupon deleted');
    } catch (err) {
      setError(err?.message || 'Failed to delete coupon');
    }
  };

  const toggleListed = async (id) => {
    try {
      const res = await adminAPI.toggleCouponListed(id);
      const updated = res.data;
      setCoupons((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isListed: updated.isListed } : c))
      );
      setSuccess(updated.isListed ? 'Coupon now shown on checkout' : 'Coupon hidden from checkout');
    } catch (err) {
      setError(err?.message || 'Failed to update coupon');
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <p className="text-gray-600 text-sm mt-1">
          Create discount codes and choose which ones appear on checkout.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">{success}</div>
      )}

      <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Coupon</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SAVE10"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value {type === 'percent' ? '(%)' : '(₹)'}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'percent' ? '10' : '100'}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional — shown to customers)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 10% off on all orders"
            className={inputCls}
            maxLength={200}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#5C3A21] text-white hover:bg-[#4a2e1a] disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Coupon'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          New coupons start <strong>hidden</strong> from checkout. Click <strong>Show on Checkout</strong> below to list them.
        </p>
      </form>

      {loading ? (
        <div className="text-sm text-gray-500">Loading coupons…</div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-sm text-gray-500">
          No coupons yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Active</th>
                  <th className="px-4 py-3 font-medium">On Checkout</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold text-[#5C3A21]">{c.code}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">
                      {c.description ? (
                        <span className="line-clamp-2">{c.description}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-700">{c.type}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.isListed ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {c.isListed ? 'Shown' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => toggleListed(c._id)}
                          className={`text-xs font-medium px-2 py-1 rounded border ${
                            c.isListed
                              ? 'text-slate-700 border-slate-200 hover:bg-slate-50'
                              : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                          }`}
                        >
                          {c.isListed ? 'Hide from Checkout' : 'Show on Checkout'}
                        </button>
                        <button
                          onClick={() => remove(c._id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded border border-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;