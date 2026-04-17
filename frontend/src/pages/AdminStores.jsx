import { useState, useEffect } from 'react';
import { Store, Trash2 } from 'lucide-react';
import api from '../services/api';
import Table from '../components/Table';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerName: '', ownerEmail: '', ownerPassword: '', ownerAddress: '' });
  const [errors, setErrors] = useState({});

  const fetchStores = async () => {
    try {
      const { data } = await api.get('/admin/stores');
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      ownerName: validateName(formData.ownerName),
      ownerEmail: validateEmail(formData.ownerEmail),
      ownerPassword: validatePassword(formData.ownerPassword),
      ownerAddress: validateAddress(formData.ownerAddress)
    };
    if (Object.values(newErrors).some(err => err !== '')) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await api.post('/admin/stores', formData);
      setShowAdd(false);
      setFormData({ name: '', email: '', address: '', ownerName: '', ownerEmail: '', ownerPassword: '', ownerAddress: '' });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add store');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      await api.delete(`/admin/stores/${id}`);
      setStores(stores.filter(s => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete store');
    }
  };

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Store Email' },
    { key: 'averageRating', label: 'Rating', sortable: true, render: (val) => `${val}/5` },
    { key: 'owner_name', label: 'Owner', render: (val, row) => row.owner?.name },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <button onClick={() => handleDelete(row.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }} title="Delete Store">
        <Trash2 size={16} />
      </button>
    ) }
  ];

  return (
    <div className="page-container">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--primary)' }}><Store /> Store Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : 'Add Store & Owner'}</button>
      </div>

      {showAdd && (
        <div className="glass-panel p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Add Store & Store Owner</h2>
          <form onSubmit={handleSubmit} className="dashboard-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><h3 className="font-semibold text-primary">Store Details</h3></div>
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Store Email</label>
              <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Store Address</label>
              <input type="text" className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="form-group mt-4" style={{ gridColumn: '1 / -1' }}><h3 className="font-semibold text-primary">Owner Details</h3></div>
            <div className="form-group">
              <label className="form-label">Owner Name</label>
              <input type="text" className="input-field" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} required/>
              {errors.ownerName && <p className="error-text">{errors.ownerName}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Owner Email</label>
              <input type="email" className="input-field" value={formData.ownerEmail} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} required/>
              {errors.ownerEmail && <p className="error-text">{errors.ownerEmail}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Owner Password</label>
              <input type="password" className="input-field" value={formData.ownerPassword} onChange={e => setFormData({...formData, ownerPassword: e.target.value})} required/>
              {errors.ownerPassword && <p className="error-text">{errors.ownerPassword}</p>}
            </div>
            
            <button type="submit" className="btn btn-primary mt-4" style={{ gridColumn: '1 / -1' }}>Create Store & Owner</button>
          </form>
        </div>
      )}

      {loading ? <p>Loading stores...</p> : <Table columns={columns} data={stores} filterable={['name', 'email', 'address']} />}
    </div>
  );
};

export default AdminStores;
