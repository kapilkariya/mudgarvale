import React, { useEffect, useMemo, useState } from 'react';
import { adminAPI } from '../config/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [filteredDateOrders, setFilteredDateOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreOrders, setHasMoreOrders] = useState(false);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [allOrdersLoaded, setAllOrdersLoaded] = useState(false);
  
  // Date Range States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [dateFilteredOrders, setDateFilteredOrders] = useState([]);

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

  const loadOrders = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError('');
      
      const response = await adminAPI.getOrdersPaginated(page, 20);
      if (response.success) {
        if (append) {
          setOrders(prev => [...prev, ...response.data]);
        } else {
          setOrders(response.data);
        }
        setCurrentPage(response.page);
        setHasMoreOrders(response.hasMore);
        setTotalOrdersCount(response.total);
        setAllOrdersLoaded(!response.hasMore);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch ALL orders for export (including cancelled)
  const fetchAllOrdersForExport = async () => {
    try {
      setLoadingExport(true);
      setError('');
      const response = await adminAPI.getAllOrders();
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (err) {
      setError(err.message || 'Failed to fetch orders for export');
      return [];
    } finally {
      setLoadingExport(false);
    }
  };

  const loadMoreOrders = () => {
    if (hasMoreOrders && !loadingMore && !isDateFilterActive) {
      loadOrders(currentPage + 1, true);
    }
  };

  useEffect(() => {
    loadOrders(1, false);
  }, []);

  // Auto-filter when dates change
  useEffect(() => {
    if (dateFrom && dateTo) {
      filterOrdersByDate();
    } else if (!dateFrom && !dateTo) {
      setIsDateFilterActive(false);
      setDateFilteredOrders([]);
      setFilteredDateOrders([]);
    }
  }, [dateFrom, dateTo]);

  const filterOrdersByDate = async () => {
    if (!dateFrom || !dateTo) {
      setIsDateFilterActive(false);
      setDateFilteredOrders([]);
      setFilteredDateOrders([]);
      return;
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999);
    fromDate.setHours(0, 0, 0, 0);

    const allOrders = await fetchAllOrdersForExport();
    
    const filtered = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
      const fromDateOnly = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
      const toDateOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
      
      return orderDateOnly >= fromDateOnly && orderDateOnly <= toDateOnly;
    });

    setDateFilteredOrders(filtered);
    setFilteredDateOrders(filtered);
    setIsDateFilterActive(true);
    
    if (filtered.length > 0) {
      setSuccess(`Found ${filtered.length} orders between ${new Date(dateFrom).toLocaleDateString('en-IN')} and ${new Date(dateTo).toLocaleDateString('en-IN')}`);
    } else {
      setSuccess(`No orders found between ${new Date(dateFrom).toLocaleDateString('en-IN')} and ${new Date(dateTo).toLocaleDateString('en-IN')}`);
    }
  };

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
    setIsDateFilterActive(false);
    setDateFilteredOrders([]);
    setFilteredDateOrders([]);
    setSuccess('');
  };

  // Get the orders to display (filtered by date if active, else paginated orders)
  const displayOrders = isDateFilterActive ? filteredDateOrders : orders;

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'pending_delivery') return displayOrders.filter((order) => !['delivered', 'cancelled'].includes(order.orderStatus));
    if (activeFilter === 'delivered' || activeFilter === 'cancelled') return displayOrders.filter((order) => order.orderStatus === activeFilter);
    return displayOrders;
  }, [activeFilter, displayOrders]);

  const updateOrderInList = (updated) => {
    setOrders((current) => current.map((order) => order._id === updated._id ? { ...updated, user: updated.user || updated.userId || order.user } : order));
    setFilteredDateOrders((current) => current.map((order) => order._id === updated._id ? { ...updated, user: updated.user || updated.userId || order.user } : order));
    setDateFilteredOrders((current) => current.map((order) => order._id === updated._id ? { ...updated, user: updated.user || updated.userId || order.user } : order));
  };

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

  // Prepare data for export
  const prepareExportData = (ordersToExport) => {
    return ordersToExport.map((order) => {
      const itemsList = order.items?.map(item => 
        `${item.name}${item.category !== 'senaboard' ? ` (${item.selectedWeight}kg)` : ''} × ${item.quantity}`
      ).join('; ') || '';

      const totalWeight = order.items?.reduce((sum, item) => {
        let itemWeight = 0;
        if (item.category === 'senaboard') {
          itemWeight = 2 * item.quantity;
        } else {
          itemWeight = parseFloat(item.selectedWeight) * item.quantity;
        }
        return sum + itemWeight;
      }, 0) || 0;

      let amountPaid = 0;
      let amountPending = 0;
      
      if (order.paymentMethod === 'online') {
        amountPaid = order.totalAmount || 0;
        amountPending = 0;
      } else if (order.paymentMethod === 'cod') {
        if (order.paymentStatus === 'paid') {
          amountPaid = order.totalAmount || 0;
          amountPending = 0;
        } else if (order.paymentStatus === 'partial_paid') {
          amountPaid = order.paidAmount || 0;
          amountPending = (order.totalAmount || 0) - (order.paidAmount || 0);
        } else {
          amountPaid = 0;
          amountPending = order.totalAmount || 0;
        }
      }

      return {
        'Order Number': order.orderNumber || '',
        'Customer Name': order.user?.name || order.address?.name || '',
        'Customer Email': order.user?.email || order.address?.email || '',
        'Address': order.address?.address || '',
        'City': order.address?.city || '',
        'State': order.address?.state || '',
        'Pincode': order.address?.pincode || '',
        'Items': itemsList,
        'Phone': order.address?.phone || '',
        'Total Weight (kg)': totalWeight.toFixed(2),
        'Total Amount': order.totalAmount || 0,
        'Amount Paid': amountPaid,
        'Amount Pending': amountPending,
        'Payment Method': order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery',
        'Payment Status': order.paymentStatus || '',
        'Order Status': order.orderStatus || '',
        'Created Date': order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '',
      };
    });
  };

  // Export to Excel
  const exportToExcel = async () => {
    try {
      let ordersToExport;
      
      if (isDateFilterActive) {
        // If date filter is active, use filtered orders
        ordersToExport = filteredDateOrders;
      } else {
        // If no date filter, fetch ALL orders
        ordersToExport = await fetchAllOrdersForExport();
      }
      
      if (!ordersToExport || !ordersToExport.length) {
        setError('No orders to export');
        return;
      }
      
      const rows = prepareExportData(ordersToExport);
      const workbook = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      
      const colWidths = [
        { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 12 }, { wch: 40 }, { wch: 15 }, { wch: 16 },
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 18 },
        { wch: 18 }, { wch: 15 }
      ];
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, ws, 'Orders');
      const dateSuffix = isDateFilterActive ? `_${dateFrom}_to_${dateTo}` : '';
      XLSX.writeFile(workbook, `Orders_Export${dateSuffix}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      setSuccess(`Exported ${ordersToExport.length} orders to Excel`);
      setShowDownloadMenu(false);
    } catch (err) {
      setError(err.message || 'Failed to export to Excel');
    }
  };

  // Export to CSV
  const exportToCSV = async () => {
    try {
      let ordersToExport;
      
      if (isDateFilterActive) {
        ordersToExport = filteredDateOrders;
      } else {
        ordersToExport = await fetchAllOrdersForExport();
      }
      
      if (!ordersToExport || !ordersToExport.length) {
        setError('No orders to export');
        return;
      }
      
      const rows = prepareExportData(ordersToExport);
      const headers = Object.keys(rows[0]);
      const csvRows = [];
      
      csvRows.push(headers.join(','));
      
      for (const row of rows) {
        const values = headers.map(header => {
          const val = row[header] || '';
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const dateSuffix = isDateFilterActive ? `_${dateFrom}_to_${dateTo}` : '';
      link.download = `Orders_Export${dateSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      setSuccess(`Exported ${ordersToExport.length} orders to CSV`);
      setShowDownloadMenu(false);
    } catch (err) {
      setError(err.message || 'Failed to export to CSV');
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    try {
      let ordersToExport;
      
      if (isDateFilterActive) {
        ordersToExport = filteredDateOrders;
      } else {
        ordersToExport = await fetchAllOrdersForExport();
      }
      
      if (!ordersToExport || !ordersToExport.length) {
        setError('No orders to export');
        return;
      }
      
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const rows = prepareExportData(ordersToExport);
      
      const tableHeaders = Object.keys(rows[0]);
      const tableRows = rows.map(row => tableHeaders.map(header => row[header] || ''));
      
      doc.setFontSize(16);
      doc.text('Orders Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 22);
      doc.text(`Total Orders: ${ordersToExport.length}`, 14, 28);
      if (isDateFilterActive) {
        doc.text(`Date Range: ${new Date(dateFrom).toLocaleDateString('en-IN')} to ${new Date(dateTo).toLocaleDateString('en-IN')}`, 14, 34);
      }
      
      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        startY: isDateFilterActive ? 40 : 35,
        theme: 'grid',
        styles: { fontSize: 6, cellPadding: 1.5 },
        headStyles: { fillColor: [92, 58, 33], textColor: [255, 255, 255], fontSize: 6, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 22 },
          2: { cellWidth: 28 },
          7: { cellWidth: 38 },
        },
        didDrawPage: function(data) {
          doc.setFontSize(8);
          doc.text('MudgarVale - Orders Report', 14, data.settings.margin.bottom + 10);
        }
      });
      
      const dateSuffix = isDateFilterActive ? `_${dateFrom}_to_${dateTo}` : '';
      doc.save(`Orders_Export${dateSuffix}_${new Date().toISOString().slice(0, 10)}.pdf`);
      setSuccess(`Exported ${ordersToExport.length} orders to PDF`);
      setShowDownloadMenu(false);
    } catch (err) {
      setError(err.message || 'Failed to export to PDF');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]" /></div>;

  return <div className="px-4 pb-8">
    <div className="h-20" />
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div><h1 className="text-2xl font-bold text-gray-900">Orders</h1><p className="text-gray-600 text-sm mt-1">Manage customer orders and update their status</p></div>
      
      {/* Download Dropdown - Always enabled */}
      <div className="relative">
        <button
          onClick={() => {
            setShowDownloadMenu(!showDownloadMenu);
          }}
          disabled={loadingExport}
          className={`px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 ${
            !loadingExport
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          <span>⬇ Download</span>
          <span className="text-xs">▾</span>
          {loadingExport && <span className="ml-2">Loading...</span>}
          {isDateFilterActive && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">({filteredDateOrders.length})</span>}
          {!isDateFilterActive && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">(All)</span>}
        </button>
        
        {showDownloadMenu && !loadingExport && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button
              onClick={exportToExcel}
              className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-sm border-b border-gray-100"
            >
              <span className="text-lg mr-2">📊</span> Excel (.xlsx)
            </button>
            <button
              onClick={exportToCSV}
              className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-sm border-b border-gray-100"
            >
              <span className="text-lg mr-2">📄</span> CSV (.csv)
            </button>
            <button
              onClick={exportToPDF}
              className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
            >
              <span className="text-lg mr-2">📕</span> PDF (.pdf)
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Date Range Filter - Auto-filter on date change */}
    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={clearDateFilter}
            className="px-4 py-2 text-red-600 hover:text-red-800 transition font-medium"
          >
            ✕ Clear Dates
          </button>
        )}
        {isDateFilterActive && (
          <span className="text-sm text-gray-600 ml-2">
            Showing <span className="font-bold text-[#5C3A21]">{filteredDateOrders.length}</span> orders
            {dateFrom && dateTo && ` from ${new Date(dateFrom).toLocaleDateString('en-IN')} to ${new Date(dateTo).toLocaleDateString('en-IN')}`}
          </span>
        )}
        {!isDateFilterActive && totalOrdersCount > 0 && (
          <span className="text-sm text-gray-600 ml-2">
            Showing <span className="font-bold text-[#5C3A21]">{orders.length}</span> of <span className="font-bold">{totalOrdersCount}</span> orders
          </span>
        )}
      </div>
    </div>

    {error && <Notice tone="red" message={error} dismiss={() => setError('')} />}
    {success && <Notice tone="green" message={success} dismiss={() => setSuccess('')} />}
    
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {filterOptions.map((filter) => {
          const count = filter.value === 'all' 
            ? displayOrders.length 
            : filter.value === 'pending_delivery'
              ? displayOrders.filter((order) => !['delivered', 'cancelled'].includes(order.orderStatus)).length
              : displayOrders.filter((order) => order.orderStatus === filter.value).length;
          
          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeFilter === filter.value ? 'bg-[#5C3A21] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {filter.label} ({count})
            </button>
          );
        })}
      </div>
    </div>
    
    <div className="space-y-4">
      {filteredOrders.map((order) => <OrderCard key={order._id} order={order} expanded={expandedOrder === order._id} toggle={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} openEdit={() => openEdit(order)} status={getStatus(order.orderStatus)} statusOptions={statusOptions} updating={updatingId === order._id} onStatusChange={handleStatusChange} formatDate={formatDate} formatPrice={formatPrice} />)}
      {!filteredOrders.length && <div className="text-center py-12 bg-white rounded-xl text-gray-500">
        {isDateFilterActive ? 'No orders found in this date range.' : allOrdersLoaded ? 'No orders found.' : 'Loading orders...'}
      </div>}
    </div>

    {/* Load More Button - Only when no date filter */}
    {!isDateFilterActive && hasMoreOrders && (
      <div className="mt-6 text-center">
        <button
          onClick={loadMoreOrders}
          disabled={loadingMore}
          className="px-6 py-3 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50"
        >
          {loadingMore ? 'Loading...' : 'Load More Orders'}
        </button>
      </div>
    )}

    {/* All loaded message */}
    {!isDateFilterActive && allOrdersLoaded && orders.length > 0 && (
      <p className="mt-6 text-center text-sm text-gray-500">
        All {totalOrdersCount} orders loaded
      </p>
    )}

    {editingOrder && form && <EditOrderModal form={form} onClose={() => { if (!updatingId) { setEditingOrder(null); setForm(null); } }} onSubmit={submitEdit} updateField={updateField} updateItem={updateItem} error={formError} saving={updatingId === editingOrder._id} />}
  </div>;
};

const Notice = ({ tone, message, dismiss }) => <div className={`mb-4 p-3 bg-${tone}-100 text-${tone}-800 rounded-lg text-sm`}>{message}<button onClick={dismiss} className="ml-4 underline">Dismiss</button></div>;

const OrderCard = ({ order, expanded, toggle, openEdit, status, statusOptions, updating, onStatusChange, formatDate, formatPrice }) => {
  const subtotal = order.totalAmount - (order.deliveryCharge || 0);
  const deliveryCharge = order.deliveryCharge || 0;
  
  let amountPaid = 0;
  let amountPending = 0;
  let paymentMethodLabel = '';
  let paymentStatusLabel = '';
  let paymentStatusColor = '';
  
  if (order.paymentMethod === 'online') {
    amountPaid = order.totalAmount || 0;
    amountPending = 0;
    paymentMethodLabel = '💳 Online Payment';
    paymentStatusLabel = 'Fully Paid';
    paymentStatusColor = 'text-green-600';
  } else if (order.paymentMethod === 'cod') {
    paymentMethodLabel = '💰 Cash on Delivery';
    if (order.paymentStatus === 'paid') {
      amountPaid = order.totalAmount || 0;
      amountPending = 0;
      paymentStatusLabel = 'Paid';
      paymentStatusColor = 'text-green-600';
    } else if (order.paymentStatus === 'partial_paid') {
      amountPaid = order.paidAmount || 0;
      amountPending = (order.totalAmount || 0) - (order.paidAmount || 0);
      paymentStatusLabel = 'Advance Paid';
      paymentStatusColor = 'text-blue-600';
    } else {
      amountPaid = 0;
      amountPending = order.totalAmount || 0;
      paymentStatusLabel = 'Pending';
      paymentStatusColor = 'text-yellow-600';
    }
  }

  return <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 cursor-pointer active:bg-gray-50" onClick={toggle}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold text-[#5C3A21] text-sm">#{order.orderNumber}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
            <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
          </div>
        </div>
        <span className="text-gray-400">{expanded ? '⌃' : '⌄'}</span>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-600">{order.user?.name || order.address?.name || 'N/A'}</p>
          <p className="text-xs text-gray-500">{order.user?.email || order.address?.email}</p>
        </div>
        <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
      </div>
    </div>
    {expanded && <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
      <section className="text-sm space-y-1">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer & Shipping</h4>
        <p><span className="text-gray-600">Phone:</span> {order.address?.phone}</p>
        <p><span className="text-gray-600">Address:</span> {[order.address?.buildingFlatNo, order.address?.address, order.address?.city, order.address?.state, order.address?.pincode].filter(Boolean).join(', ')}</p>
      </section>
      <section>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>
        {order.items?.map((item) => <div key={item._id || item.productId} className="bg-white rounded-lg p-2 text-sm mb-2">
          <p className="font-medium">{item.name}</p>
          <p className="text-gray-600 text-xs">{item.selectedWeight} kg × {item.quantity} · {formatPrice(item.price)} each</p>
        </div>)}
      </section>
      
      <section className="text-sm border-t pt-2">
        <p className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Delivery Charge</span>
          <span>{formatPrice(deliveryCharge)}</span>
        </p>
        <p className="flex justify-between font-bold text-base border-t pt-1 mt-1">
          <span className="text-gray-600">Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </p>
      </section>

      <section className="border-t pt-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment Details</h4>
        <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">{paymentMethodLabel}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Payment Status</span>
            <span className={`font-medium ${paymentStatusColor}`}>{paymentStatusLabel}</span>
          </p>
          {amountPaid > 0 && (
            <p className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-medium text-green-600">{formatPrice(amountPaid)}</span>
            </p>
          )}
          {amountPending > 0 && (
            <p className="flex justify-between">
              <span className="text-gray-600">Amount Pending</span>
              <span className="font-medium text-orange-600">{formatPrice(amountPending)}</span>
            </p>
          )}
          {order.paymentMethod === 'online' && (
            <p className="text-xs text-green-600 mt-1">✅ Fully paid online</p>
          )}
          {order.paymentMethod === 'cod' && order.paymentStatus === 'pending' && (
            <p className="text-xs text-orange-600 mt-1">⚠️ Payment pending on delivery</p>
          )}
          {order.paymentMethod === 'cod' && order.paymentStatus === 'partial_paid' && (
            <p className="text-xs text-blue-600 mt-1">ℹ️ Advance payment received, balance pending</p>
          )}
          {order.paymentMethod === 'cod' && order.paymentStatus === 'paid' && (
            <p className="text-xs text-green-600 mt-1">✅ Fully paid</p>
          )}
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={(event) => { event.stopPropagation(); openEdit(); }} className="px-3 py-2 text-sm bg-[#5C3A21] text-white rounded-lg">Edit order</button>
        <select value={order.orderStatus} onClick={(event) => event.stopPropagation()} onChange={(event) => onStatusChange(order._id, event.target.value)} disabled={updating} className="flex-1 text-sm border rounded-lg px-3 py-2 bg-white">
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
    </div>}
  </div>;
};

const EditOrderModal = ({ form, onClose, onSubmit, updateField, updateItem, error, saving }) => <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4">
  <form onSubmit={onSubmit} className="my-6 mx-auto max-w-3xl bg-white rounded-xl shadow-xl p-5">
    <div className="flex justify-between gap-4 mb-5">
      <h2 className="text-xl font-bold">Edit order</h2>
      <button type="button" onClick={onClose} disabled={saving} className="text-gray-500">Close</button>
    </div>
    {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">{error}</div>}
    <h3 className="font-semibold mb-2">Customer information</h3>
    <div className="grid sm:grid-cols-3 gap-3 mb-5">
      <Field label="Customer name" value={form.customer.name} onChange={(value) => updateField('customer', 'name', value)} required />
      <Field label="Email (fixed)" type="email" value={form.customer.email} readOnly />
      <Field label="Phone number" value={form.customer.phone} onChange={(value) => updateField('customer', 'phone', value)} required />
    </div>
    <h3 className="font-semibold mb-2">Shipping address</h3>
    <div className="grid sm:grid-cols-2 gap-3 mb-5">
      <Field label="Building / Flat" value={form.address.buildingFlatNo} onChange={(value) => updateField('address', 'buildingFlatNo', value)} />
      <Field label="Street address" value={form.address.address} onChange={(value) => updateField('address', 'address', value)} required />
      <Field label="City" value={form.address.city} onChange={(value) => updateField('address', 'city', value)} required />
      <Field label="State" value={form.address.state} onChange={(value) => updateField('address', 'state', value)} required />
      <Field label="Pincode" value={form.address.pincode} onChange={(value) => updateField('address', 'pincode', value)} required />
    </div>
    <h3 className="font-semibold mb-2">Products</h3>
    <div className="space-y-3 mb-5">
      {form.items.map((item, index) => <div key={item._id || item.productId || index} className="border rounded-lg p-3">
        <p className="font-medium mb-2">{item.name}</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Weight (kg)" type="number" min="0" step="any" value={item.selectedWeight} onChange={(value) => updateItem(index, 'selectedWeight', value)} required />
          <Field label="Quantity" type="number" min="1" step="1" value={item.quantity} onChange={(value) => updateItem(index, 'quantity', value)} required />
          <Field label="Unit price" type="number" min="0" step="any" value={item.price} onChange={(value) => updateItem(index, 'price', value)} required />
        </div>
      </div>)}
    </div>
    <h3 className="font-semibold mb-2">Order totals</h3>
    <div className="grid sm:grid-cols-2 gap-3 mb-5">
      <Field label="Subtotal" type="number" min="0" step="any" value={form.subtotal} onChange={(value) => updateField('totals', 'subtotal', value)} required />
      <Field label="Total price" type="number" min="0" step="any" value={form.totalAmount} onChange={(value) => updateField('totals', 'totalAmount', value)} required />
    </div>
    <div className="flex justify-end gap-3">
      <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 border rounded-lg">Cancel</button>
      <button disabled={saving} className="px-4 py-2 bg-[#5C3A21] text-white rounded-lg disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
    </div>
  </form>
</div>;

const Field = ({ label, type = 'text', value, onChange, ...props }) => <label className="block text-sm text-gray-700">{label}<input type={type} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className="mt-1 block w-full border rounded-lg px-3 py-2" {...props} /></label>;

export default AdminOrders;