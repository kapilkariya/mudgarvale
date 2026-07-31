import React, { useEffect, useMemo, useState } from 'react';
import { adminAPI } from '../config/api';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 10;

const emptyForm = (order) => ({
  customer: {
    name: order.user?.name || order.address?.name || '',
    email: order.user?.email || order.address?.email || '',
    phone: order.user?.phone || order.address?.phone || '',
  },
  address: {
    buildingFlatNo: order.address?.buildingFlatNo || '',
    address: order.address?.address || '',
    city: order.address?.city || '',
    state: order.address?.state || '',
    pincode: order.address?.pincode || '',
  },
  items: (order.items || []).map((item) => ({ ...item, selectedWeight: item.selectedWeight || '', quantity: item.quantity || 1, price: item.price || 0 })),
  subtotal: String(order.totalAmount - (order.deliveryCharge || 0)),
  totalAmount: String(order.totalAmount || 0),
});

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];
  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending_delivery', label: 'Not Delivered' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const loadOrders = async (nextPage, append) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      setError('');
      const response = await adminAPI.getAllOrders({ page: nextPage, limit: PAGE_SIZE });
      if (response.success) {
        setOrders((current) => append ? [...current, ...response.data.filter((item) => !current.some((existing) => existing._id === item._id))] : response.data);
        setPage(response.page);
        setHasMore(response.hasMore);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { loadOrders(1, false); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'pending_delivery') return orders.filter((order) => !['delivered', 'cancelled'].includes(order.orderStatus));
    if (activeFilter === 'delivered' || activeFilter === 'cancelled') return orders.filter((order) => order.orderStatus === activeFilter);
    return orders;
  }, [activeFilter, orders]);

  const updateOrderInList = (updated) => setOrders((current) => current.map((order) => order._id === updated._id ? { ...updated, user: updated.user || updated.userId || order.user } : order));

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await adminAPI.updateOrderStatus(orderId, orderStatus);
      if (response.success) updateOrderInList(response.data);
    } catch (err) { setError(err.message || 'Failed to update order status'); }
    finally { setUpdatingId(null); }
  };

  const openEdit = (order) => {
    setEditingOrder(order);
    setForm(emptyForm(order));
    setFormError('');
    setSuccess('');
  };

  const updateField = (group, field, value) => setForm((current) => group === 'totals'
    ? { ...current, [field]: value }
    : { ...current, [group]: { ...current[group], [field]: value } });
  const updateItem = (index, field, value) => setForm((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));

  const submitEdit = async (event) => {
    event.preventDefault();
    const subtotal = Number(form.subtotal);
    const totalAmount = Number(form.totalAmount);
    const itemsValid = form.items.every((item) => Number(item.selectedWeight) >= 0 && Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0 && Number(item.price) >= 0);
    if (!form.customer.name.trim() || !form.customer.phone.trim() || !itemsValid || !Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(totalAmount) || totalAmount < subtotal) {
      setFormError('Enter a name and phone, complete valid product values, and a total that is not below subtotal.');
      return;
    }
    try {
      setUpdatingId(editingOrder._id);
      setFormError('');
      const response = await adminAPI.updateOrder(editingOrder._id, {
        ...form,
        subtotal,
        totalAmount,
        items: form.items.map((item) => ({ ...item, selectedWeight: String(item.selectedWeight), quantity: Number(item.quantity), price: Number(item.price) })),
      });
      if (response.success) {
        updateOrderInList(response.data);
        setEditingOrder(null);
        setForm(null);
        setSuccess(response.message || 'Order updated successfully.');
      }
    } catch (err) { setFormError(err.message || 'Failed to update order'); }
    finally { setUpdatingId(null); }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price || 0);
  const getStatus = (status) => statusOptions.find((option) => option.value === status) || { label: status, color: 'bg-gray-100 text-gray-800' };
  const formatDate = (date) => new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const exportOrdersToExcel = () => {
    if (!orders.length) return;
    const rows = orders.map((order) => ({
      'Order Number': order.orderNumber, 'Customer Name': order.user?.name || '', 'Customer Email': order.user?.email || '', Phone: order.address?.phone || '',
      Address: [order.address?.address, order.address?.city, order.address?.state, order.address?.pincode].filter(Boolean).join(', '),
      Items: (order.items || []).map((item) => `${item.name} (${item.selectedWeight}kg) × ${item.quantity}`).join('; '),
      'Total Amount': order.totalAmount, 'Order Status': order.orderStatus, 'Created Date': order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '',
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Orders');
    XLSX.writeFile(workbook, `Orders_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading && !orders.length) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]" /></div>;

  return <div className="px-4 pb-8">
    <div className="h-20" />
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div><h1 className="text-2xl font-bold text-gray-900">Orders</h1><p className="text-gray-600 text-sm mt-1">Manage customer orders and update their status</p></div>
      <button onClick={exportOrdersToExcel} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm">Download loaded orders</button>
    </div>
    {error && <Notice tone="red" message={error} dismiss={() => setError('')} />}
    {success && <Notice tone="green" message={success} dismiss={() => setSuccess('')} />}
    <div className="mb-6 overflow-x-auto pb-2"><div className="flex gap-2 min-w-max">{filterOptions.map((filter) => <button key={filter.value} onClick={() => setActiveFilter(filter.value)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeFilter === filter.value ? 'bg-[#5C3A21] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{filter.label} ({filter.value === 'all' ? orders.length : filteredCount(orders, filter.value)})</button>)}</div></div>
    <div className="space-y-4">
      {filteredOrders.map((order) => <OrderCard key={order._id} order={order} expanded={expandedOrder === order._id} toggle={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} openEdit={() => openEdit(order)} status={getStatus(order.orderStatus)} statusOptions={statusOptions} updating={updatingId === order._id} onStatusChange={handleStatusChange} formatDate={formatDate} formatPrice={formatPrice} />)}
      {!filteredOrders.length && <div className="text-center py-12 bg-white rounded-xl text-gray-500">No loaded orders match this filter.</div>}
    </div>
    {hasMore && <div className="mt-6 text-center"><button onClick={() => loadOrders(page + 1, true)} disabled={loadingMore} className="px-5 py-2 bg-[#5C3A21] text-white rounded-lg disabled:opacity-60">{loadingMore ? 'Loading…' : 'Load More'}</button></div>}
    {!hasMore && orders.length > 0 && <p className="mt-6 text-center text-sm text-gray-500">All orders have been loaded.</p>}
    {editingOrder && form && <EditOrderModal form={form} onClose={() => { if (!updatingId) { setEditingOrder(null); setForm(null); } }} onSubmit={submitEdit} updateField={updateField} updateItem={updateItem} error={formError} saving={updatingId === editingOrder._id} />}
  </div>;
};

const filteredCount = (orders, filter) => filter === 'pending_delivery' ? orders.filter((order) => !['delivered', 'cancelled'].includes(order.orderStatus)).length : orders.filter((order) => order.orderStatus === filter).length;
const Notice = ({ tone, message, dismiss }) => <div className={`mb-4 p-3 bg-${tone}-100 text-${tone}-800 rounded-lg text-sm`}>{message}<button onClick={dismiss} className="ml-4 underline">Dismiss</button></div>;

const OrderCard = ({ order, expanded, toggle, openEdit, status, statusOptions, updating, onStatusChange, formatDate, formatPrice }) => <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="p-4 cursor-pointer active:bg-gray-50" onClick={toggle}><div className="flex justify-between items-start mb-2"><div><span className="font-semibold text-[#5C3A21] text-sm">#{order.orderNumber}</span><div className="flex items-center gap-2 mt-1"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span><span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span></div></div><span className="text-gray-400">{expanded ? '⌃' : '⌄'}</span></div><div className="flex justify-between"><div><p className="text-sm text-gray-600">{order.user?.name || order.address?.name || 'N/A'}</p><p className="text-xs text-gray-500">{order.user?.email || order.address?.email}</p></div><p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p></div></div>
  {expanded && <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4"><section className="text-sm space-y-1"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer & Shipping</h4><p>{order.address?.phone}</p><p>{[order.address?.buildingFlatNo, order.address?.address, order.address?.city, order.address?.state, order.address?.pincode].filter(Boolean).join(', ')}</p></section><section><h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>{order.items?.map((item) => <div key={item._id || item.productId} className="bg-white rounded-lg p-2 text-sm mb-2"><p className="font-medium">{item.name}</p><p className="text-gray-600 text-xs">{item.selectedWeight} kg × {item.quantity} · {formatPrice(item.price)} each</p></div>)}</section><section className="text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.totalAmount - (order.deliveryCharge || 0))}</span></p><p className="flex justify-between font-medium border-t pt-1 mt-1"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></p></section><div className="flex gap-2"><button onClick={(event) => { event.stopPropagation(); openEdit(); }} className="px-3 py-2 text-sm bg-[#5C3A21] text-white rounded-lg">Edit order</button><select value={order.orderStatus} onClick={(event) => event.stopPropagation()} onChange={(event) => onStatusChange(order._id, event.target.value)} disabled={updating} className="flex-1 text-sm border rounded-lg px-3 py-2 bg-white">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></div>}
</div>;

const EditOrderModal = ({ form, onClose, onSubmit, updateField, updateItem, error, saving }) => <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4"><form onSubmit={onSubmit} className="my-6 mx-auto max-w-3xl bg-white rounded-xl shadow-xl p-5"><div className="flex justify-between gap-4 mb-5"><h2 className="text-xl font-bold">Edit order</h2><button type="button" onClick={onClose} disabled={saving} className="text-gray-500">Close</button></div>{error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">{error}</div>}<h3 className="font-semibold mb-2">Customer information</h3><div className="grid sm:grid-cols-3 gap-3 mb-5"><Field label="Customer name" value={form.customer.name} onChange={(value) => updateField('customer', 'name', value)} required /><Field label="Email (fixed)" type="email" value={form.customer.email} readOnly /><Field label="Phone number" value={form.customer.phone} onChange={(value) => updateField('customer', 'phone', value)} required /></div><h3 className="font-semibold mb-2">Shipping address</h3><div className="grid sm:grid-cols-2 gap-3 mb-5"><Field label="Building / Flat" value={form.address.buildingFlatNo} onChange={(value) => updateField('address', 'buildingFlatNo', value)} /><Field label="Street address" value={form.address.address} onChange={(value) => updateField('address', 'address', value)} required /><Field label="City" value={form.address.city} onChange={(value) => updateField('address', 'city', value)} required /><Field label="State" value={form.address.state} onChange={(value) => updateField('address', 'state', value)} required /><Field label="Pincode" value={form.address.pincode} onChange={(value) => updateField('address', 'pincode', value)} required /></div><h3 className="font-semibold mb-2">Products</h3><div className="space-y-3 mb-5">{form.items.map((item, index) => <div key={item._id || item.productId || index} className="border rounded-lg p-3"><p className="font-medium mb-2">{item.name}</p><div className="grid sm:grid-cols-3 gap-3"><Field label="Weight (kg)" type="number" min="0" step="any" value={item.selectedWeight} onChange={(value) => updateItem(index, 'selectedWeight', value)} required /><Field label="Quantity" type="number" min="1" step="1" value={item.quantity} onChange={(value) => updateItem(index, 'quantity', value)} required /><Field label="Unit price" type="number" min="0" step="any" value={item.price} onChange={(value) => updateItem(index, 'price', value)} required /></div></div>)}</div><h3 className="font-semibold mb-2">Order totals</h3><div className="grid sm:grid-cols-2 gap-3 mb-5"><Field label="Subtotal" type="number" min="0" step="any" value={form.subtotal} onChange={(value) => updateField('totals', 'subtotal', value)} required /><Field label="Total price" type="number" min="0" step="any" value={form.totalAmount} onChange={(value) => updateField('totals', 'totalAmount', value)} required /></div><div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 border rounded-lg">Cancel</button><button disabled={saving} className="px-4 py-2 bg-[#5C3A21] text-white rounded-lg disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button></div></form></div>;
const Field = ({ label, type = 'text', value, onChange, ...props }) => <label className="block text-sm text-gray-700">{label}<input type={type} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className="mt-1 block w-full border rounded-lg px-3 py-2" {...props} /></label>;

export default AdminOrders;
