import React from 'react';

const Loader = ({ fullScreen, size = 'md', text }) => {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const px = sizes[size] || 36;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {text && <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{text}</span>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
      {spinner}
    </div>
  );
};

export default Loader;
