import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import TechnicianUpload from './pages/TechnicianUpload'
import DentistViewer from './pages/DentistViewer'
import Nav from './components/Nav'

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('oralvis_token');
  const role = localStorage.getItem('oralvis_role');
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div>
      <Nav />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/tech/upload" element={<PrivateRoute allowedRoles={["Technician"]}><TechnicianUpload/></PrivateRoute>} />
          <Route path="/dentist/viewer" element={<PrivateRoute allowedRoles={["Dentist"]}><DentistViewer/></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  )
}
