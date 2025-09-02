require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const scansRouter = require('./routes/scans');
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// create two seeded users (Technician & Dentist) if not exists
function seedUsers() {
  const techEmail = 'tech@example.com';
  const dentistEmail = 'dentist@example.com';
  const techPass = 'techpass';
  const dentistPass = 'dentistpass';

  db.get('SELECT * FROM users WHERE email = ?', [techEmail], (err, row) => {
    if (!row) {
      bcrypt.hash(techPass, 10).then((hash) => {
        db.run('INSERT INTO users (email, password, role) VALUES (?,?,?)', [techEmail, hash, 'Technician']);
        console.log('Seeded Technician:', techEmail, '/', techPass);
      });
    }
  });
  db.get('SELECT * FROM users WHERE email = ?', [dentistEmail], (err, row) => {
    if (!row) {
      bcrypt.hash(dentistPass, 10).then((hash) => {
        db.run('INSERT INTO users (email, password, role) VALUES (?,?,?)', [dentistEmail, hash, 'Dentist']);
        console.log('Seeded Dentist:', dentistEmail, '/', dentistPass);
      });
    }
  });
}

seedUsers();

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    bcrypt.compare(password, user.password).then((ok) => {
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
      res.json({ token, role: user.role });
    });
  });
});

// mount scans router
app.use('/api/scans', scansRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
