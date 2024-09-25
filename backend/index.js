import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import employeeRoutes from './routes/employee.js';
import dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});
const app = express();



// Important Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Frontend address
  credentials: true // Allow credentials (cookies) to be sent
}));
//app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware





// Routes
app.use('/api', employeeRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});