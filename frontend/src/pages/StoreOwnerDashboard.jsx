import { useState, useEffect } from 'react';
import { Star, Users, Briefcase } from 'lucide-react';
import api from '../services/api';
import Table from '../components/Table';
import RatingStars from '../components/RatingStars';

const StoreOwnerDashboard = () => {
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0 });
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, ratingsRes] = await Promise.all([
          api.get('/store-owner/stats'),
          api.get('/store-owner/ratings')
        ]);
        setStats(statsRes.data);
        setRatings(ratingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const columns = [
    { key: 'user', label: 'User Name', sortable: true, render: (val) => val?.name },
    { key: 'user_email', label: 'User Email', sortable: true, render: (val, row) => row.user?.email },
    { key: 'store_name', label: 'Store Assessed', sortable: true, render: (val, row) => row.store?.name },
    { key: 'rating', label: 'Rating Given', sortable: true, render: (val) => <RatingStars rating={val} readOnly={true} /> },
    { key: 'created_at', label: 'Date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="page-container">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--primary)' }}><Briefcase /> Store Owner Dashboard</h1>
      </div>

      {loading ? (
        <p className="text-center">Loading dashboard...</p>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="stat-card glass-panel">
              <Star className="text-amber-400 mb-2" size={32} />
              <div className="stat-value">{stats.averageRating} <span className="text-muted text-lg">/ 5</span></div>
              <div className="stat-label">Average Store Rating</div>
            </div>
            <div className="stat-card glass-panel">
              <Users className="text-primary mb-2" size={32} />
              <div className="stat-value">{stats.totalRatings}</div>
              <div className="stat-label">Total Ratings Received</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-8">Recent Ratings</h2>
          <Table columns={columns} data={ratings} />
        </>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
