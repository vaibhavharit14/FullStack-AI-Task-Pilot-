import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Plus, LogOut, CheckCircle2, Circle, Clock, Trash2, 
  Sparkles, Filter, LayoutGrid, Calendar as CalendarIcon,
  AlertCircle, Menu, Search, Settings, X, Edit3, Loader2
} from 'lucide-react';
import vimage from '../assets/vimage.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', generateAI: true
  });
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setAiLoading(taskForm.generateAI);
    try {
      const res = await axios.post(`${API_URL}/tasks`, {
        ...taskForm,
        id: editingTask?._id
      });
      if (editingTask) {
        setTasks(tasks.map(t => t._id === res.data._id ? res.data : t));
      } else {
        setTasks([res.data, ...tasks]);
      }
      closeModal();
    } catch (err) {
      alert('Error processing task');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      alert('Error removing task');
    }
  };

  const toggleStatus = async (task, e) => {
    e.stopPropagation();
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await axios.post(`${API_URL}/tasks`, {
        ...task,
        id: task._id,
        status: nextStatus,
        generateAI: false
      });
      setTasks(tasks.map(t => t._id === res.data._id ? res.data : t));
    } catch (err) {
      console.error('Status sync failed');
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        generateAI: false
      });
    } else {
      setEditingTask(null);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', generateAI: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeCategory === 'All' || 
     (activeCategory === 'In Progress' && t.status !== 'completed') ||
     (activeCategory === 'Completed' && t.status === 'completed'))
  );

  return (
    <div className="dashboard-root">
      <div className="bg-vortex" />
      

      <aside className="main-sidebar">
        <div className="sidebar-brand">
          <div className="logo-circ">
            <img src={vimage} alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          <h2>ProTask <span className="text-light-mute">Lite</span></h2>
        </div>

        <nav className="nav-menu">
           <p className="menu-group-label">OVERVIEW</p>
           <button className={`nav-link ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => setActiveCategory('All')}>
             <LayoutGrid size={17} /> Dashboard
           </button>
           <button className={`nav-link ${activeCategory === 'In Progress' ? 'active' : ''}`} onClick={() => setActiveCategory('In Progress')}>
             <Clock size={17} /> In Progress
           </button>
           <button className={`nav-link ${activeCategory === 'Completed' ? 'active' : ''}`} onClick={() => setActiveCategory('Completed')}>
             <CheckCircle2 size={17} /> Completed
           </button>
           <p className="menu-group-label mt-6">PREFERENCES</p>
           <button className="nav-link"><Settings size={17} /> Settings</button>
        </nav>

        <div className="sidebar-user-block">
           <div className="user-vatar">{user?.name?.charAt(0)}</div>
           <div className="user-v-info">
             <p className="u-v-name">{user?.name}</p>
             <p className="u-v-role">Standard User</p>
           </div>
           <button className="logout-btn-lite" title="Sign out" onClick={logout}><LogOut size={16} /></button>
        </div>
      </aside>


      <main className="main-viewport">
        <header className="header-bar animate-fade">
          <div className="search-box-lite">
             <Search size={14} className="s-icon" />
             <input 
                type="text" placeholder="Search mission..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <button className="btn btn-primary shadow-indigo" onClick={() => openModal()}>
            <Plus size={16} /> New Goal
          </button>
        </header>


        <section className="dashboard-stats animate-fade">
           <div className="lite-stat glass-panel">
              <span className="l-stat-label">OPEN JOBS</span>
              <p className="l-stat-value">{tasks.filter(t => t.status !== 'completed').length}</p>
           </div>
           <div className="lite-stat glass-panel">
              <span className="l-stat-label">COMPLETED</span>
              <p className="l-stat-value text-green">{tasks.filter(t => t.status === 'completed').length}</p>
           </div>
           <div className="lite-stat glass-panel">
              <span className="l-stat-label">TOTAL MISSION</span>
              <p className="l-stat-value">{tasks.length}</p>
           </div>
        </section>


        <div className="task-ecosystem animate-fade">
          {loading ? (
             <div className="loader-centered">
               <Loader2 className="spin text-indigo" />
               <p className="mt-4">Fetching your objectives...</p>
             </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state-lite glass-panel">
              <AlertCircle size={32} className="text-light-mute mb-4" />
              <h3>No tasks found here</h3>
              <p>Start your journey by adding a nre objective today.</p>
              <button className="btn btn-secondary mt-4" onClick={() => openModal()}>Create Now</button>
            </div>
          ) : (
            <div className="task-grid-lite">
              {filteredTasks.map(task => (
                <div key={task._id} className={`task-lite-card glass-panel ${task.status}`} onClick={() => openModal(task)}>
                   <div className="l-card-header">
                      <button className={`l-status-btn ${task.status}`} onClick={(e) => toggleStatus(task, e)}>
                         {task.status === 'completed' ? <CheckCircle2 size={20} className="text-green" /> : <Circle size={20} />}
                      </button>
                      <div className="l-card-badges">
                        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                        <button className="l-card-del" onClick={(e) => handleDelete(task._id, e)}><Trash2 size={15} /></button>
                      </div>
                   </div>
                   
                   <div className="l-card-body">
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                   </div>

                   {task.aiTip && (
                     <div className="l-ai-block animate-fade">
                        <div className="l-ai-header">
                          <Sparkles size={11} className="text-indigo" />
                          <span>AI STRATEGY</span>
                        </div>
                        <p>{task.aiTip}</p>
                     </div>
                   )}

                   <div className="l-card-footer">
                      <span><CalendarIcon size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                      <span className="l-edit-trigger"><Edit3 size={12} /> View</span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>


      {isModalOpen && (
        <div className="modal-lite-overlay animate-fade">
          <div className="modal-lite-card glass-panel animate-fade">
            <header className="m-l-header">
              <h3>{editingTask ? 'Edit Mission' : 'New Objective'}</h3>
              <button className="m-l-close" onClick={closeModal}><X size={20} /></button>
            </header>
            
            <form onSubmit={handleCreateOrUpdate} className="m-l-form">
              <div className="m-group">
                <label>Mission Title</label>
                <input 
                  type="text" className="input-style" 
                  placeholder="Task title..."
                  value={taskForm.title} 
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="m-group">
                <label>Description</label>
                <textarea 
                  className="input-style" rows="3"
                  placeholder="Tell me more..."
                  value={taskForm.description} 
                  onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="m-row">
                <div className="m-group flex-1">
                  <label>Priority Impact</label>
                  <select 
                    className="input-style" 
                    value={taskForm.priority} 
                    onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                  >
                    <option value="low">Low Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="high">Critical Impact</option>
                  </select>
                </div>
                <div className="m-group flex-1">
                  <label>Timeline Goal</label>
                  <input 
                    type="date" className="input-style" 
                    value={taskForm.dueDate} 
                    onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} 
                  />
                </div>
              </div>

              {!editingTask && (
                <div className="m-ai-toggle">
                   <div className="m-toggle-text">
                      <Sparkles size={16} className="text-secondary" />
                      <div>
                        <strong>Activate AI Coach</strong>
                        <p>Generate productivity breakdown</p>
                      </div>
                   </div>
                   <input 
                    type="checkbox" className="custom-chk-lite"
                    checked={taskForm.generateAI} 
                    onChange={e => setTaskForm({...taskForm, generateAI: e.target.checked})}
                  />
                </div>
              )}

              <footer className="m-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary shadow-indigo" disabled={aiLoading}>
                  {aiLoading ? <Loader2 size={16} className="spin" /> : (editingTask ? 'Save Changes' : 'Ignite Mission')}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-root { display: flex; min-height: 100vh; background: #f8fafc; }
        
        .main-sidebar { width: 260px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 2rem 1.5rem; position: sticky; top: 0; height: 100vh; }
        .sidebar-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 2.5rem; }
        .logo-circ { width: 36px; height: 36px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3); }
        .sidebar-brand h2 { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .text-light-mute { color: #94a3b8; font-weight: 400; font-size: 0.9rem; }
        
        .nav-menu { flex: 1; }
        .menu-group-label { font-size: 0.65rem; font-weight: 800; color: #64748b; letter-spacing: 0.05rem; margin-bottom: 0.75rem; padding-left: 0.5rem; }
        .nav-link { width: 100%; text-align: left; background: transparent; border: none; padding: 0.75rem 1rem; color: #64748b; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 10px; cursor: pointer; border-radius: 8px; transition: all 0.2s; margin-bottom: 4px; }
        .nav-link:hover { background: #f1f5f9; color: #0f172a; }
        .nav-link.active { background: #eff6ff; color: var(--primary); }
        .mt-6 { margin-top: 2rem; }
        
        .sidebar-user-block { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
        .user-vatar { width: 36px; height: 36px; background: #f1f5f9; color: #6366f1; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid #e2e8f0; }
        .user-v-info { flex: 1; overflow: hidden; }
        .u-v-name { font-size: 0.85rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .u-v-role { font-size: 0.7rem; color: #94a3b8; font-weight: 600; }
        .logout-btn-lite { background: transparent; border: none; color: #94a3b8; cursor: pointer; transition: 0.2s; }
        .logout-btn-lite:hover { color: #f43f5e; }

        .main-viewport { flex: 1; padding: 3rem 4rem; overflow-y: auto; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .search-box-lite { position: relative; width: 320px; }
        .s-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-box-lite input { width: 100%; background: #fff; border: 1px solid #e2e8f0; padding: 0.7rem 1rem 0.7rem 2.75rem; border-radius: 10px; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
        .search-box-lite input:focus { border-color: #cbd5e1; }
        .shadow-indigo { box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); }

        .dashboard-stats { display: flex; gap: 1.5rem; margin-bottom: 3.5rem; }
        .lite-stat { flex: 1; padding: 1.5rem; text-align: center; border-radius: 16px; border: 1px solid #e2e8f0; }
        .l-stat-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.05em; display: block; margin-bottom: 6px; }
        .l-stat-value { font-size: 2.25rem; font-weight: 800; line-height: 1; color: #0f172a; }
        .text-green { color: #10b981; }
        .text-indigo { color: #6366f1; }

        .task-grid-lite { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .task-lite-card { padding: 1.75rem; border-radius: 20px; transition: all 0.2s; cursor: pointer; display: flex; flex-direction: column; min-height: 240px; }
        .task-lite-card.completed { border-color: #f1f5f9; background: #fafafa; }
        .task-lite-card.completed h3 { text-decoration: line-through; color: #94a3b8; }
        .l-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
        .l-status-btn { background: transparent; border: none; cursor: pointer; color: #cbd5e1; padding: 0; outline: none; }
        .l-card-badges { display: flex; align-items: center; gap: 12px; }
        .l-card-del { background: transparent; border: none; color: #f1f5f9; cursor: pointer; transition: all 0.2s; }
        .task-lite-card:hover .l-card-del { color: #fecaca; }
        .l-card-del:hover { color: #f43f5e !important; }

        .l-card-body h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: #0f172a; font-weight: 700; }
        .l-card-body p { font-size: 0.85rem; color: #64748b; line-height: 1.6; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }

        .l-ai-block { background: #f5f3ff; border: 1px solid #e0e7ff; padding: 1rem; border-radius: 14px; margin-bottom: 1.5rem; }
        .l-ai-header { display: flex; align-items: center; gap: 6px; font-size: 0.65rem; font-weight: 950; color: var(--primary); letter-spacing: 0.05em; margin-bottom: 6px; }
        .l-ai-block p { font-size: 0.8rem; color: #4338ca; line-height: 1.5; font-style: italic; }

        .l-card-footer { margin-top: auto; border-top: 1px solid #f1f5f9; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
        .l-edit-trigger { color: var(--primary); opacity: 0; transition: opacity 0.2s; font-weight: 700; }
        .task-lite-card:hover .l-edit-trigger { opacity: 1; }

        .modal-lite-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-lite-card { width: 100%; max-width: 500px; padding: 2.5rem; background: #fff; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .m-l-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .m-l-close { background: transparent; border: none; color: #94a3b8; cursor: pointer; transition: color 0.2s; }
        .m-l-close:hover { color: #1e293b; }
        .m-group { margin-bottom: 1.5rem; }
        .m-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #64748b; margin-bottom: 0.6rem; text-transform: uppercase; }
        .m-row { display: flex; gap: 1.5rem; }
        .flex-1 { flex: 1; }

        .m-ai-toggle { background: #fdf2f8; border: 1px solid #fce7f3; border-radius: 16px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .m-toggle-text strong { display: block; font-size: 0.85rem; color: #db2777; margin-top: 4px; }
        .m-toggle-text p { font-size: 0.72rem; color: #be185d; opacity: 0.7; }
        .custom-chk-lite { width: 22px; height: 22px; accent-color: #db2777; cursor: pointer; }

        .m-footer { display: flex; align-items: center; gap: 1rem; border-top: 1px solid #f1f5f9; padding-top: 2rem; }
        .loader-centered { text-align: center; padding: 6rem; color: #64748b; }
        .empty-state-lite { padding: 5rem; text-align: center; }
        .empty-state-lite h3 { margin: 1.5rem 0 0.5rem; font-size: 1.25rem; }
        .empty-state-lite p { color: #94a3b8; font-size: 0.9rem; }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .mb-4 { margin-bottom: 1rem; }
      `}</style>
    </div>
  );
};

export default Dashboard;
