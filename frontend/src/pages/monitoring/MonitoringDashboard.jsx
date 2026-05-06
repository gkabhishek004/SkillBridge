import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import ReadOnlyDashboard from '../../components/monitoring/ReadOnlyDashboard';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { getProgrammeSummary } from '../../api/attendance.api';
import api from '../../api/axios';
import { getPercentageColor } from '../../utils/roleHelper';

const MonitoringHome = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgrammeSummary()
      .then((res) => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
          Monitoring Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Programme-wide attendance overview · {user?.name}</p>
      </div>
      <ReadOnlyDashboard data={summary} />
    </div>
  );
};

const InstitutionsOverview = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/institutions')
      .then((res) => setInstitutions(res.data.institutions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>
        Institutions Overview
      </h1>
      <div
        style={{
          padding: '10px 16px',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: 8,
          marginBottom: 24,
          fontSize: '0.875rem',
          color: '#92400e',
        }}
      >
        👁️ Read-Only Mode — You can view but not modify any data.
      </div>
      <div className="card">
        {institutions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏛️</div>
            <div className="empty-state-title">No institutions found</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {institutions.map((inst) => (
              <div
                key={inst.id}
                style={{
                  padding: 20,
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--bg)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>
                  {inst.name}
                </div>
                <span className="badge badge-gray" style={{ marginBottom: 12 }}>
                  {inst.code}
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div>👥 {inst._count?.batches || 0} batches</div>
                  <div>👤 {inst._count?.admins || 0} admins</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MonitoringDashboard = () => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <Routes>
        <Route index element={<MonitoringHome />} />
        <Route path="overview" element={<MonitoringHome />} />
        <Route path="institutions" element={<InstitutionsOverview />} />
      </Routes>
    </div>
  </div>
);

export default MonitoringDashboard;
