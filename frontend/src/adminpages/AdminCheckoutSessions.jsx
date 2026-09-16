import React, { useEffect, useState } from 'react';
import { fetchWithAuth, API_URL } from '../config/api';

const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const PAGE_SIZE = 15;

const AdminCheckoutSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // Date filter
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);

  const buildUrl = (page, from, to) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    return `${API_URL}/admin/checkout-sessions?${params.toString()}`;
  };

  const loadSessions = async (page = 1, append = false, from = dateFrom, to = dateTo) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError('');

      const res = await fetchWithAuth(buildUrl(page, from, to));

      if (!res.success) {
        throw new Error(res.message || 'Failed to load sessions');
      }

      if (append) {
        setSessions((prev) => [...prev, ...(res.data || [])]);
      } else {
        setSessions(res.data || []);
      }
      setCurrentPage(res.page || page);
      setHasMore(!!res.hasMore);
      setTotal(res.total || 0);
      setAllLoaded(!res.hasMore);
    } catch (err) {
      setError(err.message || 'Failed to load checkout sessions');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Auto-apply filter only when BOTH dates are picked
  useEffect(() => {
    if (dateFrom && dateTo) {
      setIsDateFilterActive(true);
      setExpanded(null);
      loadSessions(1, false, dateFrom, dateTo);
    } else if (!dateFrom && !dateTo) {
      setIsDateFilterActive(false);
      setExpanded(null);
      loadSessions(1, false, '', '');
    } else {
      setIsDateFilterActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo]);

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      loadSessions(currentPage + 1, true, dateFrom, dateTo);
    }
  };

  const refresh = () => {
    setExpanded(null);
    loadSessions(1, false, dateFrom, dateTo);
  };

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  const filtered = sessions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const a = s.address || {};
    const u = s.user || {};
    return (
      (a.name || u.name || '').toLowerCase().includes(q) ||
      (a.phone || '').toLowerCase().includes(q) ||
      (a.email || u.email || '').toLowerCase().includes(q) ||
      (a.city || '').toLowerCase().includes(q)
    );
  });

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]" />
      </div>
    );
  }

  return (
    <div className="px-4 pb-8">
      <div className="h-20" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout Sessions</h1>
          <p className="text-gray-600 text-sm mt-1">
            Users who have an address saved and are on the checkout page
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search loaded sessions…"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none w-64"
          />
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Date range filter (updatedAt) */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Updated From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Updated To
            </label>
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
              Showing <span className="font-bold text-[#5C3A21]">{total}</span>{' '}
              session(s) updated from{' '}
              {new Date(dateFrom).toLocaleDateString('en-IN')} to{' '}
              {new Date(dateTo).toLocaleDateString('en-IN')}
            </span>
          )}
          {((dateFrom && !dateTo) || (!dateFrom && dateTo)) && (
            <span className="text-sm text-amber-700 ml-2">
              ⚠️ Pick both From and To dates to filter.
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs text-gray-500 uppercase">Total Sessions</p>
          <p className="text-2xl font-bold text-[#5C3A21]">{total}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Loaded</p>
          <p className="text-2xl font-bold text-[#5C3A21]">{sessions.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Value (loaded)</p>
          <p className="text-2xl font-bold text-[#5C3A21]">
            {formatPrice(sessions.reduce((sum, s) => sum + (s.totalAmount || 0), 0))}
          </p>
        </div>
        {search && (
          <div>
            <p className="text-xs text-gray-500 uppercase">Matching</p>
            <p className="text-2xl font-bold text-[#5C3A21]">{filtered.length}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-4 underline">
            Dismiss
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl text-gray-500">
          {sessions.length === 0
            ? isDateFilterActive
              ? 'No sessions found in this date range.'
              : 'No active checkout sessions.'
            : 'No sessions match your search.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const a = s.address || {};
            const u = s.user || {};
            const isOpen = expanded === s._id;
            const items = s.items || [];

            return (
              <div
                key={s._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(isOpen ? null : s._id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {a.name || u.name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.email || u.email || '—'}
                      </p>
                    </div>
                    <span className="text-gray-400">{isOpen ? '⌃' : '⌄'}</span>
                  </div>

                  <div className="flex justify-between text-sm mt-1">
                    <div className="text-gray-600">
                      📞 {a.phone || '—'}
                      {a.city ? ` · ${a.city}` : ''}
                    </div>
                    <div className="font-bold text-[#5C3A21]">
                      {formatPrice(s.totalAmount)}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {items.length} item{items.length !== 1 ? 's' : ''} in cart
                    </span>
                    <span>Updated: {formatDate(s.updatedAt)}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                    <section>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Saved Address
                      </h4>
                      <div className="bg-white rounded-lg p-3 text-sm space-y-1">
                        <p>
                          <span className="text-gray-600">Name:</span> {a.name || '—'}
                        </p>
                        <p>
                          <span className="text-gray-600">Email:</span> {a.email || '—'}
                        </p>
                        <p>
                          <span className="text-gray-600">Phone:</span> {a.phone || '—'}
                        </p>
                        {a.phone2 && (
                          <p>
                            <span className="text-gray-600">Alt Phone:</span> {a.phone2}
                          </p>
                        )}
                        <p>
                          <span className="text-gray-600">Address:</span>{' '}
                          {[
                            a.buildingFlatNo,
                            a.address,
                            a.city,
                            a.state,
                            a.pincode,
                          ]
                            .filter(Boolean)
                            .join(', ') || '—'}
                        </p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Cart Items
                      </h4>
                      {items.length === 0 ? (
                        <p className="text-sm text-gray-500">Cart is empty.</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-lg p-2 text-sm flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.selectedWeight}{' '}
                                  {item.category === 'sticks' ? 'ft' : 'kg'} ×{' '}
                                  {item.quantity} · {formatPrice(item.price)} each
                                </p>
                              </div>
                              <p className="font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>

                    <section className="text-sm border-t pt-2 flex justify-between font-bold text-base">
                      <span className="text-gray-600">Total</span>
                      <span className="text-[#5C3A21]">
                        {formatPrice(s.totalAmount)}
                      </span>
                    </section>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Load More (hidden while a search is active) */}
      {hasMore && !search && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50"
          >
            {loadingMore ? 'Loading…' : `Load More (${sessions.length} of ${total})`}
          </button>
        </div>
      )}

      {allLoaded && sessions.length > 0 && !search && (
        <p className="mt-6 text-center text-sm text-gray-500">
          All {total} session{total !== 1 ? 's' : ''} loaded
        </p>
      )}

      {search && (
        <p className="mt-6 text-center text-xs text-gray-400">
          Search applies to loaded sessions only. Load more to search further.
        </p>
      )}
    </div>
  );
};

export default AdminCheckoutSessions;