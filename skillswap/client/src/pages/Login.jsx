import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const DEMO_ACCOUNTS = [
  { name: 'Ananya Sharma', role: 'Mentor (React)', email: 'ananya@example.com' },
  { name: 'Ravi Patel', role: 'Mentor (Node.js)', email: 'ravi@example.com' },
  { name: 'Priya Menon', role: 'Learner (Design)', email: 'priya@example.com' },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDemoSelect = (account) => {
    setFormData({
      email: account.email,
      password: 'password123',
    });
    toast.success(`Loaded credentials for ${account.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail || !formData.password) {
      toast.error('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      await login(cleanEmail, formData.password);
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Access your mentorship dashboard, bookings, and profile</p>
        </div>

        {/* Demo Accounts Pill Selector */}
        <div className="auth-demo-box">
          <div className="auth-demo-label">
            <KeyRound size={13} /> Quick Demo Logins:
          </div>
          <div className="auth-demo-chips">
            {DEMO_ACCOUNTS.map((acc, i) => (
              <button
                key={i}
                type="button"
                className="auth-demo-chip"
                onClick={() => handleDemoSelect(acc)}
              >
                <strong>{acc.name.split(' ')[0]}</strong> ({acc.role})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full mt-4"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <LogIn size={15} /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
