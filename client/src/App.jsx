import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

// Pages
import LandingPage from './pages/LandingPage';
import AdminRegister from './pages/Admin/AdminRegister';
import AdminLogin from './pages/Admin/AdminLogin';
import Dashboard from './pages/Admin/Dashboard';
import CreateTest from './pages/Admin/CreateTest';
import LobbyControl from './pages/Admin/LobbyControl';
import TestResults from './pages/Admin/TestResults';
import StudentLogin from './pages/Student/StudentLogin';
import WaitingRoom from './pages/Student/WaitingRoom';
import ExamPortal from './pages/Student/ExamPortal';
import ResultSummary from './pages/Student/ResultSummary';

import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <Navbar />
            <div className="pt-16"> {/* Add padding for fixed navbar */}
              <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Auth Routes */}
                <Route path="/auth/login" element={<AdminLogin />} />
                <Route path="/auth/register" element={<AdminRegister />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/create-test" element={<CreateTest />} />
                <Route path="/admin/lobby/:testCode" element={<LobbyControl />} />
                <Route path="/admin/results/:testId" element={<TestResults />} />

                {/* Student Routes */}
                <Route path="/student" element={<StudentLogin />} />
                <Route path="/exam/lobby/:testCode" element={<WaitingRoom />} />
                <Route path="/exam/attempt/:testCode" element={<ExamPortal />} />
                <Route path="/exam/result" element={<ResultSummary />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </Router>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
