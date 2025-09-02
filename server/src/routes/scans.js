const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const db = require('../db');
const auth = require('../middleware/auth');
const { generateScanPDF } = require('../utils/pdf');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Technician uploads a scan
router.post('/', auth('Technician'), upload.single('image'), async (req, res) => {
  try {
    const { patient_name, patient_id, scan_type, region } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // upload to Cloudinary via upload_stream
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'oralvis' }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error', error);
        return res.status(500).json({ message: 'Cloudinary upload failed' });
      }
      const image_url = result.secure_url;
      const upload_date = new Date().toISOString();

      const stmt = db.prepare(`INSERT INTO scans (patient_name, patient_id, scan_type, region, image_url, upload_date) VALUES (?,?,?,?,?,?)`);
      stmt.run(patient_name, patient_id, scan_type, region, image_url, upload_date, function (err) {
        if (err) return res.status(500).json({ message: 'DB insert failed', err });
        return res.json({ id: this.lastID, patient_name, patient_id, scan_type, region, image_url, upload_date });
      });
    });
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// Dentist fetch scans
router.get('/', auth('Dentist'), (req, res) => {
  db.all('SELECT * FROM scans ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB fetch failed' });
    res.json(rows);
  });
});

// PDF route for a single scan id (Dentist & Technician allowed to download)
router.get('/:id/pdf', auth(), (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM scans WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Scan not found' });
    generateScanPDF(row, res).catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'PDF generation failed' });
    });
  });
});

module.exports = router;
