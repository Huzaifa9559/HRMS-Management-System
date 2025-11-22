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
// CORS configuration - support multiple origins
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));
//app.use(cors());
app.use(express.json()); // Use express's built-in JSON parser
app.use(cookieParser()); // Use cookie-parser middleware


const authenticateToken = require('./middlewares/protectedUsers');

// Routes

//public authentication routes
app.use('/api/employees/auth', employeeAuthRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

//protected employees routes
app.use('/api/employees', authenticateToken, employeeRoutes);
app.use('/api/admin', adminRoutes);
//admin protected routes


const PORT = process.env.PORT || 8000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;




//--left for future
//redis on backend
//localstorage cache
//redux on frontend
//cloud native SQL DB