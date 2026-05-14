'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function AdminDashboard() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Data States
  const [stats, setStats] = useState({ resumeDownloads: 0 });
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      verifyAndFetch(savedKey);
    }
  }, []);

  const verifyAndFetch = async (key) => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        headers: { 'x-api-key': key }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_api_key', key);
        fetchAllData(key);
      } else {
        setMessage({ text: 'Invalid API Key', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error connecting to server', type: 'error' });
    }
    setLoading(false);
  };

  const fetchAllData = async (key) => {
    const headers = { 'x-api-key': key || apiKey };
    
    // Stats
    fetch('/api/analytics/resume').then(res => res.json()).then(data => setStats({ resumeDownloads: data.count || 0 }));
    
    // Profile
    fetch(`/api/profile?t=${Date.now()}`).then(res => res.json()).then(data => setProfile(data));
    
    // Projects
    fetch('/api/projects').then(res => res.json()).then(data => setProjects(data));
    
    // Experience
    fetch('/api/experience').then(res => res.json()).then(data => setExperience(data));

    // Skills
    fetch('/api/skills').then(res => res.json()).then(data => setSkills(data));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    verifyAndFetch(apiKey);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_api_key');
    setApiKey('');
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const apiCall = async (url, method, body) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(isEditing ? 'Updated successfully' : 'Created successfully');
        resetForm();
        fetchAllData();
        return data;
      } else {
        showMessage(data.error || 'Operation failed', 'error');
      }
    } catch (err) {
      showMessage('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    // Profile tab: restore saved data. All other tabs: clear to blank.
    if (activeTab === 'profile') {
      reset(profile);
    } else {
      // Force a full clear including selects by resetting each key to ''
      reset({
        title: '', subTitle: '', period: '', link: '', imageUrl: '',
        award: '', description: '', features: '', techStack: '', order: '',
        category: '', role: '', company: '', location: '',
        name: '', icon: '', type: ''
      });
    }
  };

  const startEdit = (item) => {
    const formattedDescription = Array.isArray(item.description) 
      ? item.description.join('\n') 
      : (item.description || '');

    const baseData = { ...item, description: formattedDescription };
    
    if (activeTab === 'projects') {
      if (Array.isArray(item.features)) baseData.features = item.features.join('\n');
      if (Array.isArray(item.techStack)) baseData.techStack = item.techStack.join(', ');
    }
    
    reset(baseData);
    setIsEditing(true);
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // Populate the form whenever the profile tab is active and profile data is ready
  useEffect(() => {
    if (activeTab === 'profile' && profile && Object.keys(profile).length > 0) {
      reset(profile);
    }
  }, [activeTab, profile]);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('field', field);

    setLoading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-api-key': apiKey },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setProfile({ ...profile, [field]: data.url });
        setValue(field, data.url);
        showMessage('File uploaded successfully');
      } else {
        showMessage(data.error || 'Upload failed', 'error');
      }
    } catch (err) {
      showMessage('Upload error', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <style jsx>{`
          .admin-login { height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: white; }
          .login-card { background: #1e293b; padding: 3rem; border-radius: 1.5rem; width: 100%; max-width: 400px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
          h1 { margin-bottom: 2rem; font-size: 1.8rem; font-weight: 900; color: #3b82f6; }
          input { width: 100%; padding: 1rem; margin-bottom: 1.5rem; background: #0f172a; border: 1px solid #334155; border-radius: 0.75rem; color: white; outline: none; }
          button { width: 100%; padding: 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.75rem; cursor: pointer; font-weight: 800; }
        `}</style>
        <div className="login-card">
          <h1>ADMIN ACCESS</h1>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Passphrase" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Login'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <style jsx>{`
        :global(html, body) { padding: 0 !important; margin: 0 !important; background-image: none !important; }
        .admin-root { display: flex; min-height: 100vh; background: #0f172a; color: #f1f5f9; font-family: 'Inter', sans-serif; overflow: hidden; }
        
        .sidebar { width: 280px; background: #020617; border-right: 1px solid #1e293b; height: 100vh; flex-shrink: 0; display: flex; flex-direction: column; padding: 1.5rem; position: sticky; top: 0; }
        .logo { font-size: 1.1rem; font-weight: 900; color: #818cf8; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.5rem; }
        
        .nav-section { margin-bottom: 2rem; }
        .nav-title { font-size: 0.6rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem; padding-left: 0.5rem; }
        .nav-link { padding: 0.75rem 1rem; border-radius: 0.5rem; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.85rem; color: #94a3b8; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; }
        .nav-link:hover { background: #1e293b; color: white; }
        .nav-link.active { background: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
        
        .content-area { flex: 1; padding: 2.5rem; height: 100vh; overflow-y: auto; background: #0f172a; scrollbar-width: none; -ms-overflow-style: none; }
        .content-area::-webkit-scrollbar { display: none; }
        .content-container { width: 100%; max-width: 1200px; margin: 0 auto; }
        
        .card { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(10px); border-radius: 1rem; border: 1px solid #334155; padding: 2.5rem; margin-bottom: 2rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .card-title { font-size: 1rem; font-weight: 800; margin-bottom: 2rem; color: #f1f5f9; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
        .card-title i { color: #818cf8; }
        
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .stat-box { background: #1e293b; padding: 1.5rem; border-radius: 1rem; border: 1px solid #334155; transition: 0.3s; }
        .stat-box:hover { transform: translateY(-5px); border-color: #6366f1; }
        .stat-label { font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .stat-value { font-size: 2rem; font-weight: 900; color: white; }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .input-wrap { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .input-wrap label { display: block; font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.025em; }
        input, select, textarea { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 0.5rem; padding: 0.85rem 1rem; color: white; transition: 0.2s; font-family: inherit; font-size: 0.95rem; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); background: #020617; }
        
        .btn { padding: 0.85rem 1.5rem; border-radius: 0.5rem; font-weight: 700; cursor: pointer; transition: 0.2s; border: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem; }
        .btn-blue { background: #4f46e5; color: white; }
        .btn-blue:hover { background: #4338ca; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); }
        .btn-gray { background: #334155; color: #f1f5f9; }
        .btn-gray:hover { background: #475569; }
        
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border-radius: 0.75rem; background: rgba(15, 23, 42, 0.5); margin-bottom: 0.75rem; border: 1px solid transparent; transition: 0.2s; }
        .item-row:hover { border-color: #334155; background: #0f172a; }
        .item-info h4 { margin: 0; font-size: 1rem; font-weight: 700; color: #f1f5f9; }
        .item-info p { margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #64748b; font-weight: 500; }
        
        .item-actions { display: flex; gap: 0.5rem; }
        .action-icon { width: 36px; height: 36px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; background: #1e293b; border: 1px solid #334155; }
        .action-icon.edit { color: #818cf8; }
        .action-icon.edit:hover { background: #4f46e5; color: white; border-color: #4f46e5; }
        .action-icon.delete { color: #f87171; }
        .action-icon.delete:hover { background: #ef4444; color: white; border-color: #ef4444; }
        
        .logout { margin-top: auto; color: #f87171; font-weight: 800; cursor: pointer; padding: 1rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; }
        .logout:hover { background: rgba(239, 68, 68, 0.05); border-radius: 0.75rem; }
      `}</style>

      <aside className="sidebar">
        <div className="logo"><i className="fas fa-terminal"></i> THABO.CORE</div>
        
        <div className="nav-section">
          <div className="nav-title">General</div>
          <div className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="fas fa-chart-pie"></i> Overview
          </div>
          <div className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <i className="fas fa-user-circle"></i> Profile
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-title">Experience</div>
          <div className={`nav-link ${activeTab === 'exp-work' ? 'active' : ''}`} onClick={() => { setActiveTab('exp-work'); resetForm(); }}>
            <i className="fas fa-briefcase"></i> Work history
          </div>
          <div className={`nav-link ${activeTab === 'exp-edu' ? 'active' : ''}`} onClick={() => { setActiveTab('exp-edu'); resetForm(); }}>
            <i className="fas fa-graduation-cap"></i> Education
          </div>
          <div className={`nav-link ${activeTab === 'exp-ach' ? 'active' : ''}`} onClick={() => { setActiveTab('exp-ach'); resetForm(); }}>
            <i className="fas fa-trophy"></i> Achievements
          </div>
          <div className={`nav-link ${activeTab === 'exp-vol' ? 'active' : ''}`} onClick={() => { setActiveTab('exp-vol'); resetForm(); }}>
            <i className="fas fa-hand-holding-heart"></i> Voluntary
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-title">Content</div>
          <div className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => { setActiveTab('projects'); resetForm(); }}>
            <i className="fas fa-folder"></i> Projects
          </div>
          <div className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => { setActiveTab('skills'); resetForm(); }}>
            <i className="fas fa-tools"></i> Skills
          </div>
        </div>

        <div className="logout" onClick={handleLogout}><i className="fas fa-power-off"></i> Logout</div>
      </aside>

      <main className="content-area">
        <div className="content-container">
        {activeTab === 'overview' && (
          <div className="overview-container">
            {/* Welcome Hero */}
            <div className="hero-banner" style={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
              borderRadius: '1.5rem', 
              padding: '3rem', 
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px -15px rgba(79, 70, 229, 0.4)'
            }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}>Welcome back, Thabo</h2>
                <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>Your portfolio is currently live and synchronized with the global edge network.</p>
              </div>
              {/* Decorative elements */}
              <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 1 }}></div>
              <div style={{ position: 'absolute', right: '100px', bottom: '-80px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', zIndex: 1 }}></div>
            </div>

            {/* Stats Row */}
            <div className="stats-row" style={{ marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #334155', position: 'relative' }}>
                <div style={{ width: '45px', height: '45px', background: 'rgba(79, 70, 229, 0.1)', color: '#818cf8', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                   <i className="fas fa-eye" style={{ margin: 'auto' }}></i>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Resume Views</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{stats.resumeDownloads || 0}</div>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', height: '8px', width: '8px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }}></div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #334155' }}>
                <div style={{ width: '45px', height: '45px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                   <i className="fas fa-project-diagram" style={{ margin: 'auto' }}></i>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Total Projects</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{projects.length}</div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #334155' }}>
                <div style={{ width: '45px', height: '45px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                   <i className="fas fa-history" style={{ margin: 'auto' }}></i>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Timeline Nodes</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{experience.length}</div>
              </div>

              <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #334155' }}>
                <div style={{ width: '45px', height: '45px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                   <i className="fas fa-terminal" style={{ margin: 'auto' }}></i>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Total Skills</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{skills.length}</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <div className="card-title"><i className="fas fa-shield-alt"></i> Control Center</div>
                <div className="status-grid" style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ background: '#1e293b', padding: '1rem 1.25rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Database Cluster</span>
                    </div>
                    <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Healthy</span>
                  </div>
                  <div style={{ background: '#1e293b', padding: '1rem 1.25rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Cloudinary CDN</span>
                    </div>
                    <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Operational</span>
                  </div>
                  <div style={{ background: '#1e293b', padding: '1rem 1.25rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></div>
                      <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Email Service</span>
                    </div>
                    <span style={{ color: '#3b82f6', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Standby</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(30, 41, 59, 0.5) 100%)' }}>
                <div className="card-title" style={{ color: '#818cf8' }}><i className="fas fa-bolt"></i> Quick Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button className="btn btn-gray" style={{ background: '#1e293b', justifyContent: 'flex-start', padding: '1rem' }} onClick={() => setActiveTab('projects')}>
                    <i className="fas fa-plus"></i> New Project
                  </button>
                  <button className="btn btn-gray" style={{ background: '#1e293b', justifyContent: 'flex-start', padding: '1rem' }} onClick={() => setActiveTab('skills')}>
                    <i className="fas fa-layer-group"></i> Manage Skills
                  </button>
                  <button className="btn btn-gray" style={{ background: '#1e293b', justifyContent: 'flex-start', padding: '1rem' }} onClick={() => setActiveTab('profile')}>
                    <i className="fas fa-address-card"></i> Profile Settings
                  </button>
                  <button className="btn btn-blue" style={{ justifyContent: 'flex-start', padding: '1rem' }} onClick={() => window.open('/', '_blank')}>
                    <i className="fas fa-external-link-alt"></i> View Website
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-title"><i className="fas fa-user-edit"></i> Edit Profile</div>
            <form onSubmit={handleSubmit((data) => apiCall('/api/profile', 'PUT', data))}>
              <div className="grid-2">
                <div className="input-wrap"><label>First Name</label><input {...register('firstName')} /></div>
                <div className="input-wrap"><label>Last Name</label><input {...register('lastName')} /></div>
              </div>
              <div className="grid-2">
                <div className="input-wrap"><label>Title</label><input {...register('title')} /></div>
                <div className="input-wrap"><label>Role</label><input {...register('role')} /></div>
              </div>
              <div className="grid-2">
                <div className="input-wrap"><label>Email</label><input {...register('email')} /></div>
                <div className="input-wrap"><label>Phone</label><input {...register('phone')} /></div>
              </div>
              <div className="grid-2">
                <div className="input-wrap"><label>Location</label><input {...register('location')} /></div>
                <div className="input-wrap">
                  <label>Profile Image</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      style={{ flex: 1 }}
                      {...register('profileImageUrl')}
                      placeholder="Cloudinary URL (auto-filled on upload)"
                    />
                    <input type="file" accept="image/*" style={{ display: 'none' }} id="img-upload" onChange={(e) => handleFileUpload(e, 'profileImageUrl')} />
                    <button type="button" className="btn btn-gray" style={{ padding: '0 1rem' }} onClick={() => document.getElementById('img-upload').click()}>
                      <i className="fas fa-upload"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <div className="input-wrap"><label>LinkedIn URL</label><input {...register('linkedinUrl')} /></div>
                <div className="input-wrap"><label>GitHub URL</label><input {...register('githubUrl')} /></div>
              </div>
              <div className="grid-2">
                <div className="input-wrap">
                  <label>Resume URL</label>
                  <input
                    {...register('resumeUrl')}
                    placeholder="Paste Google Drive or Dropbox share link"
                  />
                </div>
              </div>
              <div className="input-wrap"><label>Mission Description</label><textarea rows="3" {...register('missionDescription')} /></div>
              <div className="input-wrap"><label>Detailed Professional Bio</label><textarea rows="6" {...register('bio')} /></div>
              <button type="submit" className="btn btn-blue" disabled={loading}>{loading ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (() => {
          const onSubmit = handleSubmit((data) => {
            if (typeof data.features === 'string') data.features = data.features.split('\n').filter(l => l.trim());
            if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map(s => s.trim()).filter(Boolean);
            const method = isEditing ? 'PUT' : 'POST';
            const payload = isEditing ? { ...data, id: editId } : data;
            apiCall('/api/projects', method, payload).then(() => resetForm());
          });
          return (
            <>
              <div className="card">
                <div className="card-title"><i className="fas fa-plus"></i> {isEditing ? 'Edit Project' : 'New Project'}</div>
                <form onSubmit={onSubmit}>
                  <div className="grid-2">
                    <div className="input-wrap"><label>Title</label><input {...register('title', { required: true })} /></div>
                    <div className="input-wrap"><label>Sub-title / Role</label><input {...register('subTitle')} /></div>
                  </div>
                  <div className="grid-2">
                    <div className="input-wrap"><label>Period</label><input placeholder="e.g., Jan 2024 – Present" {...register('period')} /></div>
                    <div className="input-wrap"><label>Project Link</label><input {...register('link')} /></div>
                  </div>
                  <div className="grid-2">
                    <div className="input-wrap">
                      <label>Image</label>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input style={{ flex: 1 }} placeholder="Image URL" {...register('imageUrl')} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} id="proj-img-upload" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                        <button type="button" className="btn btn-gray" style={{ padding: '0 1rem' }} onClick={() => document.getElementById('proj-img-upload').click()}><i className="fas fa-upload"></i></button>
                      </div>
                    </div>
                    <div className="input-wrap">
                      <label>Category</label>
                      <select {...register('category')}>
                        <option value="web">Web Development</option>
                        <option value="app">Mobile App</option>
                        <option value="infra">Infrastructure</option>
                        <option value="sec">Security</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-wrap"><label>Award / Achievement</label><input placeholder="Title: Description" {...register('award')} /></div>
                  <div className="input-wrap"><label>Description</label><textarea rows="3" {...register('description')} /></div>
                  <div className="input-wrap"><label>Key Features (one per line)</label><textarea rows="4" placeholder="Title: Description or just Feature" {...register('features')} /></div>
                  <div className="input-wrap"><label>Tech Stack (comma-separated)</label><input placeholder="Next.js, MongoDB, React" {...register('techStack')} /></div>
                  <div className="input-wrap"><label>Order</label><input type="number" {...register('order', { valueAsNumber: true })} /></div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-blue" disabled={loading}>{isEditing ? 'Save Changes' : 'Add Project'}</button>
                    {isEditing && <button type="button" className="btn btn-gray" onClick={resetForm}>Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="card">
                <div className="card-title"><i className="fas fa-folder-open"></i> All Projects</div>
                {projects.length > 0 ? projects.map(item => (
                  <div key={item._id} className="item-row">
                    <div className="item-info">
                      <h4>{item.title}</h4>
                      <p>{item.subTitle || item.category}</p>
                    </div>
                    <div className="item-actions">
                      <div className="action-icon edit" onClick={() => startEdit(item)}><i className="fas fa-edit"></i></div>
                      <div className="action-icon delete" onClick={() => apiCall(`/api/projects?id=${item._id}`, 'DELETE')}><i className="fas fa-trash"></i></div>
                    </div>
                  </div>
                )) : <p style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>No projects found. Add your first project above!</p>}
              </div>
            </>
          );
        })()}

        {/* ── SKILLS ── */}
        {activeTab === 'skills' && (() => {
          const onSubmit = handleSubmit((data) => {
            const method = isEditing ? 'PUT' : 'POST';
            const payload = isEditing ? { ...data, id: editId } : data;
            apiCall('/api/skills', method, payload).then(() => resetForm());
          });
          const fullNames = { infra: 'Infrastructure & Operating Systems', virt: 'Virtualization & Tools', prog: 'Programming & Web Technologies', db: 'Databases', sec: 'Security & IT Practices', soft: 'Soft Skills & Leadership' };
          return (
            <>
              <div className="card">
                <div className="card-title"><i className="fas fa-plus"></i> {isEditing ? 'Edit Skill' : 'New Skill'}</div>
                <form onSubmit={onSubmit}>
                  <div className="grid-2">
                    <div className="input-wrap"><label>Skill Name</label><input {...register('name', { required: true })} /></div>
                    <div className="input-wrap"><label>Icon (FontAwesome class)</label><input placeholder="fab fa-react" {...register('icon')} /></div>
                  </div>
                  <div className="grid-2">
                    <div className="input-wrap">
                      <label>Category</label>
                      <select {...register('category')}>
                        <option value="infra">Infrastructure & OS</option>
                        <option value="virt">Virtualization & Tools</option>
                        <option value="prog">Programming & Web</option>
                        <option value="db">Databases</option>
                        <option value="sec">Security & IT Practices</option>
                        <option value="soft">Soft Skills & Leadership</option>
                      </select>
                    </div>
                    <div className="input-wrap"><label>Order</label><input type="number" {...register('order', { valueAsNumber: true })} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-blue" disabled={loading}>{isEditing ? 'Save Changes' : 'Add Skill'}</button>
                    {isEditing && <button type="button" className="btn btn-gray" onClick={resetForm}>Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="card">
                <div className="card-title"><i className="fas fa-list"></i> All Skills by Category</div>
                {Object.entries(skills.reduce((acc, s) => { (acc[s.category || 'other'] = acc[s.category || 'other'] || []).push(s); return acc; }, {})).sort().map(([cat, items]) => (
                  <div key={cat} style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #1e293b' }}>{fullNames[cat] || cat}</div>
                    {items.map(item => (
                      <div key={item._id} className="item-row">
                        <div className="item-info"><h4>{item.name}</h4><p>{fullNames[item.category] || item.category}</p></div>
                        <div className="item-actions">
                          <div className="action-icon edit" onClick={() => startEdit(item)}><i className="fas fa-edit"></i></div>
                          <div className="action-icon delete" onClick={() => apiCall(`/api/skills?id=${item._id}`, 'DELETE')}><i className="fas fa-trash"></i></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          );
        })()}

        {/* ── EXPERIENCE TABS ── */}
        {['exp-work', 'exp-edu', 'exp-ach', 'exp-vol'].includes(activeTab) && (() => {
          const typeMap = { 'exp-work': 'work', 'exp-edu': 'education', 'exp-ach': 'achievement', 'exp-vol': 'voluntary' };
          const labelMap = { 'exp-work': 'Work History', 'exp-edu': 'Education', 'exp-ach': 'Achievements', 'exp-vol': 'Voluntary' };
          const iconMap = { 'exp-work': 'fa-briefcase', 'exp-edu': 'fa-graduation-cap', 'exp-ach': 'fa-trophy', 'exp-vol': 'fa-hand-holding-heart' };
          const expType = typeMap[activeTab];
          const label = labelMap[activeTab];
          const filtered = experience.filter(e => (e.type || 'work') === expType);

          const onSubmit = handleSubmit((data) => {
            if (typeof data.description === 'string') data.description = data.description.split('\n').filter(l => l.trim());
            data.type = expType;
            const method = isEditing ? 'PUT' : 'POST';
            const payload = isEditing ? { ...data, id: editId } : data;
            apiCall('/api/experience', method, payload).then(() => resetForm());
          });

          return (
            <>
              <div className="card">
                <div className="card-title"><i className={`fas ${iconMap[activeTab]}`}></i> {isEditing ? `Edit ${label} Entry` : `Add ${label} Entry`}</div>
                <form onSubmit={onSubmit}>
                  <div className="grid-2">
                    <div className="input-wrap"><label>{activeTab === 'exp-edu' ? 'Degree / Qualification' : 'Role / Title'}</label><input {...register('role', { required: true })} /></div>
                    <div className="input-wrap"><label>{activeTab === 'exp-edu' ? 'Institution' : 'Company / Organization'}</label><input {...register('company', { required: true })} /></div>
                  </div>
                  <div className="grid-2">
                    <div className="input-wrap"><label>Period</label><input placeholder="e.g., Jan 2022 – Present" {...register('period')} /></div>
                    <div className="input-wrap"><label>Location</label><input placeholder="e.g., Ontario, Canada" {...register('location')} /></div>
                  </div>
                  <div className="input-wrap"><label>Bullet Points (one per line)</label><textarea rows="6" placeholder="Enter each responsibility or achievement on a new line..." {...register('description')} /></div>
                  <div className="input-wrap"><label>Order</label><input type="number" {...register('order', { valueAsNumber: true })} /></div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-blue" disabled={loading}>{isEditing ? 'Save Changes' : `Add to ${label}`}</button>
                    {isEditing && <button type="button" className="btn btn-gray" onClick={resetForm}>Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="card">
                <div className="card-title"><i className={`fas ${iconMap[activeTab]}`}></i> {label} Entries</div>
                {filtered.length > 0 ? filtered.map(item => (
                  <div key={item._id} className="item-row">
                    <div className="item-info">
                      <h4>{item.role}</h4>
                      <p>{item.company}{item.period ? ` · ${item.period}` : ''}</p>
                    </div>
                    <div className="item-actions">
                      <div className="action-icon edit" onClick={() => startEdit(item)}><i className="fas fa-edit"></i></div>
                      <div className="action-icon delete" onClick={() => apiCall(`/api/experience?id=${item._id}`, 'DELETE')}><i className="fas fa-trash"></i></div>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: '#475569', textAlign: 'center', padding: '2rem' }}>No {label} records found. Add your first entry above!</p>
                )}
              </div>
            </>
          );
        })()}
        </div>
      </main>
    </div>
  );
}
