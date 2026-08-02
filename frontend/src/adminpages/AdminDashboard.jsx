import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, orderAPI } from '../config/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [periodStats, setPeriodStats] = useState({
    today: { 
      orders: 0, 
      sales: 0, 
      onlineAmount: 0, 
      codAmount: 0 
    },
    monthly: { 
      orders: 0, 
      sales: 0, 
      onlineAmount: 0, 
      codAmount: 0 
    },
    annual: { 
      orders: 0, 
      sales: 0, 
      onlineAmount: 0, 
      codAmount: 0 
    },
    lifetime: { 
      orders: 0, 
      sales: 0, 
      onlineAmount: 0, 
      codAmount: 0 
    },
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [graphView, setGraphView] = useState('monthly');

  useEffect(() => {
    fetchStats();
    fetchAllData();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const productsRes = await adminAPI.getAllProducts();
      const totalProducts = productsRes.success ? productsRes.count || productsRes.data?.length || 0 : 0;

      const ordersRes = await adminAPI.getOrderStats();
      const orderStats = ordersRes.success ? ordersRes.data : {};
      
      setStats({
        totalProducts,
        totalOrders: orderStats.totalOrders || 0,
        pendingOrders: orderStats.pendingOrders || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      if (response.success) {
        const orders = response.data || [];
        calculatePeriodStats(orders);
        processMonthlyData(orders);
        processYearlyData(orders);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const calculatePeriodStats = (orders) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayStart = new Date(today);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= todayStart && orderDate <= now && order.orderStatus !== 'cancelled';
    });

    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= monthStart && orderDate <= now && order.orderStatus !== 'cancelled';
    });

    const annualOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= yearStart && orderDate <= now && order.orderStatus !== 'cancelled';
    });

    const lifetimeOrders = orders.filter(order => order.orderStatus !== 'cancelled');

    const calculateMetrics = (ordersList) => {
      const totalSales = ordersList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const onlineAmount = ordersList
        .filter(order => order.paymentMethod === 'online')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const codAmount = ordersList
        .filter(order => order.paymentMethod === 'cod')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      return {
        orders: ordersList.length,
        sales: totalSales,
        onlineAmount: onlineAmount,
        codAmount: codAmount,
      };
    };

    setPeriodStats({
      today: calculateMetrics(todayOrders),
      monthly: calculateMetrics(monthlyOrders),
      annual: calculateMetrics(annualOrders),
      lifetime: calculateMetrics(lifetimeOrders),
    });
  };

  const processMonthlyData = (orders) => {
    const monthMap = {};
    const years = new Set();

    orders.forEach(order => {
      if (order.orderStatus === 'cancelled') return;
      
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();
      const amount = order.totalAmount || 0;
      const paymentMethod = order.paymentMethod || 'cod';

      years.add(year);
      const key = `${year}-${month}`;
      
      if (!monthMap[key]) {
        monthMap[key] = {
          year,
          month,
          monthName: new Date(year, month).toLocaleString('default', { month: 'short' }),
          displayName: `${new Date(year, month).toLocaleString('default', { month: 'short' })} ${year}`,
          total: 0,
          count: 0,
          onlineAmount: 0,
          codAmount: 0,
        };
      }
      monthMap[key].total += amount;
      monthMap[key].count += 1;
      
      if (paymentMethod === 'online') {
        monthMap[key].onlineAmount += amount;
      } else {
        monthMap[key].codAmount += amount;
      }
    });

    const sortedData = Object.values(monthMap).sort((a, b) => a.year - b.year || a.month - b.month);
    setMonthlyData(sortedData);
    setAvailableYears(Array.from(years).sort());
    
    if (years.size > 0) {
      setSelectedYear(Math.max(...years));
    }
  };

  const processYearlyData = (orders) => {
    const yearMap = {};

    orders.forEach(order => {
      if (order.orderStatus === 'cancelled') return;
      
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      const amount = order.totalAmount || 0;
      const paymentMethod = order.paymentMethod || 'cod';

      if (!yearMap[year]) {
        yearMap[year] = {
          year,
          total: 0,
          count: 0,
          onlineAmount: 0,
          codAmount: 0,
        };
      }
      yearMap[year].total += amount;
      yearMap[year].count += 1;
      
      if (paymentMethod === 'online') {
        yearMap[year].onlineAmount += amount;
      } else {
        yearMap[year].codAmount += amount;
      }
    });

    const sortedData = Object.values(yearMap).sort((a, b) => a.year - b.year);
    setYearlyData(sortedData);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price || 0);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛒',
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
  ];

  // Calculate totals
  const totalEarnings = yearlyData.reduce((sum, y) => sum + y.total, 0);
  const totalOrders = yearlyData.reduce((sum, y) => sum + y.count, 0);

  // Get current month data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthData = monthlyData.find(d => d.year === currentYear && d.month === currentMonth);
  const currentMonthEarnings = currentMonthData?.total || 0;
  const currentMonthOrders = currentMonthData?.count || 0;

  // Get current year data
  const currentYearData = yearlyData.find(d => d.year === currentYear);
  const currentYearEarnings = currentYearData?.total || 0;
  const currentYearOrders = currentYearData?.count || 0;

  // Get selected year monthly data for the table
  const selectedYearMonthlyData = monthlyData.filter(d => d.year === selectedYear);
  const selectedYearTotal = selectedYearMonthlyData.reduce((sum, d) => sum + d.total, 0);
  const selectedYearOrders = selectedYearMonthlyData.reduce((sum, d) => sum + d.count, 0);

  const periodCards = [
    {
      title: 'Today',
      icon: '📅',
      color: 'bg-purple-500',
      orders: periodStats.today.orders,
      sales: periodStats.today.sales,
      onlineAmount: periodStats.today.onlineAmount,
      codAmount: periodStats.today.codAmount,
    },
    {
      title: 'This Month',
      icon: '📊',
      color: 'bg-indigo-500',
      orders: currentMonthOrders,
      sales: currentMonthEarnings,
      onlineAmount: periodStats.monthly.onlineAmount,
      codAmount: periodStats.monthly.codAmount,
    },
    {
      title: 'This Year',
      icon: '📈',
      color: 'bg-red-500',
      orders: currentYearOrders,
      sales: currentYearEarnings,
      onlineAmount: periodStats.annual.onlineAmount,
      codAmount: periodStats.annual.codAmount,
    },
    {
      title: 'Lifetime',
      icon: '🏆',
      color: 'bg-[#5C3A21]',
      orders: periodStats.lifetime.orders,
      sales: periodStats.lifetime.sales,
      onlineAmount: periodStats.lifetime.onlineAmount,
      codAmount: periodStats.lifetime.codAmount,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8">
      <div className='h-20'></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome to your admin panel</p>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center">
              <div className={`${card.color} text-white rounded-lg p-3 text-2xl mr-4`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Overview with Lifetime */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {periodCards.map((period) => (
            <div
              key={period.title}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center mb-4">
                <div className={`${period.color} text-white rounded-lg p-3 text-2xl mr-4`}>
                  {period.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{period.title}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Orders</span>
                  <span className="text-xl font-bold text-gray-900">{period.orders}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm text-gray-600">💳 Online</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatPrice(period.onlineAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">💰 COD</span>
                  <span className="text-lg font-semibold text-orange-600">
                    {formatPrice(period.codAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm text-gray-600">Total Sales</span>
                  <span className="text-xl font-bold text-[#5C3A21]">
                    {formatPrice(period.sales)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graph Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-gray-900">📈 Earnings Overview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setGraphView('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                graphView === 'monthly'
                  ? 'bg-[#5C3A21] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setGraphView('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                graphView === 'yearly'
                  ? 'bg-[#5C3A21] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Year Selector for Monthly View */}
          {graphView === 'monthly' && availableYears.length > 0 && (
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Select Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none bg-white"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg">
                <div>
                  <span className="text-xs text-gray-500">Total {selectedYear} Earnings</span>
                  <p className="text-lg font-bold text-[#5C3A21]">{formatPrice(selectedYearTotal)}</p>
                </div>
                <div className="border-l pl-4">
                  <span className="text-xs text-gray-500">Total Orders</span>
                  <p className="text-lg font-bold text-gray-900">{selectedYearOrders}</p>
                </div>
              </div>
            </div>
          )}

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {graphView === 'monthly' ? (
                <LineChart data={monthlyData.filter(d => d.year === selectedYear)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="monthName" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value/1000}k`}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value) => formatPrice(value)}
                    labelFormatter={(label) => `${label} ${selectedYear}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="linear" 
                    dataKey="total" 
                    stroke="#5C3A21" 
                    strokeWidth={3}
                    dot={{ stroke: '#5C3A21', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ r: 6, fill: '#5C3A21' }}
                    name="Earnings"
                  />
                </LineChart>
              ) : (
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value/1000}k`}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value) => formatPrice(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="linear" 
                    dataKey="total" 
                    stroke="#5C3A21" 
                    strokeWidth={3}
                    dot={{ stroke: '#5C3A21', strokeWidth: 2, r: 5, fill: 'white' }}
                    activeDot={{ r: 7, fill: '#5C3A21' }}
                    name="Yearly Earnings"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Monthly Sales Table - Only for Monthly View */}
          {graphView === 'monthly' && selectedYearMonthlyData.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                📋 Monthly Sales for {selectedYear}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Online</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">COD</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedYearMonthlyData.map((month, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month.monthName}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          {month.count}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600 font-semibold text-right">
                          {formatPrice(month.onlineAmount)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-orange-600 font-semibold text-right">
                          {formatPrice(month.codAmount)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-[#5C3A21] text-right">
                          {formatPrice(month.total)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-right">
                          {month.count > 0 ? formatPrice(month.total / month.count) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 font-bold">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Total</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {selectedYearMonthlyData.reduce((sum, m) => sum + m.count, 0)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600 text-right">
                        {formatPrice(selectedYearMonthlyData.reduce((sum, m) => sum + m.onlineAmount, 0))}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-orange-600 text-right">
                        {formatPrice(selectedYearMonthlyData.reduce((sum, m) => sum + m.codAmount, 0))}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-[#5C3A21] text-right">
                        {formatPrice(selectedYearMonthlyData.reduce((sum, m) => sum + m.total, 0))}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatPrice(
                          selectedYearMonthlyData.reduce((sum, m) => sum + m.total, 0) / 
                          selectedYearMonthlyData.reduce((sum, m) => sum + m.count, 0) || 0
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Yearly Data Cards (for reference) */}
      {yearlyData.length > 1 && graphView === 'yearly' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {yearlyData.map((year) => (
            <div 
              key={year.year} 
              className={`bg-white rounded-xl shadow-sm p-4 text-center cursor-pointer hover:shadow-md transition ${
                year.year === selectedYear ? 'border-2 border-[#5C3A21]' : ''
              }`}
              onClick={() => {
                setSelectedYear(year.year);
                setGraphView('monthly');
              }}
            >
              <p className="text-sm font-semibold text-gray-600">{year.year}</p>
              <p className="text-lg font-bold text-[#5C3A21]">{formatPrice(year.total)}</p>
              <p className="text-xs text-gray-500">{year.count} orders</p>
              <p className="text-xs text-green-600">Online: {formatPrice(year.onlineAmount)}</p>
              <p className="text-xs text-orange-600">COD: {formatPrice(year.codAmount)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">📦</span>
            <div>
              <p className="font-medium text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-500">View, edit, and delete products</p>
            </div>
          </Link>
          
          <Link
            to="/admin/products/add"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">➕</span>
            <div>
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-500">Create a new product listing</p>
            </div>
          </Link>
          
          <Link
            to="/admin/orders"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">🛒</span>
            <div>
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Manage customer orders</p>
            </div>
          </Link>
          
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#5C3A21] hover:bg-[#5C3A21]/5 transition"
          >
            <span className="text-2xl mr-3">🏪</span>
            <div>
              <p className="font-medium text-gray-900">View Store</p>
              <p className="text-sm text-gray-500">Open store in new tab</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;