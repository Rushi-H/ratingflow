import { useState, useEffect } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Table from '../components/Table';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await api.post('/admin/users', formData);
      setShowAdd(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (val) => <span style={{ textTransform: 'capitalize' }}>{val.replace('_', ' ')}</span> },
    { key: 'address', label: 'Address' },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <button onClick={() => handleDelete(row.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} title="Delete User">
        <Trash2 size={16} />
      </button>
    ) }
  ];

  return (
    <div className="page-container">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="text-primary" /> User Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : 'Add User'}</button>
      </div>

      {showAdd && (
        <div className="glass-panel p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit} className="dashboard-grid">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required/>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="user">User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input type="text" className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>Create User</button>
          </form>
        </div>
      )}

      {loading ? <p>Loading users...</p> : <Table columns={columns} data={users} filterable={['name', 'email', 'role']} />}
    </div>
  );
};

export default AdminUsers;
