import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      if (res.data.role === 'admin') navigate('/admin/dashboard');
      else if (res.data.role === 'store_owner') navigate('/store-owner/dashboard');
      else navigate('/user/stores');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="page-container flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel p-8" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="app-title text-center mb-8 flex justify-center items-center gap-2">
          <LogIn /> RatingFlow
        </h2>
        
        {error && <div className="error-text text-center mb-4 p-2" style={{background: 'rgba(239,68,68,0.1)', borderRadius: '4px'}}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group mb-8">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full justify-center">
            Log In
          </button>
        </form>
        
        <p className="text-center mt-4 text-muted">
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
