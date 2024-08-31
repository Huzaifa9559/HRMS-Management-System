const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Frontend address
}));
app.use(express.json());
const users = []; // In-memory user storage (replace with database in production)
const JWT_SECRET = 'your_jwt_secret';

const GOOGLE_CLIENT_ID = '375475746648-ftjp4e7hq9r31hu54bq29rt7diun3uua.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Example route
app.get('/api/hello2', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

//custom signup
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    res.status(201).json({ message: 'User created' });
});

// Google Sign-In
app.post('/api/google-signin', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();
    const jwtToken = jwt.sign({ email }, JWT_SECRET);
    res.json({ token: jwtToken });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
