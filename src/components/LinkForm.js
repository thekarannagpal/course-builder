import React, { useState } from 'react';

const LinkForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      onSubmit({ name: name.trim(), url: url.trim() });
      setName('');
      setUrl('');
    }
  };

  return (
    <div className="link-form-overlay">
      <div className="link-form">
        <h3>Add Link</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Link name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="form-input"
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Link
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkForm;
