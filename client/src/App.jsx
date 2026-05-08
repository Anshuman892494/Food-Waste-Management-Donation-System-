import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// Dashboards
import DonorDashboard from './pages/donor/DonorDashboard';
import NGODashboard from './pages/ngo/NGODashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-dark text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Donor Routes */}
              <Route 
                path="/donor/*" 
                element={
                  <ProtectedRoute role="donor">
                    <DonorDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* NGO Routes */}
              <Route 
                path="/ngo/*" 
                element={
                  <ProtectedRoute role="ngo">
                    <NGODashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Volunteer Routes */}
              <Route 
                path="/volunteer/*" 
                element={
                  <ProtectedRoute role="volunteer">
                    <VolunteerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
