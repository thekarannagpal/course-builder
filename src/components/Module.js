import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Resource from './Resource';
import { FiChevronDown, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';

const Module = ({ 
  module, 
  index, 
  resources, 
  onDelete, 
  onRename, 
  onDeleteResource,
  onRenameResource,
  onEditLink,
  onMoveResource,
  onReorder 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(module.name);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const ref = useRef(null);
  const dropRef = useRef(null);
  const actionMenuRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'module',
    item: { id: module.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ['module', 'resource'],
    drop(item, monitor) {
      if (item.type === 'resource' && item.moduleId !== module.id) {
        onMoveResource(item.id, module.id);
        return;
      }
    },
    hover(item, monitor) {
      if (!ref.current) return;
      
      if (item.type === 'module') {
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        onReorder(dragIndex, hoverIndex, 'module');
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }) && monitor.getItemType() === 'resource',
    }),
  });

  const [{ isOverContent }, dropContent] = useDrop({
    accept: 'resource',
    drop(item, monitor) {
      if (item.moduleId !== module.id) {
        onMoveResource(item.id, module.id);
      }
    },
    collect: (monitor) => ({
      isOverContent: monitor.isOver(),
    }),
  });

  drag(drop(ref));
  dropContent(dropRef);

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
      onRename(module.id, editName.trim());
    }
    setIsEditing(false);
    setShowActions(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setShowActions(false);
  };

  const handleStartRename = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(module.name);
      setIsEditing(false);
    }
  };

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  return (
    <div 
      ref={ref}
      id={`module-${module.id}`}
      className={`module-item ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-over' : ''}`}
    >
      <div className="module-header">
        <div className="module-left">
          <button 
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
          </button>
          
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="module-name-edit"
              autoFocus
            />
          ) : (
            <div className="module-info">
              <h3 className="module-title">
                {module.name}
              </h3>
              <span className="item-count">{resources.length} items</span>
            </div>
          )}
        </div>
        
        <div className="module-actions" ref={actionMenuRef}>
          <button 
            className="action-menu-btn"
            onClick={toggleActions}
          >
            <FiMoreHorizontal />
          </button>
          
          {showActions && (
            <div className="action-menu">
              <button onClick={handleStartRename}>Rename</button>
              <button onClick={handleDelete} className="delete-action">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div 
          ref={dropRef}
          className={`module-content ${isOverContent ? 'drop-zone-active' : ''}`}
        >
          {resources.length === 0 ? (
            <div className={`empty-module-content ${isOverContent ? 'drop-active' : ''}`}>
              <p>Drop resources here</p>
            </div>
          ) : (
            <div className="module-resources">
              {resources
                .sort((a, b) => a.position - b.position)
                .map((resource, resourceIndex) => (
                  <Resource
                    key={resource.id}
                    resource={resource}
                    index={resourceIndex}
                    moduleId={module.id}
                    onDelete={onDeleteResource}
                    onRename={onRenameResource}
                    onEdit={resource.type === 'link' ? onEditLink : null}
                    onReorder={onReorder}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Module;
