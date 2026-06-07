import React,{ useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Message from '../components/Message.jsx';
import SortableHeader from '../components/SortableHeader.jsx';
import api from '../services/api';

const emptyUser = { name: '', email: '', password: '', address: '', role: 'user' };
const emptyStore = { name: '', email: '', address: '', ownerId: '' };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userForm, setUserForm] = useState(emptyUser);
  const [storeForm, setStoreForm] = useState(emptyStore);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', order: 'asc' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'asc' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [userFilters, userSort]);

  useEffect(() => {
    loadStores();
  }, [storeFilters, storeSort]);

  async function loadStats() {
    const response = await api.get('/admin/dashboard');
    setStats(response.data);
  }

  async function loadUsers() {
    const response = await api.get('/admin/users', { params: { ...userFilters, ...userSort } });
    setUsers(response.data);
  }

  async function loadStores() {
    const response = await api.get('/admin/stores', { params: { ...storeFilters, ...storeSort } });
    setStores(response.data);
  }

  function updateUserForm(field, value) {
    setUserForm({ ...userForm, [field]: value });
  }

  function updateStoreForm(field, value) {
    setStoreForm({ ...storeForm, [field]: value });
  }

  function changeUserSort(field) {
    setUserSort({
      sortBy: field,
      order: userSort.sortBy === field && userSort.order === 'asc' ? 'desc' : 'asc'
    });
  }

  function changeStoreSort(field) {
    setStoreSort({
      sortBy: field,
      order: storeSort.sortBy === field && storeSort.order === 'asc' ? 'desc' : 'asc'
    });
  }

  async function createUser(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/admin/users', userForm);
      setUserForm(emptyUser);
      setMessage('User added successfully.');
      loadStats();
      loadUsers();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not add user.');
    }
  }

  async function createStore(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/admin/stores', {
        ...storeForm,
        ownerId: storeForm.ownerId || null
      });
      setStoreForm(emptyStore);
      setMessage('Store added successfully.');
      loadStats();
      loadStores();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not add store.');
    }
  }

  async function showUserDetails(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    setSelectedUser(response.data);
  }

  return (
    <Layout title="Admin Dashboard">
      <section className="stats-grid">
        <div className="stat-box"><span>{stats.total_users}</span><p>Users</p></div>
        <div className="stat-box"><span>{stats.total_stores}</span><p>Stores</p></div>
        <div className="stat-box"><span>{stats.total_ratings}</span><p>Ratings</p></div>
      </section>

      <Message type="success">{message}</Message>
      <Message type="error">{error}</Message>

      <section className="two-column">
        <form className="panel" onSubmit={createUser}>
          <h2>Add User</h2>
          <input placeholder="Name" minLength={20} maxLength={60} value={userForm.name} onChange={(e) => updateUserForm('name', e.target.value)} required />
          <input placeholder="Email" type="email" value={userForm.email} onChange={(e) => updateUserForm('email', e.target.value)} required />
          <input placeholder="Password" type="password" minLength={8} maxLength={16} value={userForm.password} onChange={(e) => updateUserForm('password', e.target.value)} required />
          <textarea placeholder="Address" maxLength={400} value={userForm.address} onChange={(e) => updateUserForm('address', e.target.value)} required />
          <select value={userForm.role} onChange={(e) => updateUserForm('role', e.target.value)}>
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <button className="primary-button">Add User</button>
        </form>

        <form className="panel" onSubmit={createStore}>
          <h2>Add Store</h2>
          <input placeholder="Name" minLength={20} maxLength={60} value={storeForm.name} onChange={(e) => updateStoreForm('name', e.target.value)} required />
          <input placeholder="Email" type="email" value={storeForm.email} onChange={(e) => updateStoreForm('email', e.target.value)} required />
          <textarea placeholder="Address" maxLength={400} value={storeForm.address} onChange={(e) => updateStoreForm('address', e.target.value)} required />
          <select value={storeForm.ownerId} onChange={(e) => updateStoreForm('ownerId', e.target.value)}>
            <option value="">No owner selected</option>
            {users.filter((user) => user.role === 'store_owner').map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <button className="primary-button">Add Store</button>
        </form>
      </section>

      <section className="panel table-panel">
        <h2>Users</h2>
        {selectedUser ? (
          <div className="detail-box">
            <strong>{selectedUser.name}</strong>
            <span>{selectedUser.email}</span>
            <span>{selectedUser.address}</span>
            <span>{selectedUser.role}</span>
            {selectedUser.role === 'store_owner' ? <span>Rating: {selectedUser.owner_rating}</span> : null}
          </div>
        ) : null}
        <div className="filters">
          {['name', 'email', 'address', 'role'].map((field) => (
            <input key={field} placeholder={`Filter ${field}`} value={userFilters[field]} onChange={(e) => setUserFilters({ ...userFilters, [field]: e.target.value })} />
          ))}
        </div>
        <table>
          <thead>
            <tr>
              <th><SortableHeader label="Name" field="name" sortBy={userSort.sortBy} order={userSort.order} onSort={changeUserSort} /></th>
              <th><SortableHeader label="Email" field="email" sortBy={userSort.sortBy} order={userSort.order} onSort={changeUserSort} /></th>
              <th><SortableHeader label="Address" field="address" sortBy={userSort.sortBy} order={userSort.order} onSort={changeUserSort} /></th>
              <th><SortableHeader label="Role" field="role" sortBy={userSort.sortBy} order={userSort.order} onSort={changeUserSort} /></th>
              <th>Owner Rating</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{user.role === 'store_owner' ? user.owner_rating : '-'}</td>
                <td><button className="secondary-button" onClick={() => showUserDetails(user.id)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel table-panel">
        <h2>Stores</h2>
        <div className="filters">
          {['name', 'email', 'address'].map((field) => (
            <input key={field} placeholder={`Filter ${field}`} value={storeFilters[field]} onChange={(e) => setStoreFilters({ ...storeFilters, [field]: e.target.value })} />
          ))}
        </div>
        <table>
          <thead>
            <tr>
              <th><SortableHeader label="Name" field="name" sortBy={storeSort.sortBy} order={storeSort.order} onSort={changeStoreSort} /></th>
              <th><SortableHeader label="Email" field="email" sortBy={storeSort.sortBy} order={storeSort.order} onSort={changeStoreSort} /></th>
              <th><SortableHeader label="Address" field="address" sortBy={storeSort.sortBy} order={storeSort.order} onSort={changeStoreSort} /></th>
              <th><SortableHeader label="Rating" field="rating" sortBy={storeSort.sortBy} order={storeSort.order} onSort={changeStoreSort} /></th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}
