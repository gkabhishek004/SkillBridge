import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLE_LABELS, ROLE_COLORS, ROLE_ICONS } from '../../utils/roleHelper';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      height: 'var(--navbar-height)',
      background: 'white',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100,
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
          SkillBridge
        </span>
        {user && (
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 10px',
            borderRadius: 9999,
            background: ROLE_COLORS[user.role] + '20',
            color: ROLE_COLORS[user.role],
            fontWeight: 600,
          }}>
            {ROLE_ICONS[user.role]} {ROLE_LABELS[user.role]}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user && (
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {user.name}
          </span>
        )}
        <button
          onClick={handleSignOut}
          className="btn btn-secondary btn-sm"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
