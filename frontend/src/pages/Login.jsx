import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message.jsx';
import { useAuth } from '../services/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Message type="error">{error}</Message>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="primary-button">Login</button>
        <p className="muted-text">
          Normal user? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
