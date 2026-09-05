import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message.jsx';
import { useAuth } from '../services/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-heading"><span className="brand-mark"><span>★</span></span><p className="eyebrow">WELCOME BACK</p><h1>Sign in to StoreScore</h1><p>Manage ratings and discover better local stores.</p></div>
        <Message type="error">{error}</Message>
        <label>
          Email
          <input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="primary-button" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign In'}</button>
        <p className="muted-text">
          Normal user? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
