import React, { useState, useEffect } from 'react';
import { getBatchSummary } from '../../api/attendance.api';
import Loader from '../common/Loader';
import { getPercentageColor } from '../../utils/roleHelper';

const BatchSummary = ({ batchId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBatchSummary(batchId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [batchId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Batch Summary</h3>
            {data && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {data.batch?.name} · {data.batch?.institution?.name}
              </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {loading && <Loader />}
        {error && <div className="alert alert-error">{error}</div>}

        {data && (
          <>
            {/* Overview stats */}
            <div className="stats-grid" style={{ marginBottom: 20 }}>
              <div className="stat-card">
                <div className="stat-label">Sessions</div>
                <div className="stat-value">{data.totalSessions}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Students</div>
                <div className="stat-value">{data.totalStudents}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Overall Attendance</div>
                <div
                  className="stat-value"
                  style={{ color: getPercentageColor(data.overallPercentage) }}
                >
                  {data.overallPercentage}%
                </div>
              </div>
            </div>

            {/* Per-student breakdown */}
            <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Student Breakdown</h4>
            {data.studentSummaries?.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-title">No students enrolled</div>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Present</th>
                      <th>Late</th>
                      <th>Absent</th>
                      <th>Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.studentSummaries?.map((s) => (
                      <tr key={s.student.id}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{s.student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {s.student.email}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-success">{s.present}</span>
                        </td>
                        <td>
                          <span className="badge badge-warning">{s.late}</span>
                        </td>
                        <td>
                          <span className="badge badge-danger">{s.absent}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="progress-bar" style={{ width: 80 }}>
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${s.percentage}%`,
                                  background: getPercentageColor(s.percentage),
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontWeight: 600,
                                color: getPercentageColor(s.percentage),
                                fontSize: '0.875rem',
                              }}
                            >
                              {s.percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <button
          className="btn btn-secondary w-full"
          style={{ marginTop: 20, justifyContent: 'center' }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BatchSummary;
