import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

// Pages (to be created)
// import AdminLogin from './pages/Admin/AdminLogin';
// import Dashboard from './pages/Admin/Dashboard';
// import CreateTest from './pages/Admin/CreateTest';
// import StudentLogin from './pages/Student/StudentLogin';
// import ExamPortal from './pages/Student/ExamPortal';

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<div>Admin Login (TODO)</div>} />
            <Route path="/admin/dashboard" element={<div>Admin Dashboard (TODO)</div>} />

            {/* Student Routes */}
            <Route path="/" element={<div>Student Login (TODO)</div>} />
            <Route path="/exam/:testCode" element={<div>Exam Portal (TODO)</div>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
};

export default App;
