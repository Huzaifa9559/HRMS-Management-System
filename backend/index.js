import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connection from './config/db.js';
import CreateUserTable from './models/User.js';
import userRoutes from './routes/Userroutes.js';
import dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});
const app = express();



// Important Middlewares
app.use(cors({
  origin: 'http://localhost:3000' // Frontend address
}));
//app.use(bodyParser.json());
app.use(express.json());


// Connection with the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
  console.log('Connected to MySQL!');
  CreateUserTable();
});

//Setting up the database



// Routes
app.use('/api', userRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});