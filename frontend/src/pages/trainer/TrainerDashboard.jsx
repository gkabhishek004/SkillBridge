import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import CreateSession from '../../components/trainer/CreateSession';
import AttendanceView from '../../components/trainer/AttendanceView';
import InviteLink from '../../components/trainer/InviteLink';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { getSessions, toggleSessionActive, deleteSession } from '../../api/session.api';
import { getBatches } from '../../api/batch.api';

const TrainerHome = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const loadData = () => {
    Promise.all([getSessions(), getBatches()])
      .then(([sRes, bRes]) => {
        setSessions(sRes.data.sessions);
        setBatches(bRes.data.batches);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleToggle = async (sessionId) => {
    try {
      await toggleSessionActive(sessionId);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    try {
      await deleteSession(sessionId);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;

  const activeSessions = sessions.filter((s) => s.isActive);

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
            Trainer Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.name}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          ➕ New Session
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{sessions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Now</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{activeSessions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">My Batches</div>
          <div className="stat-value">{batches.length}</div>
        </div>
      </div>

      {/* Batches with invite links */}
      {batches.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">My Batches</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {batches.map((batch) => (
              <div
                key={batch.id}
                style={{
                  padding: 16,
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--bg)',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{batch.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  🏛️ {batch.institution?.name} · 👥 {batch._count?.students || 0} students
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedBatch(batch)}
                >
                  🔗 Invite Link
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">My Sessions</h3>
          <span className="badge badge-info">{sessions.length}</span>
        </div>
        {sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-title">No sessions yet</div>
            <p>Create your first session to get started.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowCreate(true)}>
              ➕ Create Session
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Batch</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td style={{ fontWeight: 500 }}>{session.title}</td>
                    <td>{session.batch?.name}</td>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {session.startTime}–{session.endTime}
                    </td>
                    <td>
                      {session.isActive ? (
                        <span className="badge badge-success">🟢 Active</span>
                      ) : (
                        <span className="badge badge-gray">Closed</span>
                      )}
                    </td>
                    <td>{session._count?.attendances || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedSession(session.id)}
                        >
                          📋 Attendance
                        </button>
                        <button
                          className={`btn btn-sm ${session.isActive ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggle(session.id)}
                        >
                          {session.isActive ? '⏹ Close' : '▶ Open'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(session.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateSession
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); loadData(); }}
        />
      )}

      {selectedSession && (
        <AttendanceView
          sessionId={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {selectedBatch && (
        <InviteLink
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
        />
      )}
    </div>
  );
};

const TrainerDashboard = () => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <Routes>
        <Route index element={<TrainerHome />} />
        <Route path="sessions" element={<TrainerHome />} />
        <Route path="sessions/new" element={<CreateSession />} />
        <Route path="batches" element={<TrainerHome />} />
      </Routes>
    </div>
  </div>
);

export default TrainerDashboard;
