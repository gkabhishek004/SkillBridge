import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import SessionList from '../../components/student/SessionList';
import MarkAttendance from '../../components/student/MarkAttendance';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { getMyAttendance } from '../../api/attendance.api';
import { getBatches, joinBatch } from '../../api/batch.api';
import { getPercentageColor } from '../../utils/roleHelper';

// Student Home
const StudentHome = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([getMyAttendance(), getBatches()])
      .then(([attRes, batchRes]) => {
        setSummary(attRes.data.summary);
        setBatches(batchRes.data.batches);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
        Welcome back, {user?.name}! 👋
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        Here's your attendance overview
      </p>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{summary?.total || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Present</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{summary?.present || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Late</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{summary?.late || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Attendance %</div>
          <div className="stat-value" style={{ color: getPercentageColor(summary?.percentage || 0) }}>
            {summary?.percentage || 0}%
          </div>
          <div className="stat-sub">
            <div className="progress-bar" style={{ marginTop: 8 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${summary?.percentage || 0}%`,
                  background: getPercentageColor(summary?.percentage || 0),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled batches */}
      {batches.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 className="card-title">My Batches</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  🏛️ {batch.institution?.name}
                </div>
                {batch.programme && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    📋 {batch.programme.name}
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  📅 {batch._count?.sessions || 0} sessions
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions */}
      <SessionList onSelectSession={setSelectedSession} />

      {selectedSession && (
        <MarkAttendance
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onSuccess={() => {
            setSelectedSession(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Join Batch page
const JoinBatch = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await joinBatch(inviteCode.trim());
      setSuccess(`Successfully joined "${res.data.batch.name}"!`);
      setInviteCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Join a Batch</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Enter the invite code provided by your trainer to join a batch.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleJoin}>
          <div className="form-group">
            <label className="form-label">Invite Code</label>
            <input
              className="form-input"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter 10-character invite code"
              maxLength={20}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !inviteCode.trim()}
          >
            {loading ? 'Joining...' : '🔗 Join Batch'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Attendance history page
const AttendanceHistory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAttendance()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const { attendances = [], summary = {} } = data || {};

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>My Attendance</h1>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{summary.total || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Present</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{summary.present || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Late</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{summary.late || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Absent</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{summary.absent || 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Attendance History</h3>
          <span
            style={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: getPercentageColor(summary.percentage || 0),
            }}
          >
            {summary.percentage || 0}%
          </span>
        </div>
        {attendances.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No attendance records yet</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Batch</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Marked At</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((att) => (
                  <tr key={att.id}>
                    <td>{att.session?.title}</td>
                    <td>{att.session?.batch?.name}</td>
                    <td>{new Date(att.session?.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          att.status === 'PRESENT'
                            ? 'badge-success'
                            : att.status === 'LATE'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(att.markedAt).toLocaleString()}
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

const StudentDashboard = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="sessions" element={<SessionList />} />
          <Route path="attendance" element={<AttendanceHistory />} />
          <Route path="join" element={<JoinBatch />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
