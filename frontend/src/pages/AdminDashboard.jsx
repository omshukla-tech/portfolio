import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'skills', 'messages'

  // Data lists
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);

  // Modals / Form States
  const [projectModal, setProjectModal] = useState({ open: false, isEdit: false, data: { id: null, name: '', bio: '', img: '', previewLink: '', codeLink: '', display_order: 0 } });
  const [skillModal, setSkillModal] = useState({ open: false, isEdit: false, data: { id: null, name: '', category: 'primary', icon_class: '', display_order: 0 } });
  
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch admin-protected content when logged in
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchData();
    }
  }, [isLoggedIn, token]);

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Load projects
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error loading projects:", err));

    // Load skills
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error("Error loading skills:", err));

    // Load messages
    fetch('/api/contact', { headers })
      .then(res => {
        if (res.status === 401) {
          handleLogout();
          return [];
        }
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(err => console.error("Error loading contact messages:", err));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.username || !loginForm.password) {
      setLoginError('Please enter username and password.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        setLoginForm({ username: '', password: '' });
      } else {
        setLoginError(data.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      setLoginError('Unable to connect to auth server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setIsLoggedIn(false);
  };

  // --- PROJECT ACTIONS ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const url = projectModal.isEdit ? `/api/projects/${projectModal.data.id}` : '/api/projects';
    const method = projectModal.isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectModal.data)
      });
      if (res.ok) {
        setProjectModal({ open: false, isEdit: false, data: { id: null, name: '', bio: '', img: '', previewLink: '', codeLink: '', display_order: 0 } });
        fetchData();
      } else {
        alert("Failed to save project.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- SKILL ACTIONS ---
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const url = skillModal.isEdit ? `/api/skills/${skillModal.data.id}` : '/api/skills';
    const method = skillModal.isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skillModal.data)
      });
      if (res.ok) {
        setSkillModal({ open: false, isEdit: false, data: { id: null, name: '', category: 'primary', icon_class: '', display_order: 0 } });
        fetchData();
      } else {
        alert("Failed to save skill.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- MESSAGE ACTIONS ---
  const handleMarkMessageRead = async (id, currentRead) => {
    try {
      const res = await fetch(`/api/contact/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: !currentRead })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="glass-panel admin-login-card">
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Admin Portal</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}>
              Log In
            </button>
            {loginError && <div className="form-status error" style={{ marginTop: '12px' }}>{loginError}</div>}
          </form>
        </div>
      </div>
    );
  }

  // LOGGED-IN WORKSPACE
  return (
    <div className="section admin-dashboard">
      <div className="admin-header-row">
        <h2>Admin Management Dashboard</h2>
        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px' }}>
          <i className="fas fa-sign-out-alt" /> Log Out
        </button>
      </div>

      <div className="admin-nav">
        <button 
          className={`admin-nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({projects.length})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills ({skills.length})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages ({messages.length})
        </button>
      </div>

      {/* PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div>
          <div className="admin-header-row">
            <h3>Projects Showcase</h3>
            <button 
              className="btn-primary"
              onClick={() => setProjectModal({ 
                open: true, 
                isEdit: false, 
                data: { id: null, name: '', bio: '', img: '', previewLink: '', codeLink: '', display_order: projects.length + 1 } 
              })}
            >
              <i className="fas fa-plus" /> Add Project
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Image</th>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td>{p.display_order}</td>
                    <td>
                      <img src={p.img} alt={p.name} style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ fontWeight: '500' }}>{p.name}</td>
                    <td style={{ color: 'var(--text-secondary)', maxMask: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.bio}</td>
                    <td>
                      <div className="admin-actions">
                        <button 
                          className="btn-action edit"
                          onClick={() => setProjectModal({ open: true, isEdit: true, data: p })}
                        >
                          <i className="fas fa-pencil-alt" />
                        </button>
                        <button 
                          className="btn-action delete"
                          onClick={() => handleDeleteProject(p.id)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No projects in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SKILLS MANAGEMENT */}
      {activeTab === 'skills' && (
        <div>
          <div className="admin-header-row">
            <h3>Technical Capabilities</h3>
            <button 
              className="btn-primary"
              onClick={() => setSkillModal({ 
                open: true, 
                isEdit: false, 
                data: { id: null, name: '', category: 'primary', icon_class: 'fas fa-code', display_order: skills.length + 1 } 
              })}
            >
              <i className="fas fa-plus" /> Add Skill
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Icon</th>
                  <th>Skill Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map(s => (
                  <tr key={s.id}>
                    <td>{s.display_order}</td>
                    <td><i className={s.icon_class} style={{ fontSize: '18px', color: 'var(--accent)' }} /></td>
                    <td style={{ fontWeight: '500' }}>{s.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{s.category}</td>
                    <td>
                      <div className="admin-actions">
                        <button 
                          className="btn-action edit"
                          onClick={() => setSkillModal({ open: true, isEdit: true, data: s })}
                        >
                          <i className="fas fa-pencil-alt" />
                        </button>
                        <button 
                          className="btn-action delete"
                          onClick={() => handleDeleteSkill(s.id)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {skills.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No skills in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INBOX MESSAGES */}
      {activeTab === 'messages' && (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Contact Queries</h3>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>From</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m.id} style={{ opacity: m.read ? 0.7 : 1 }}>
                    <td>
                      <span 
                        style={{ 
                          display: 'inline-block', 
                          padding: '4px 8px', 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          borderRadius: '4px',
                          backgroundColor: m.read ? 'var(--border-color)' : 'var(--accent-light)',
                          color: m.read ? 'var(--text-secondary)' : 'var(--accent)'
                        }}
                      >
                        {m.read ? 'READ' : 'NEW'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{m.name}</td>
                    <td><a href={`mailto:${m.email}`} style={{ color: 'var(--accent)' }}>{m.email}</a></td>
                    <td style={{ maxWidth: '400px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{m.message}</td>
                    <td>
                      <div className="admin-actions">
                        <button 
                          className="btn-action edit"
                          title="Toggle Read"
                          onClick={() => handleMarkMessageRead(m.id, m.read)}
                        >
                          <i className={m.read ? "fas fa-envelope-open" : "fas fa-envelope"} />
                        </button>
                        <button 
                          className="btn-action delete"
                          onClick={() => handleDeleteMessage(m.id)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No queries received yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {projectModal.open && (
        <div className="admin-modal-overlay">
          <div className="glass-panel admin-modal">
            <h3 className="admin-modal-title">{projectModal.isEdit ? 'Modify Project' : 'Create Project'}</h3>
            <form onSubmit={handleSaveProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={projectModal.data.name}
                  onChange={(e) => setProjectModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                />
              </div>
              <div className="form-group">
                <label>Short Description (Bio)</label>
                <textarea 
                  className="form-control" 
                  required
                  value={projectModal.data.bio}
                  onChange={(e) => setProjectModal(prev => ({ ...prev, data: { ...prev.data, bio: e.target.value } }))}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="https://unsplash.com/..."
                  value={projectModal.data.img}
                  onChange={(e) => setProjectModal(prev => ({ ...prev, data: { ...prev.data, img: e.target.value } }))}
                />
              </div>
              <div className="form-group">
                <label>Live Preview Link</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="#"
                  value={projectModal.data.previewLink || ''}
                  onChange={(e) => setProjectModal(prev => ({ ...prev, data: { ...prev.data, previewLink: e.target.value } }))}
                />
              </div>
              <div className="form-group">
                <label>Source Code Link</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="https://github.com/..."
                  value={projectModal.data.codeLink || ''}
                  onChange={(e) => setProjectModal(prev => ({ ...prev, data: { ...prev.data, codeLink: e.target.value } }))}
                />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required
                  value={projectModal.data.display_order}
                  onChange={(e) => setProjectModal(prev => ({ ...prev, data: { ...prev.data, display_order: parseInt(e.target.value) || 0 } }))}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setProjectModal(prev => ({ ...prev, open: false }))}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {skillModal.open && (
        <div className="admin-modal-overlay">
          <div className="glass-panel admin-modal">
            <h3 className="admin-modal-title">{skillModal.isEdit ? 'Modify Skill' : 'Create Skill'}</h3>
            <form onSubmit={handleSaveSkill}>
              <div className="form-group">
                <label>Skill Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="React"
                  value={skillModal.data.name}
                  onChange={(e) => setSkillModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-control"
                  value={skillModal.data.category}
                  onChange={(e) => setSkillModal(prev => ({ ...prev, data: { ...prev.data, category: e.target.value } }))}
                >
                  <option value="primary">Primary Skills</option>
                  <option value="secondary">Secondary Skills</option>
                  <option value="strength">Strengths</option>
                </select>
              </div>
              <div className="form-group">
                <label>Icon CSS Class (FontAwesome)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="fab fa-react"
                  value={skillModal.data.icon_class}
                  onChange={(e) => setSkillModal(prev => ({ ...prev, data: { ...prev.data, icon_class: e.target.value } }))}
                />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required
                  value={skillModal.data.display_order}
                  onChange={(e) => setSkillModal(prev => ({ ...prev, data: { ...prev.data, display_order: parseInt(e.target.value) || 0 } }))}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setSkillModal(prev => ({ ...prev, open: false }))}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
