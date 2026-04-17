import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect based on role if they try to access unauthorized path
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'store_owner') return <Navigate to="/store-owner/dashboard" replace />;
    return <Navigate to="/user/stores" replace />;
  }

  return children;
};

export default ProtectedRoute;
