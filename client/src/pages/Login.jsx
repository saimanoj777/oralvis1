import React, {useState} from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState('')
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('oralvis_token', res.data.token);
      localStorage.setItem('oralvis_role', res.data.role);
      if (res.data.role === 'Technician') navigate('/tech/upload');
      else navigate('/dentist/viewer');
    }catch(e){
      setErr(e.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Login</h4>
            {err && <div className="alert alert-danger">{err}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary">Login</button>
            </form>
            <hr/>
            <div className="small text-muted">Seeded users: tech@example.com / techpass (Technician) — dentist@example.com / dentistpass (Dentist)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
