import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CoverLetter from './pages/CoverLetter';
import ResumeAnalyzer from './pages/ResumeAnalyzer'

function App() {
  const token = localStorage.getItem('token');

  console.log('Token in App.jsx:', token); // Debugging line

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/cover-letter" element={token ? <CoverLetter /> : <Navigate to="/login" />} />
        <Route path="/resume-analyzer" element={token ? <ResumeAnalyzer /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App