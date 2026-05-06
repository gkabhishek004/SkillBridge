import React, { useState, useEffect } from 'react';
import { createSession } from '../../api/session.api';
import { getBatches } from '../../api/batch.api';

const CreateSession = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    batchId: '',
  });
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getBatches()
      .then((res) => setBatches(res.data.batches))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await createSession(form);
      onSuccess && onSuccess(res.data.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isModal = !!onClose;

  const content = (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Session Title *</label>
        <input
          className="form-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Introduction to Python"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Batch *</label>
        <select
          className="form-select"
          name="batchId"
          value={form.batchId}
          onChange={handleChange}
          required
        >
          <option value="">Select batch...</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.institution?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Date *</label>
        <input
          className="form-input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Start Time *</label>
          <input
            className="form-input"
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Time *</label>
          <input
            className="form-input"
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {isModal && (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onClose}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center' }}
          disabled={loading}
        >
          {loading ? 'Creating...' : '➕ Create Session'}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Create New Session</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Create Session</h1>
      <div className="card" style={{ maxWidth: 560 }}>
        {content}
      </div>
    </div>
  );
};

export default CreateSession;
