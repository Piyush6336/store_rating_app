import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message.jsx';
import { useAuth } from '../services/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await signup(form);
      navigate('/stores');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Signup failed.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <Message type="error">{error}</Message>
        <label>
          Name
          <input value={form.name} minLength={20} maxLength={60} onChange={(e) => updateField('name', e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
        </label>
        <label>
          Address
          <textarea value={form.address} maxLength={400} onChange={(e) => updateField('address', e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" minLength={8} maxLength={16} value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
        </label>
        <button className="primary-button">Sign Up</button>
        <p className="muted-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
