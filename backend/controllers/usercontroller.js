import connection from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';



// usercontroller is an object can register users and fetch all users from the database
const userController = {
  
  createUser: async (req, res) => {
    try {
      const Hashpassword = await bcrypt.hash(req.body.password, 10);
      const insertUser = `
      INSERT INTO User (username, email, password) 
      VALUES (?, ?, ?)`;
      const userData = ['john_doe',req.body.email,Hashpassword];
      connection.query(insertUser, userData, (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
        } else {
          console.log('User inserted with ID:', results.insertId);
        }
      });
      res.status(201).json({ message: 'User created successfully'});
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  },

  createUserThroughGoogle: async (req, res) => {
    try {
      const { token } = req.body;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();
    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ token: jwtToken });
    }
    catch(error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const getAllUsers = `
      SELECT * FROM User`;
      connection.query(getAllUsers, (err, results) => {
        if (err) {
          console.error('Error fetching users:', err);
        } else {
          console.log('Users:', results);
        }
      });
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }
};

export default userController;
