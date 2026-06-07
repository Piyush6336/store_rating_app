import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserStores from './pages/UserStores.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import { useAuth } from './services/AuthContext.jsx';

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'store_owner') {
    return <Navigate to="/owner" replace />;
  }

  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores"
        element={
          <ProtectedRoute roles={['user']}>
            <UserStores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner"
        element={
          <ProtectedRoute roles={['store_owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/password"
        element={
          <ProtectedRoute roles={['admin', 'user', 'store_owner']}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
