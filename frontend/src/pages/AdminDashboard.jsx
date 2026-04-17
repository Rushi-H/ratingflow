import { useState, useEffect } from 'react';
import { Users, Store, Star, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard className="text-primary" /> Admin Dashboard</h1>
      </div>
      
      {loading ? (
        <p className="text-center">Loading stats...</p>
      ) : (
        <div className="dashboard-grid">
          <div className="stat-card glass-panel">
            <Users className="text-primary mb-2" size={32} />
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          
          <div className="stat-card glass-panel">
            <Store className="text-success mb-2" size={32} />
            <div className="stat-value">{stats.totalStores}</div>
            <div className="stat-label">Total Stores</div>
          </div>
          
          <div className="stat-card glass-panel">
            <Star className="text-amber-400 mb-2" size={32} />
            <div className="stat-value">{stats.totalRatings}</div>
            <div className="stat-label">Total Ratings Submitted</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
