import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import BatchList from '../../components/institution/BatchList';
import BatchSummary from '../../components/institution/BatchSummary';
import InviteLink from '../../components/trainer/InviteLink';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { getBatches, createBatch, assignTrainer } from '../../api/batch.api';
import { getInstitutionSummary } from '../../api/attendance.api';
import api from '../../api/axios';
import { getPercentageColor } from '../../utils/roleHelper';

// Create Batch Modal
const CreateBatchModal = ({ institutionId, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', institutionId });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createBatch(form);
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
          <h3 className="modal-title">Create New Batch</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Batch Name *</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Batch A - Web Development 2024"
              required
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Institution Home
const InstitutionHome = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [inviteBatch, setInviteBatch] = useState(null);

  const loadData = () => {
    Promise.all([
      getBatches(),
      user?.institutionId ? getInstitutionSummary(user.institutionId) : Promise.resolve(null),
    ])
      .then(([bRes, sRes]) => {
        setBatches(bRes.data.batches);
        if (sRes) setSummary(sRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
            Institution Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {user?.institution?.name || 'Your Institution'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          ➕ New Batch
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Batches</div>
          <div className="stat-value">{batches.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">
            {batches.reduce((s, b) => s + (b._count?.students || 0), 0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">
            {batches.reduce((s, b) => s + (b._count?.sessions || 0), 0)}
          </div>
        </div>
        {summary && (
          <div className="stat-card">
            <div className="stat-label">Avg Attendance</div>
            <div
              className="stat-value"
              style={{
                color: getPercentageColor(
                  summary.batchSummaries?.reduce((s, b) => s + b.overallPercentage, 0) /
                    (summary.batchSummaries?.length || 1)
                ),
              }}
            >
              {summary.batchSummaries?.length > 0
                ? Math.round(
                    summary.batchSummaries.reduce((s, b) => s + b.overallPercentage, 0) /
                      summary.batchSummaries.length
                  )
                : 0}
              %
            </div>
          </div>
        )}
      </div>

      {/* Batch list */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Batches</h3>
        </div>
        <BatchList
          batches={batches}
          onSelectBatch={(b) => setSelectedBatch(b.id)}
          onInvite={setInviteBatch}
        />
      </div>

      {showCreate && (
        <CreateBatchModal
          institutionId={user?.institutionId}
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); loadData(); }}
        />
      )}

      {selectedBatch && (
        <BatchSummary batchId={selectedBatch} onClose={() => setSelectedBatch(null)} />
      )}

      {inviteBatch && (
        <InviteLink batch={inviteBatch} onClose={() => setInviteBatch(null)} />
      )}
    </div>
  );
};

// Trainers page
const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/institutions/trainers')
      .then((res) => setTrainers(res.data.trainers))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Trainers</h1>
      <div className="card">
        {trainers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🏫</div>
            <div className="empty-state-title">No trainers yet</div>
            <p>Trainers will appear here once they register with your institution.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.name}</td>
                    <td>{t.email}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const InstitutionDashboard = () => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <Routes>
        <Route index element={<InstitutionHome />} />
        <Route path="batches" element={<InstitutionHome />} />
        <Route path="batches/new" element={<InstitutionHome />} />
        <Route path="trainers" element={<TrainersPage />} />
        <Route path="reports" element={<InstitutionHome />} />
      </Routes>
    </div>
  </div>
);

export default InstitutionDashboard;
