import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, listInstitutions } from '../api/auth.api';
import useAuth from '../hooks/useAuth';
import { ROLE_LABELS, ROLE_ICONS } from '../utils/roleHelper';

const ROLES = ['STUDENT', 'TRAINER', 'INSTITUTION', 'MANAGER', 'MONITORING'];

const Signup = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', institutionId: '' });
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listInstitutions()
      .then((res) => setInstitutions(res.data.institutions))
      .catch(() => {});
  }, []);

  const needsInstitution = ['STUDENT', 'TRAINER', 'INSTITUTION'].includes(form.role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) return setError('Please select a role');
    if (needsInstitution && !form.institutionId) return setError('Please select your institution');
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      signIn(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 16,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 40,
        width: '100%',
        maxWidth: 500,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎯</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 4 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join SkillBridge today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, role: r, institutionId: '' }))}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 8,
                    border: `2px solid ${form.role === r ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.role === r ? '#ede9fe' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: 2 }}>{ROLE_ICONS[r]}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: form.role === r ? 'var(--primary)' : 'var(--text)' }}>
                    {ROLE_LABELS[r]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {needsInstitution && (
            <div className="form-group">
              <label className="form-label">Institution</label>
              <select
                className="form-select"
                value={form.institutionId}
                onChange={(e) => setForm(p => ({ ...p, institutionId: e.target.value }))}
                required
              >
                <option value="">Select institution...</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.code})
                  </option>
                ))}
              </select>
              {institutions.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  No institutions yet. Register as Manager first to create one.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', padding: '12px', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
