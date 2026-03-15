import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import EquipmentFormPage from './pages/EquipmentFormPage';
import BookingsPage from './pages/BookingsPage';
import MyListingsPage from './pages/MyListingsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
          }}
        />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/equipment" element={<EquipmentListPage />} />
            <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
            <Route
              path="/equipment/new"
              element={<PrivateRoute><EquipmentFormPage /></PrivateRoute>}
            />
            <Route
              path="/equipment/:id/edit"
              element={<PrivateRoute><EquipmentFormPage /></PrivateRoute>}
            />
            <Route
              path="/bookings"
              element={<PrivateRoute><BookingsPage /></PrivateRoute>}
            />
            <Route
              path="/my-listings"
              element={<PrivateRoute><MyListingsPage /></PrivateRoute>}
            />
            <Route
              path="/notifications"
              element={<PrivateRoute><NotificationsPage /></PrivateRoute>}
            />
            <Route
              path="/profile"
              element={<PrivateRoute><ProfilePage /></PrivateRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
