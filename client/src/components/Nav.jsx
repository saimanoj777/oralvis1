import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Nav(){
  const navigate = useNavigate();
  const role = localStorage.getItem('oralvis_role');

  function logout(){
    localStorage.removeItem('oralvis_token');
    localStorage.removeItem('oralvis_role');
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">OralVis</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {role === 'Technician' && (
              <li className="nav-item"><Link className="nav-link" to="/tech/upload">Upload</Link></li>
            )}
            {role === 'Dentist' && (
              <li className="nav-item"><Link className="nav-link" to="/dentist/viewer">Viewer</Link></li>
            )}
          </ul>
          <div className="d-flex">
            {localStorage.getItem('oralvis_token') ? (
              <button className="btn btn-outline-secondary" onClick={logout}>Logout</button>
            ) : (
              <Link className="btn btn-primary" to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
