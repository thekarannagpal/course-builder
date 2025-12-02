import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Module from './components/Module';
import Resource from './components/Resource';
import SearchBar from './components/SearchBar';
import Outline from './components/Outline';
import FileUpload from './components/FileUpload';
import LinkForm from './components/LinkForm';
import ModuleForm from './components/ModuleForm';
import AddDropdown from './components/AddDropdown';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [modules, setModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModule, setActiveModule] = useState(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Add new module
  const addModule = (moduleName) => {
    const newModule = {
      id: uuidv4(),
      name: moduleName || `Module ${modules.length + 1}`,
      position: modules.length
    };
    setModules([...modules, newModule]);
    setShowModuleForm(false);
    setShowAddDropdown(false);
  };

  // Show module form
  const showModuleFormHandler = () => {
    setShowModuleForm(true);
    setShowAddDropdown(false);
  };

  // Delete module
  const deleteModule = (moduleId) => {
    setModules(modules.filter(m => m.id !== moduleId));
    setResources(resources.map(r => 
      r.moduleId === moduleId ? { ...r, moduleId: null } : r
    ));
  };

  // Rename module
  const renameModule = (moduleId, newName) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, name: newName } : m
    ));
  };

  // Add resource (file upload)
  const addResource = (files) => {
    const newResources = Array.from(files).map(file => ({
      id: uuidv4(),
      name: file.name,
      type: 'file',
      file: file,
      url: URL.createObjectURL(file),
      moduleId: null,
      position: resources.length
    }));
    setResources([...resources, ...newResources]);
    setShowAddDropdown(false);
  };

  // Add link resource
  const addLink = (linkData) => {
    const newLink = {
      id: uuidv4(),
      name: linkData.name,
      type: 'link',
      url: linkData.url,
      moduleId: null,
      position: resources.length
    };
    setResources([...resources, newLink]);
    setShowLinkForm(false);
    setShowAddDropdown(false);
  };

  // Delete resource
  const deleteResource = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.url && resource.type === 'file') {
      URL.revokeObjectURL(resource.url);
    }
    setResources(resources.filter(r => r.id !== resourceId));
  };

  // Rename resource
  const renameResource = (resourceId, newName) => {
    setResources(resources.map(r => 
      r.id === resourceId ? { ...r, name: newName } : r
    ));
  };

  // Edit link
  const editLink = (resourceId, linkData) => {
    setResources(resources.map(r => 
      r.id === resourceId ? { ...r, name: linkData.name, url: linkData.url } : r
    ));
  };

  // Move resource to module
  const moveResourceToModule = (resourceId, targetModuleId) => {
    setResources(resources.map(r => 
      r.id === resourceId ? { ...r, moduleId: targetModuleId } : r
    ));
  };

  // Reorder items
  const reorderItems = (dragIndex, hoverIndex, type, moduleId = null) => {
    if (type === 'module') {
      const dragModule = modules[dragIndex];
      const newModules = [...modules];
      newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, dragModule);
      setModules(newModules.map((m, index) => ({ ...m, position: index })));
    } else {
      const moduleResources = resources.filter(r => r.moduleId === moduleId);
      const dragResource = moduleResources[dragIndex];
      const newResources = [...resources];
      const dragResourceIndex = newResources.findIndex(r => r.id === dragResource.id);
      newResources.splice(dragResourceIndex, 1);
      
      if (hoverIndex === 0) {
        newResources.unshift(dragResource);
      } else {
        const hoverResource = moduleResources[hoverIndex];
        const hoverResourceIndex = newResources.findIndex(r => r.id === hoverResource.id);
        newResources.splice(hoverResourceIndex, 0, dragResource);
      }
      
      setResources(newResources.map((r, index) => ({ ...r, position: index })));
    }
  };

  // Filter items based on search
  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to module
  const scrollToModule = (moduleId) => {
    const element = document.getElementById(`module-${moduleId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll to update active module
  useEffect(() => {
    const handleScroll = () => {
      const moduleElements = modules.map(m => ({
        id: m.id,
        element: document.getElementById(`module-${m.id}`)
      })).filter(m => m.element);

      const scrollPosition = window.scrollY + 100;
      
      for (let i = moduleElements.length - 1; i >= 0; i--) {
        if (moduleElements[i].element.offsetTop <= scrollPosition) {
          setActiveModule(moduleElements[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [modules]);

  // Check if there's any content
  const hasContent = modules.length > 0 || resources.filter(r => !r.moduleId).length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        {/* Sidebar */}
        <div className="sidebar">
          <Outline 
            modules={modules}
            activeModule={activeModule}
            onModuleClick={scrollToModule}
          />
        </div>
        
        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <header className="header">
            <div className="header-content">
              <h1 className="course-title">Course Builder</h1>
              <div className="header-right">
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                <div className="add-button-container">
                  <button 
                    className="add-button"
                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                  >
                    Add
                  </button>
                  {showAddDropdown && (
                    <AddDropdown 
                      onAddModule={showModuleFormHandler}
                      onAddFile={() => document.getElementById('file-input').click()}
                      onAddLink={() => setShowLinkForm(true)}
                      onClose={() => setShowAddDropdown(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Hidden File Input */}
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                addResource(e.target.files);
              }
              e.target.value = '';
            }}
            style={{ display: 'none' }}
          />

          {/* Module Form Modal */}
          {showModuleForm && (
            <ModuleForm 
              onSubmit={addModule}
              onCancel={() => setShowModuleForm(false)}
            />
          )}

          {/* Link Form Modal */}
          {showLinkForm && (
            <LinkForm 
              onSubmit={addLink}
              onCancel={() => setShowLinkForm(false)}
            />
          )}

          {/* Course Content */}
          <div className="content-area">
            {!hasContent ? (
              /* Empty State */
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h2 className="empty-title">Nothing added yet</h2>
                <p className="empty-description">
                  Click <strong>Add (+)</strong> to add items to your course
                </p>
                <button 
                  className="empty-add-button"
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                >
                  <span className="plus-icon">+</span>
                  Add your first item
                </button>
              </div>
            ) : (
              <>
                {/* Unassigned Resources */}
                {resources.filter(r => !r.moduleId).length > 0 && (
                  <div className="resources-section">
                    {resources
                      .filter(r => !r.moduleId && (!searchTerm || filteredResources.includes(r)))
                      .map(resource => (
                        <Resource
                          key={resource.id}
                          resource={resource}
                          onDelete={deleteResource}
                          onRename={renameResource}
                          onEdit={resource.type === 'link' ? editLink : null}
                          onMoveToModule={moveResourceToModule}
                        />
                      ))}
                  </div>
                )}

                {/* Modules */}
                <div className="modules-container">
                  {(searchTerm ? filteredModules : modules)
                    .sort((a, b) => a.position - b.position)
                    .map((module, index) => (
                      <Module
                        key={module.id}
                        module={module}
                        index={index}
                        resources={resources.filter(r => 
                          r.moduleId === module.id && 
                          (!searchTerm || filteredResources.includes(r))
                        )}
                        onDelete={deleteModule}
                        onRename={renameModule}
                        onDeleteResource={deleteResource}
                        onRenameResource={renameResource}
                        onEditLink={editLink}
                        onMoveResource={moveResourceToModule}
                        onReorder={reorderItems}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
