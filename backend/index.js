const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser'); 
const dotenv = require('dotenv');
const db = require('./db'); 
const path = require('path');
dotenv.config({ path: `${process.cwd()}/.env` });

const employeeRoutes = require('./routes/employee/index'); // Import employee routes
const employeeAuthRoutes = require('./routes/employee/auth'); // Import auth routes
const adminAuthRoutes = require('./routes/admin/auth'); // Import admin routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin/index'); // Import admin routes

const app = express();

// Important Middlewares
app.use('/uploads/employees', express.static(path.join(__dirname, 'uploads/employees')));
app.use(cors({
  origin: `${process.env.domain}`, // Frontend address
  credentials: true,// Allow credentials (cookies) to be sent
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json()); // Use express's built-in JSON parser
app.use(cookieParser()); // Use cookie-parser middleware


const authenticateToken = require('./middlewares/protectedUsers');

// Routes

//public authentication routes
app.use('/api/employees/auth', employeeAuthRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

//protected employees routes
app.use('/api/employees', authenticateToken, employeeRoutes);
//admin protected routes
app.use('/api/admin', adminRoutes);

//other public route
app.use('/api/public', publicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




//--left for future
//redis on backend
//localstorage cache
//redux on frontend
//cloud native SQL DB