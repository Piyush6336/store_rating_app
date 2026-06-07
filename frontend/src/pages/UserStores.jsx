import React,{ useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Message from '../components/Message.jsx';
import SortableHeader from '../components/SortableHeader.jsx';
import api from '../services/api';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadStores();
  }, [search, sort]);

  async function loadStores() {
    const response = await api.get('/stores', { params: { search, ...sort } });
    setStores(response.data);
  }

  function changeSort(field) {
    setSort({
      sortBy: field,
      order: sort.sortBy === field && sort.order === 'asc' ? 'desc' : 'asc'
    });
  }

  async function submitRating(storeId, rating) {
    setMessage('');
    setError('');

    try {
      await api.post(`/stores/${storeId}/rating`, { rating: Number(rating) });
      setMessage('Rating saved.');
      loadStores();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not save rating.');
    }
  }

  return (
    <Layout title="Stores">
      <div className="toolbar">
        <input placeholder="Search by name or address" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Message type="success">{message}</Message>
      <Message type="error">{error}</Message>

      <section className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th><SortableHeader label="Store Name" field="name" sortBy={sort.sortBy} order={sort.order} onSort={changeSort} /></th>
              <th><SortableHeader label="Address" field="address" sortBy={sort.sortBy} order={sort.order} onSort={changeSort} /></th>
              <th><SortableHeader label="Overall Rating" field="rating" sortBy={sort.sortBy} order={sort.order} onSort={changeSort} /></th>
              <th>Your Rating</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.overall_rating}</td>
                <td>{store.user_rating || 'Not rated'}</td>
                <td>
                  <select defaultValue={store.user_rating || ''} onChange={(e) => submitRating(store.id, e.target.value)}>
                    <option value="" disabled>Rate</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
