const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser'); 
const dotenv = require('dotenv');
//const db = require('./db'); 
const path = require('path');
dotenv.config({ path: `${process.cwd()}/.env` });

const employeeRoutes = require('./routes/employee/index'); // Import employee routes
const employeeAuthRoutes = require('./routes/employee/auth'); // Import auth routes
const adminAuthRoutes = require('./routes/admin/auth'); // Import admin routes
const adminRoutes = require('./routes/admin/index'); // Import admin routes

const app = express();

// Important Middlewares
app.use('/uploads/employees', express.static(path.join(__dirname, 'uploads/employees')));
app.use(cors({
  origin: `http://localhost:3000`, // Frontend address
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
//app.use(cors());
app.use(express.json()); // Use express's built-in JSON parser
app.use(cookieParser()); // Use cookie-parser middleware


const authenticateToken = require('./middlewares/protectedUsers');

// Routes

//public authentication routes
app.use('/api/employees/auth', employeeAuthRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

//protected employees routes
app.use('/api/employees', authenticateToken, employeeRoutes);
app.use('/api/admin', adminRoutes);
//admin protected routes


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




//--left for future
//redis on backend
//localstorage cache
//redux on frontend
//cloud native SQL DB