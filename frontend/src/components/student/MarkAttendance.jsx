import React, { useState } from 'react';
import { markAttendance } from '../../api/attendance.api';

const MarkAttendance = ({ session, onSuccess, onClose }) => {
  const [status, setStatus] = useState('PRESENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await markAttendance(session.id, status);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: 'PRESENT', label: '✅ Present', color: '#10b981' },
    { value: 'LATE', label: '⏰ Late', color: '#f59e0b' },
    { value: 'ABSENT', label: '❌ Absent', color: '#ef4444' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Mark Attendance</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{session.title}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {session.batch?.name} · {new Date(session.date).toLocaleDateString()} · {session.startTime}–{session.endTime}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: 8,
                    border: `2px solid ${status === opt.value ? opt.color : 'var(--border)'}`,
                    background: status === opt.value ? opt.color + '15' : 'white',
                    cursor: 'pointer',
                    fontWeight: status === opt.value ? 600 : 400,
                    fontSize: '0.875rem',
                    color: status === opt.value ? opt.color : 'var(--text)',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAttendance;
