import React from 'react';
import { Link } from 'react-router-dom';

const BatchList = ({ batches, onSelectBatch, onInvite }) => {
  if (!batches || batches.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👥</div>
        <div className="empty-state-title">No batches yet</div>
        <p>Create your first batch to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="card"
          style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{batch.name}</div>
              {batch.programme && (
                <span className="badge badge-purple">{batch.programme.name}</span>
              )}
            </div>
            <span className="badge badge-info">{batch._count?.students || 0} students</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            <div>📅 {batch._count?.sessions || 0} sessions</div>
            {batch.trainers?.length > 0 && (
              <div>👨‍🏫 {batch.trainers.map((bt) => bt.trainer?.name).join(', ')}</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onSelectBatch && onSelectBatch(batch)}
            >
              📊 Summary
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onInvite && onInvite(batch)}
            >
              🔗 Invite
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BatchList;
