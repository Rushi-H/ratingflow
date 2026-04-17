import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../services/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    // Validate
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      address: validateAddress(formData.address)
    };

    if (Object.values(newErrors).some(err => err !== '')) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      const res = await api.post('/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/user/stores');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="page-container flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel p-8" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="app-title text-center mb-8 flex justify-center items-center gap-2">
          <UserPlus /> Create Account
        </h2>
        
        {apiError && <div className="error-text text-center mb-4 p-2" style={{background: 'rgba(239,68,68,0.1)', borderRadius: '4px'}}>{apiError}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe (min 20 chars)"
              required
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group mb-8">
            <label className="form-label">Address (Optional)</label>
            <textarea
              name="address"
              className="input-field"
              style={{ resize: 'vertical' }}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>
          
          <button type="submit" className="btn btn-primary w-full justify-center">
            Sign Up
          </button>
        </form>
        
        <p className="text-center mt-4 text-muted">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
