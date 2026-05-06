import React from 'react';
import ProgrammeSummary from '../manager/ProgrammeSummary';

const ReadOnlyDashboard = ({ data }) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: 8,
          marginBottom: 24,
          fontSize: '0.875rem',
          color: '#92400e',
        }}
      >
        👁️ <strong>Read-Only Mode</strong> — You have view-only access to this data.
      </div>
      <ProgrammeSummary data={data} />
    </div>
  );
};

export default ReadOnlyDashboard;
