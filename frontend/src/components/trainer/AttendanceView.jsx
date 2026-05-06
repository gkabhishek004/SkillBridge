import React, { useState, useEffect } from 'react';
import { getSessionAttendance, bulkMarkAttendance } from '../../api/attendance.api';
import Loader from '../common/Loader';

const AttendanceView = ({ sessionId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [records, setRecords] = useState({});

  useEffect(() => {
    getSessionAttendance(sessionId)
      .then((res) => {
        setData(res.data);
        // Initialize records from existing attendance
        const init = {};
        res.data.attendanceRecords.forEach((r) => {
          init[r.student.id] = r.status === 'NOT_MARKED' ? 'PRESENT' : r.status;
        });
        setRecords(init);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const recordsArray = Object.entries(records).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      await bulkMarkAttendance(sessionId, recordsArray);
      setSuccess('Attendance saved successfully!');
      // Reload
      const res = await getSessionAttendance(sessionId);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const markAll = (status) => {
    const updated = {};
    data.attendanceRecords.forEach((r) => {
      updated[r.student.id] = status;
    });
    setRecords(updated);
  };

  if (loading) return <Loader />;

  const statusColors = {
    PRESENT: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    LATE: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
    ABSENT: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 640, maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Attendance — {data?.session?.title}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {data?.session?.batch?.name} · {new Date(data?.session?.date).toLocaleDateString()}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button className="btn btn-sm btn-success" onClick={() => markAll('PRESENT')}>
            ✅ All Present
          </button>
          <button className="btn btn-sm btn-warning" onClick={() => markAll('LATE')}>
            ⏰ All Late
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => markAll('ABSENT')}>
            ❌ All Absent
          </button>
        </div>

        {data?.attendanceRecords?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">No students enrolled</div>
          </div>
        ) : (
          <div>
            {data.attendanceRecords.map((record) => {
              const currentStatus = records[record.student.id] || 'PRESENT';
              return (
                <div
                  key={record.student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{record.student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {record.student.email}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['PRESENT', 'LATE', 'ABSENT'].map((s) => {
                      const sc = statusColors[s];
                      return (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(record.student.id, s)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: `1px solid ${currentStatus === s ? sc.border : 'var(--border)'}`,
                            background: currentStatus === s ? sc.bg : 'white',
                            color: currentStatus === s ? sc.color : 'var(--text-muted)',
                            fontSize: '0.75rem',
                            fontWeight: currentStatus === s ? 600 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {s === 'PRESENT' ? '✅' : s === 'LATE' ? '⏰' : '❌'} {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
