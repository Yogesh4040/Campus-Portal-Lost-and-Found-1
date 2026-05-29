import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import MyReports from './pages/Profile'; // Import the Profile code we created

// Simple check to see if user is logged in
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate replace to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* Protected Routes - Redirects to login if no token found */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><Dashboard /></PrivateRoute>} 
        />
        <Route 
          path="/report" 
          element={<PrivateRoute><ReportItem /></PrivateRoute>} 
        />
        <Route 
          path="/my-reports" 
          element={<PrivateRoute><MyReports /></PrivateRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;