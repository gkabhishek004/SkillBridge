import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import ProgrammeSummary from '../../components/manager/ProgrammeSummary';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { getProgrammeSummary } from '../../api/attendance.api';
import api from '../../api/axios';

// Create Institution Modal
const CreateInstitutionModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/institutions', form);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add Institution</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Institution Name *</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Government ITI Bangalore"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Institution Code *</label>
            <input
              className="form-input"
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. ITI-BLR-001"
              required
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Institution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Manager Home
const ManagerHome = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    getProgrammeSummary()
      .then((res) => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
          Programme Manager Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.name}</p>
      </div>
      <ProgrammeSummary data={summary} />
    </div>
  );
};

// Institutions page
const InstitutionsPage = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadData = () => {
    api.get('/institutions')
      .then((res) => setInstitutions(res.data.institutions))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Institutions</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          ➕ Add Institution
        </button>
      </div>

      <div className="card">
        {institutions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏛️</div>
            <div className="empty-state-title">No institutions yet</div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowCreate(true)}>
              ➕ Add First Institution
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Batches</th>
                  <th>Admins</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst) => (
                  <tr key={inst.id}>
                    <td style={{ fontWeight: 500 }}>{inst.name}</td>
                    <td><span className="badge badge-gray">{inst.code}</span></td>
                    <td>{inst._count?.batches || 0}</td>
                    <td>{inst._count?.admins || 0}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(inst.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateInstitutionModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); loadData(); }}
        />
      )}
    </div>
  );
};

// Programmes page
const ProgrammesPage = () => {
  const [programmes, setProgrammes] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', institutionId: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/programmes'),
      api.get('/institutions'),
    ])
      .then(([pRes, iRes]) => {
        setProgrammes(pRes.data.programmes);
        setInstitutions(iRes.data.institutions);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await api.post('/programmes', form);
      setShowCreate(false);
      setForm({ name: '', description: '', institutionId: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Programmes</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          ➕ Add Programme
        </button>
      </div>

      <div className="card">
        {programmes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No programmes yet</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Programme</th>
                  <th>Institution</th>
                  <th>Batches</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {programmes.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      {p.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td>{p.institution?.name}</td>
                    <td>{p._count?.batches || 0}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Programme</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Programme Name *</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Digital Literacy 2024"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  className="form-input"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Institution *</label>
                <select
                  className="form-select"
                  value={form.institutionId}
                  onChange={(e) => setForm((p) => ({ ...p, institutionId: e.target.value }))}
                  required
                >
                  <option value="">Select institution...</option>
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ManagerDashboard = () => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <Routes>
        <Route index element={<ManagerHome />} />
        <Route path="institutions" element={<InstitutionsPage />} />
        <Route path="programmes" element={<ProgrammesPage />} />
        <Route path="reports" element={<ManagerHome />} />
      </Routes>
    </div>
  </div>
);

export default ManagerDashboard;
