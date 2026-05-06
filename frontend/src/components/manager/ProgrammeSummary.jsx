import React from 'react';
import { getPercentageColor } from '../../utils/roleHelper';

const ProgrammeSummary = ({ data }) => {
  if (!data) return null;

  const { institutionSummaries = [], grandTotal = {} } = data;

  return (
    <div>
      {/* Grand totals */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Institutions</div>
          <div className="stat-value">{grandTotal.totalInstitutions || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Batches</div>
          <div className="stat-value">{grandTotal.totalBatches || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{grandTotal.totalSessions || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{grandTotal.totalStudents || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Attendance</div>
          <div
            className="stat-value"
            style={{ color: getPercentageColor(grandTotal.averageAttendance || 0) }}
          >
            {grandTotal.averageAttendance || 0}%
          </div>
        </div>
      </div>

      {/* Per-institution breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Institution Breakdown</h3>
        </div>
        {institutionSummaries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏛️</div>
            <div className="empty-state-title">No institutions yet</div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Code</th>
                  <th>Batches</th>
                  <th>Sessions</th>
                  <th>Students</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {institutionSummaries.map((inst) => (
                  <tr key={inst.institutionId}>
                    <td style={{ fontWeight: 500 }}>{inst.institutionName}</td>
                    <td>
                      <span className="badge badge-gray">{inst.institutionCode}</span>
                    </td>
                    <td>{inst.totalBatches}</td>
                    <td>{inst.totalSessions}</td>
                    <td>{inst.totalStudents}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${inst.overallPercentage}%`,
                              background: getPercentageColor(inst.overallPercentage),
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontWeight: 600,
                            color: getPercentageColor(inst.overallPercentage),
                          }}
                        >
                          {inst.overallPercentage}%
                        </span>
                      </div>
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

export default ProgrammeSummary;
