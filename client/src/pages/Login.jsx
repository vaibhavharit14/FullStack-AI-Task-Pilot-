import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import vimage from '../assets/vimage.png';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login, authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(formData.email, formData.password);
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
           <h1>Welcome Back</h1>
           <p>Enter your credentials to access your ProTask dashboard.</p>
        </header>

        {authError && (
          <div className="auth-lite-err animate-fade">
             <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-lite-form">
          <div className="l-field">
            <label>Business Email</label>
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
            <label>Secure Password</label>
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
            {submitting ? 'Authenticating...' : (
              <>Sign in <ArrowRight size={18} className="ml-2" /></>
            )}
          </button>

          <button 
            type="button" 
            className="btn btn-secondary w-full mt-4 border-dashed"
            onClick={() => login('demo@example.com', 'demo123').then(() => navigate('/dashboard'))}
          >
            <Sparkles size={18} className="text-indigo" /> Demo Recruiter Access
          </button>
        </form>

        <footer className="auth-lite-foot">
          <p>Don't have an account? <Link to="/register" className="link-indigo">Sign up for free</Link></p>
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
        .border-dashed { border: 2px dashed #e2e8f0 !important; }
        .mt-4 { margin-top: 1rem; }
      `}</style>
    </div>
  );
};

export default Login;
