import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
 
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/', label: 'Back to Store', icon: '🏠' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:grid lg:grid-cols-[256px_1fr]">
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#5C3A21] text-white w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:row-span-2 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
<div className='h-20'></div>
        <nav className="flex-1 h-[65vh]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-6 py-3 transition-all duration-200 hover:bg-white/10 hover:pl-7 ${
                isActive(item.path) ? 'bg-white/20 border-r-4 border-white' : ''
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-[#5C3A21] lg:relative lg:mt-auto">
          <div className="text-sm text-white/70 mb-4">
            <p className="font-medium text-white">{user?.name || user?.email || 'Admin User'}</p>
            <p className="text-xs">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="min-h-screen overflow-auto">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-bold text-[#5C3A21] text-lg">Admin Panel</h1>
          <div className="w-10" />
        </header>

        {/* Desktop header */}
        <div className="hidden lg:block bg-white shadow-sm px-8 py-4 sticky top-0 z-20">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
          </h1>
        </div>

        {/* Page content */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;