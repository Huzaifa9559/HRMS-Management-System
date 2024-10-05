const express = require('express'); // Import express
const cors = require('cors'); // Import cors
const cookieParser = require('cookie-parser'); // Import cookie-parser
const employeeRoutes = require('./routes/employee'); // Import employee routes
const dotenv = require('dotenv'); // Import dotenv
const db = require('./db'); // Import the database connection

dotenv.config({
  path: `.env.${process.env.sNODE_ENV}` // Load environment variables based on NODE_ENV
});

const app = express();

// Important Middlewares
app.use(cors({
  origin: `${process.env.domain}`, // Frontend address
  credentials: true // Allow credentials (cookies) to be sent
}));
app.use(express.json()); // Use express's built-in JSON parser
app.use(cookieParser()); // Use cookie-parser middleware

// Routes
app.use('/api/employees', employeeRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});