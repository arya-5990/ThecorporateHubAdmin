import React, { useState } from 'react';
import { supabase } from './supabase';
import { FiMail, FiLock, FiLogIn, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import './LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }

      // Only allow users with admin role in app_metadata
      if (data?.session?.user?.app_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This panel is restricted to authorized administrators only.');
      }

      if (data?.session) {
        onLoginSuccess(data.session);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg-shapes">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
        <div className="bg-shape shape-5"></div>
      </div>

      <div className="login-container">
        {/* Left branding panel */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-icon">🏛️</div>
            <h1>Corporate Hub</h1>
            <span className="branding-badge">ADMIN PANEL</span>
            <p className="branding-tagline">
              Manage your services, monitor inquiries, and control your platform — all from one powerful dashboard.
            </p>
            <div className="branding-features">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Real-time Contact Monitoring</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Service Accordion Editor</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>User Management Dashboard</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Live Sync & Publishing</span>
              </div>
            </div>
          </div>
          <div className="branding-footer">
            <p>© 2026 AntiLabs Hub. All rights reserved.</p>
          </div>
        </div>

        {/* Right login form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access the admin dashboard</p>
            </div>

            {error && (
              <div className="login-error" id="login-error">
                <FiAlertCircle className="error-icon" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form" id="login-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="admin@corporatehub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                id="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner"></span>
                ) : (
                  <>
                    <FiLogIn /> Sign In
                  </>
                )}
              </button>
            </form>

            <div className="login-form-footer">
              <div className="secure-badge">
                <FiLock />
                <span>Secured with Supabase Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
