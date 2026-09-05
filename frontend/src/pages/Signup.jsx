import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message.jsx';
import { useAuth } from '../services/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    try {
      await signup(form);
      navigate('/stores');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <div className="auth-heading"><span className="brand-mark"><span>★</span></span><p className="eyebrow">GET STARTED</p><h1>Create your account</h1><p>Join StoreScore and share helpful feedback.</p></div>
        <Message type="error">{error}</Message>
        <label>
          Name
          <input placeholder="Your full name" value={form.name} minLength={20} maxLength={60} onChange={(e) => updateField('name', e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
        </label>
        <label>
          Address
          <textarea placeholder="Street, city and postcode" value={form.address} maxLength={400} onChange={(e) => updateField('address', e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" autoComplete="new-password" placeholder="8–16 characters" minLength={8} maxLength={16} value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
          <small className="field-hint">Use an uppercase letter and a special character.</small>
        </label>
        <button className="primary-button" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create Account'}</button>
        <p className="muted-text">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
