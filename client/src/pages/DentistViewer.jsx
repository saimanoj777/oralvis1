import React, {useEffect, useState} from 'react'
import API from '../api'

export default function DentistViewer(){
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchScans(){
    try{
      const res = await API.get('/scans');
      setScans(res.data);
    }catch(err){
      console.error(err);
    }finally{ setLoading(false) }
  }

  async function downloadPDF(scanId) {
    try {
      const response = await API.get(`/scans/${scanId}/pdf`, {
        responseType: 'blob'
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scan-${scanId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('Failed to download PDF. Please try again.');
    }
  }

  useEffect(()=>{ fetchScans() }, [])

  if(loading) return <div>Loading...</div>

  return (
    <div>
      <h4>All Scans</h4>
      <div className="row">
        {scans.length === 0 && <div className="col-12">No scans yet.</div>}
        {scans.map(s => (
          <div key={s.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <img src={s.image_url} className="card-img-top" style={{height:200, objectFit:'cover'}} alt="thumb" />
              <div className="card-body">
                <h5 className="card-title">{s.patient_name}</h5>
                <p className="card-text">ID: {s.patient_id}</p>
                <p className="card-text">Type: {s.scan_type}</p>
                <p className="card-text">Region: {s.region}</p>
                <p className="card-text"><small className="text-muted">Uploaded: {new Date(s.upload_date).toLocaleString()}</small></p>
                <a href={s.image_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary me-2">View Full Image</a>
                <button 
                  onClick={() => downloadPDF(s.id)} 
                  className="btn btn-sm btn-outline-secondary"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
