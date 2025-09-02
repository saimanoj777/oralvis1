import React, {useState} from 'react'
import API from '../api'

export default function TechnicianUpload(){
  const [patientName,setPatientName] = useState('')
  const [patientId,setPatientId] = useState('')
  const [scanType,setScanType] = useState('RGB')
  const [region,setRegion] = useState('Frontal')
  const [image,setImage] = useState(null)
  const [msg,setMsg] = useState('')

  async function submit(e){
    e.preventDefault();
    if(!image) { setMsg('Please choose an image'); return }
    const form = new FormData();
    form.append('patient_name', patientName);
    form.append('patient_id', patientId);
    form.append('scan_type', scanType);
    form.append('region', region);
    form.append('image', image);

    try{
      const res = await API.post('/scans', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Uploaded successfully');
      setPatientName(''); setPatientId(''); setImage(null);
    }catch(err){
      setMsg(err.response?.data?.message || 'Upload failed');
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>Upload Scan (Technician)</h4>
            {msg && <div className="alert alert-info">{msg}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Patient Name</label>
                <input className="form-control" value={patientName} onChange={e=>setPatientName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Patient ID</label>
                <input className="form-control" value={patientId} onChange={e=>setPatientId(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Scan Type</label>
                <select className="form-select" value={scanType} onChange={e=>setScanType(e.target.value)}>
                  <option>RGB</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Region</label>
                <select className="form-select" value={region} onChange={e=>setRegion(e.target.value)}>
                  <option>Frontal</option>
                  <option>Upper Arch</option>
                  <option>Lower Arch</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Scan Image (JPG/PNG)</label>
                <input type="file" accept="image/*" className="form-control" onChange={e=>setImage(e.target.files[0])} required />
              </div>
              <button className="btn btn-success">Upload</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
