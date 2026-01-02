import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

// Pages
import AdminLogin from './pages/Admin/AdminLogin';
import Dashboard from './pages/Admin/Dashboard';
import CreateTest from './pages/Admin/CreateTest';
import LobbyControl from './pages/Admin/LobbyControl';
import StudentLogin from './pages/Student/StudentLogin';
import WaitingRoom from './pages/Student/WaitingRoom';
import ExamPortal from './pages/Student/ExamPortal';
import ResultSummary from './pages/Student/ResultSummary';

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/create-test" element={<CreateTest />} />
            <Route path="/admin/lobby/:testCode" element={<LobbyControl />} />

            {/* Student Routes */}
            <Route path="/" element={<StudentLogin />} />
            <Route path="/exam/lobby/:testCode" element={<WaitingRoom />} />
            <Route path="/exam/attempt/:testCode" element={<ExamPortal />} />
            <Route path="/exam/result" element={<ResultSummary />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
};

export default App;
