import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLE_COLORS } from '../../utils/roleHelper';

const navItems = {
  STUDENT: [
    { label: 'Dashboard', path: '/student', icon: '🏠', exact: true },
    { label: 'My Sessions', path: '/student/sessions', icon: '📅' },
    { label: 'My Attendance', path: '/student/attendance', icon: '✅' },
    { label: 'Join Batch', path: '/student/join', icon: '🔗' },
  ],
  TRAINER: [
    { label: 'Dashboard', path: '/trainer', icon: '🏠', exact: true },
    { label: 'My Sessions', path: '/trainer/sessions', icon: '📅' },
    { label: 'Create Session', path: '/trainer/sessions/new', icon: '➕' },
    { label: 'My Batches', path: '/trainer/batches', icon: '👥' },
  ],
  INSTITUTION: [
    { label: 'Dashboard', path: '/institution', icon: '🏠', exact: true },
    { label: 'Batches', path: '/institution/batches', icon: '👥' },
    { label: 'Create Batch', path: '/institution/batches/new', icon: '➕' },
    { label: 'Trainers', path: '/institution/trainers', icon: '👨‍🏫' },
    { label: 'Reports', path: '/institution/reports', icon: '📊' },
  ],
  MANAGER: [
    { label: 'Dashboard', path: '/manager', icon: '🏠', exact: true },
    { label: 'Institutions', path: '/manager/institutions', icon: '🏛️' },
    { label: 'Programmes', path: '/manager/programmes', icon: '📋' },
    { label: 'Reports', path: '/manager/reports', icon: '📊' },
  ],
  MONITORING: [
    { label: 'Dashboard', path: '/monitoring', icon: '🏠', exact: true },
    { label: 'Programme Overview', path: '/monitoring/overview', icon: '📊' },
    { label: 'Institutions', path: '/monitoring/institutions', icon: '🏛️' },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const items = navItems[user.role] || [];
  const accentColor = ROLE_COLORS[user.role] || 'var(--primary)';

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 'var(--sidebar-width)',
        height: '100vh',
        background: '#1e293b',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          🎯
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>SkillBridge</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            Attendance System
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 2,
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
              background: isActive ? accentColor : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info at bottom */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
          {user.name}
        </div>
        <div>{user.email}</div>
        {user.institution && (
          <div style={{ marginTop: 4, color: accentColor }}>
            🏛️ {user.institution.name}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
