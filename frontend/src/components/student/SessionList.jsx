import React, { useEffect, useState } from 'react';
import { getSessions } from '../../api/session.api';
import { getAttendanceBadgeClass, getAttendanceLabel } from '../../utils/roleHelper';
import Loader from '../common/Loader';

const SessionList = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSessions()
      .then((res) => setSessions(res.data.sessions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-error">{error}</div>;

  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📅</div>
        <div className="empty-state-title">No sessions yet</div>
        <p>Join a batch to see your sessions here.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Sessions</h3>
        <span className="badge badge-info">{sessions.length} total</span>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Session</th>
              <th>Batch</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Attendance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const myAttendance = session.attendances?.[0];
              const status = myAttendance?.status || 'NOT_MARKED';
              return (
                <tr key={session.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{session.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      by {session.createdBy?.name}
                    </div>
                  </td>
                  <td>{session.batch?.name}</td>
                  <td>{new Date(session.date).toLocaleDateString()}</td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {session.startTime} – {session.endTime}
                  </td>
                  <td>
                    {session.isActive ? (
                      <span className="badge badge-success">🟢 Active</span>
                    ) : (
                      <span className="badge badge-gray">Closed</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getAttendanceBadgeClass(status)}`}>
                      {getAttendanceLabel(status)}
                    </span>
                  </td>
                  <td>
                    {session.isActive && status === 'NOT_MARKED' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectSession && onSelectSession(session)}
                      >
                        Mark
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionList;
