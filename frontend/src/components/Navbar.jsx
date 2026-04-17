import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Store, Briefcase, Star } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const adminLinks = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/stores', icon: <Store size={20} />, label: 'Stores' },
  ];

  const storeOwnerLinks = [
    { path: '/store-owner/dashboard', icon: <Briefcase size={20} />, label: 'Dashboard' },
  ];

  const userLinks = [
    { path: '/user/stores', icon: <Store size={20} />, label: 'Stores' },
  ];

  let links = [];
  if (role === 'admin') links = adminLinks;
  else if (role === 'store_owner') links = storeOwnerLinks;
  else if (role === 'user') links = userLinks;

  return (
    <nav className="glass-panel" style={{ borderRadius: '0 0 1rem 1rem', padding: '1rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, margin: '0 auto', maxWidth: '1200px' }}>
      <div className="flex items-center">
        <Link to="/" className="app-title flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <Star className="text-amber-400" fill="currentColor" size={28} />
            <span>RatingFlow</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`btn ${location.pathname === link.path ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem', textDecoration: 'none' }}
          >
            {link.icon} <span className="nav-label">{link.label}</span>
          </Link>
        ))}
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <LogOut size={20} /> <span className="nav-label">Logout</span>
        </button>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .nav-label {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
