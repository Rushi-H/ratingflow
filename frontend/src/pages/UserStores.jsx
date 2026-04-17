import { useState, useEffect } from 'react';
import { Store as StoreIcon, Search, CheckCircle } from 'lucide-react';
import api from '../services/api';
import Table from '../components/Table';
import RatingStars from '../components/RatingStars';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStores = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/stores?search=${query}`);
      setStores(data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(search);
  };

  const handleRate = async (storeId, ratingVal) => {
    try {
      await api.post('/ratings', { storeId, rating: ratingVal });
      // Update local state to reflect rating immediately
      setStores(stores.map(store => {
        if (store.id === storeId) {
          return { ...store, myRating: ratingVal };
        }
        return store;
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'averageRating', label: 'Overall Rating', sortable: true, render: (val) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">{val}</span> / 5
      </div>
    )},
    { key: 'myRating', label: 'My Rating', render: (val, row) => (
      val ? (
        <div className="flex flex-col gap-1">
          <RatingStars rating={val} readOnly={true} />
          <span className="text-success text-sm flex items-center gap-1" style={{ fontSize: '0.8rem' }}><CheckCircle size={14}/> Rated</span>
        </div>
      ) : (
        <RatingStars rating={0} onChange={(r) => handleRate(row.id, r)} />
      )
    )},
  ];

  return (
    <div className="page-container">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--primary)' }}><StoreIcon /> Store Directory</h1>
        <span className="text-muted">User Portal</span>
      </div>

      <div className="glass-panel p-4 mb-8" style={{ padding: '1rem' }}>
        <form onSubmit={handleSearch} className="flex-row items-center w-full">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search className="text-muted" size={20} style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
            <input 
              type="text" 
              className="input-field" 
              style={{ paddingLeft: '3rem' }}
              placeholder="Search stores by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <p className="text-center">Loading stores...</p>
      ) : (
        <Table columns={columns} data={stores} />
      )}
    </div>
  );
};

export default UserStores;
