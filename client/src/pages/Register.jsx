import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import vimage from '../assets/vimage.png';


const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await register(formData.name, formData.email, formData.password);
    setSubmitting(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="auth-view-lite">
      <div className="bg-vortex" />
      
      <div className="auth-card-lite glass-panel animate-fade">
        <header className="auth-lite-header">
           <div className="lite-logo">
             <img src={vimage} alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
           </div>
           <h1>Create Workspace</h1>
           <p>Join our professional platform and manage missions with AI.</p>
        </header>

        {authError && (
          <div className="auth-lite-err animate-fade">
             <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-lite-form">
          <div className="l-field">
            <label>Professional Name</label>
            <div className="l-input-wrapper">
               <User size={16} className="l-icon" />
               <input 
                type="text" 
                className="input-style l-pad"
                placeholder="First Last"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="l-field">
            <label>Corporate Email</label>
            <div className="l-input-wrapper">
               <Mail size={16} className="l-icon" />
               <input 
                type="email" 
                className="input-style l-pad"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="l-field">
            <label>Security Password</label>
            <div className="l-input-wrapper">
               <Lock size={16} className="l-icon" />
               <input 
                type="password" 
                className="input-style l-pad"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full shadow-indigo" disabled={submitting}>
            {submitting ? 'Registering...' : (
              <>Register Now <ArrowRight size={18} className="ml-2" /></>
            )}
          </button>
        </form>

        <footer className="auth-lite-foot">
          <p>Already joined? <Link to="/login" className="link-indigo">Sign in here</Link></p>
        </footer>
      </div>

      <style>{`
        .auth-view-lite { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: #f8fafc; }
        .auth-card-lite { width: 100%; max-width: 440px; padding: 3.5rem; background: #ffffff; border-radius: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .auth-lite-header { text-align: center; margin-bottom: 2.5rem; }
        .lite-logo { width: 48px; height: 48px; background: #6366f1; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }
        .auth-lite-header h1 { font-size: 1.75rem; color: #0f172a; margin-bottom: 0.5rem; font-weight: 800; }
        .auth-lite-header p { color: #64748b; font-size: 0.9rem; line-height: 1.5; }
        
        .auth-lite-err { background: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 0.85rem; text-align: center; margin-bottom: 2rem; color: #ef4444; font-size: 0.85rem; font-weight: 600; }
        .auth-lite-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .l-field label { display: block; font-size: 0.75rem; font-weight: 800; color: #64748b; margin-bottom: 0.6rem; text-transform: uppercase; }
        .l-input-wrapper { position: relative; }
        .l-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .l-pad { padding-left: 2.75rem; }
        
        .w-full { width: 100%; margin-top: 1rem; padding: 0.9rem; font-size: 1rem; }
        .auth-lite-foot { text-align: center; margin-top: 2.5rem; color: #64748b; font-size: 0.9rem; font-weight: 500; }
        .link-indigo { color: #6366f1; text-decoration: none; font-weight: 700; margin-left: 5px; }
        .link-indigo:hover { text-decoration: underline; }
        .shadow-indigo { box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35); }
      `}</style>
    </div>
  );
};

export default Register;
