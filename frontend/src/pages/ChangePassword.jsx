import React,{ useState } from 'react';
import Layout from '../components/Layout.jsx';
import Message from '../components/Message.jsx';
import api from '../services/api';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      await api.patch('/auth/password', { password });
      setPassword('');
      setMessage('Password updated successfully.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not update password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout title="Change Password">
      <form className="panel small-form" onSubmit={handleSubmit}>
        <div className="panel-heading"><p className="section-kicker">SECURITY</p><h2>Set a new password</h2><p className="muted-text">Use 8–16 characters, including an uppercase letter and special character.</p></div>
        <Message type="success">{message}</Message>
        <Message type="error">{error}</Message>
        <label>
          New Password
          <input type="password" autoComplete="new-password" placeholder="Enter a strong new password" minLength={8} maxLength={16} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="primary-button" disabled={isSubmitting}>{isSubmitting ? 'Updating password…' : 'Update Password'}</button>
      </form>
    </Layout>
  );
}
