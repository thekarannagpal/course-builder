import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiFile, FiLink, FiMoreHorizontal } from 'react-icons/fi';

const Resource = ({ 
  resource, 
  index, 
  moduleId, 
  onDelete, 
  onRename, 
  onEdit,
  onMoveToModule,
  onReorder 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(resource.name);
  const [showActions, setShowActions] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUrl, setEditUrl] = useState(resource.url || '');
  const ref = useRef(null);
  const actionMenuRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'resource',
    item: { id: resource.id, index, moduleId, type: 'resource' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'resource',
    hover(item, monitor) {
      if (!ref.current || item.moduleId !== moduleId) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      
      onReorder(dragIndex, hoverIndex, 'resource', moduleId);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const handleRename = () => {
    if (editName.trim()) {
      onRename(resource.id, editName.trim());
    }
    setIsEditing(false);
    setShowActions(false);
  };

  const handleEditLink = () => {
    if (editName.trim() && editUrl.trim()) {
      onEdit(resource.id, { name: editName.trim(), url: editUrl.trim() });
      setShowEditForm(false);
      setShowActions(false);
    }
  };

  const handleDelete = () => {
    onDelete(resource.id);
    setShowActions(false);
  };

  const handleStartRename = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleStartEditLink = () => {
    setEditName(resource.name);
    setEditUrl(resource.url);
    setShowEditForm(true);
    setShowActions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(resource.name);
      setIsEditing(false);
    }
  };

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const getResourceIcon = () => {
    if (resource.type === 'link') return <FiLink className="resource-icon link-icon" />;
    return <FiFile className="resource-icon file-icon" />;
  };

  const handleResourceClick = () => {
    if (resource.type === 'link') {
      window.open(resource.url, '_blank');
    } else if (resource.file) {
      const link = document.createElement('a');
      link.href = resource.url;
      link.download = resource.name;
      link.click();
    }
  };

  return (
    <>
      <div 
        ref={ref}
        className={`resource-item ${isDragging ? 'dragging' : ''}`}
      >
        <div className="resource-content">
          {getResourceIcon()}
          
          <div className="resource-details">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyPress}
                className="resource-name-edit"
                autoFocus
              />
            ) : (
              <div>
                <span 
                  className="resource-name"
                  onClick={handleResourceClick}
                >
                  {resource.name}
                </span>
                <div className="resource-type">
                  {resource.type === 'link' ? 'Link' : 'PDF'}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="resource-actions" ref={actionMenuRef}>
          <button 
            className="action-menu-btn"
            onClick={toggleActions}
          >
            <FiMoreHorizontal />
          </button>
          
          {showActions && (
            <div className="action-menu">
              <button onClick={handleStartRename}>Rename</button>
              {resource.type === 'link' && (
                <button onClick={handleStartEditLink}>Edit Link</button>
              )}
              <button onClick={handleDelete} className="delete-action">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showEditForm && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h4>Edit Link</h4>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Link name"
              className="form-input"
            />
            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="URL"
              className="form-input"
            />
            <div className="form-actions">
              <button onClick={handleEditLink} className="form-btn primary">
                Save
              </button>
              <button 
                onClick={() => setShowEditForm(false)} 
                className="form-btn secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Resource;
