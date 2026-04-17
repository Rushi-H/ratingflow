import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import UserStores from './pages/UserStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/users" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/stores" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminStores /></ProtectedRoute>} 
        />

        {/* User Routes */}
        <Route 
          path="/user/stores" 
          element={<ProtectedRoute allowedRoles={['user']}><UserStores /></ProtectedRoute>} 
        />

        {/* Store Owner Routes */}
        <Route 
          path="/store-owner/dashboard" 
          element={<ProtectedRoute allowedRoles={['store_owner']}><StoreOwnerDashboard /></ProtectedRoute>} 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
