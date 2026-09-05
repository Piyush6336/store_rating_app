import React,{ useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import SortableHeader from '../components/SortableHeader.jsx';
import Message from '../components/Message.jsx';
import StarRating from '../components/StarRating.jsx';
import api from '../services/api';

export default function OwnerDashboard() {
  const [data, setData] = useState({ store: null, averageRating: 0, users: [] });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get('/owner/dashboard');
        setData(response.data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Could not load your dashboard.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function changeSort(field) {
    setSort({
      sortBy: field,
      order: sort.sortBy === field && sort.order === 'asc' ? 'desc' : 'asc'
    });
  }

  const sortedUsers = [...data.users].sort((first, second) => {
    const firstValue = String(first[sort.sortBy] || '').toLowerCase();
    const secondValue = String(second[sort.sortBy] || '').toLowerCase();

    if (firstValue < secondValue) {
      return sort.order === 'asc' ? -1 : 1;
    }

    if (firstValue > secondValue) {
      return sort.order === 'asc' ? 1 : -1;
    }

    return 0;
  });

  return (
    <Layout title="Store Owner Dashboard">
      <section className="stats-grid">
        <div className="stat-box wide-stat">
          <span>{isLoading ? 'Loading…' : data.store?.name || 'No store assigned'}</span>
          <p>Store</p>
        </div>
        <div className="stat-box">
          <span>{isLoading ? '—' : data.averageRating}</span>
          <p>Average Rating</p><StarRating value={Number(data.averageRating)} label="Average rating" />
        </div>
      </section>

      <Message type="error">{error}</Message>

      <section className="panel table-panel">
        <h2>Users Who Rated Your Store</h2>
        <table>
          <thead>
            <tr>
              <th><SortableHeader label="Name" field="name" sortBy={sort.sortBy} order={sort.order} onSort={changeSort} /></th>
              <th><SortableHeader label="Email" field="email" sortBy={sort.sortBy} order={sort.order} onSort={changeSort} /></th>
              <th><SortableHeader label="Address" field="address" sortBy={sort.sortBy} order={sort.order} onSort={changeSort} /></th>
              <th><SortableHeader label="Rating" field="rating" sortBy={sort.sortBy} order={sort.order} onSort={changeSort} /></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan="4"><div className="table-loading">Loading ratings…</div></td></tr> : null}
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td><span className="table-rating">{user.rating} <StarRating value={Number(user.rating)} label={`${user.name}'s rating`} /></span></td>
              </tr>
            ))}
            {!isLoading && sortedUsers.length === 0 ? <tr><td colSpan="4"><div className="table-empty">No ratings yet. Your customer feedback will appear here.</div></td></tr> : null}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
