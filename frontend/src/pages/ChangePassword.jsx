import React,{ useState } from 'react';
import Layout from '../components/Layout.jsx';
import Message from '../components/Message.jsx';
import api from '../services/api';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.patch('/auth/password', { password });
      setPassword('');
      setMessage('Password updated successfully.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not update password.');
    }
  }

  return (
    <Layout title="Change Password">
      <form className="panel small-form" onSubmit={handleSubmit}>
        <Message type="success">{message}</Message>
        <Message type="error">{error}</Message>
        <label>
          New Password
          <input type="password" minLength={8} maxLength={16} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="primary-button">Update Password</button>
      </form>
    </Layout>
  );
}
