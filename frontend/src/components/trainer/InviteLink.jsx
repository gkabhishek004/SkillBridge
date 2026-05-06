import React, { useState } from 'react';

const InviteLink = ({ batch, onClose }) => {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/signup?invite=${batch.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(batch.inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Invite Students</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{batch.name}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Share this invite code or link with students to join this batch.
          </div>
        </div>

        {/* Invite Code */}
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Invite Code</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                flex: 1,
                padding: '10px 16px',
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--primary)',
                textAlign: 'center',
              }}
            >
              {batch.inviteCode}
            </div>
            <button className="btn btn-secondary" onClick={handleCopyCode}>
              {copied ? '✅' : '📋'} Copy
            </button>
          </div>
        </div>

        {/* Invite URL */}
        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Invite Link</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-input"
              value={inviteUrl}
              readOnly
              style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
            />
            <button className="btn btn-primary" onClick={handleCopy}>
              {copied ? '✅ Copied!' : '🔗 Copy'}
            </button>
          </div>
        </div>

        <div
          style={{
            padding: 12,
            background: '#dbeafe',
            borderRadius: 8,
            fontSize: '0.8rem',
            color: '#1e40af',
          }}
        >
          ℹ️ Students can join by entering the invite code on the "Join Batch" page after signing up.
        </div>

        <button
          className="btn btn-secondary w-full"
          style={{ marginTop: 16, justifyContent: 'center' }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InviteLink;
