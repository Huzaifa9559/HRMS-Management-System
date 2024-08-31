const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Frontend address
}));

app.use(express.json());

// Example route
app.get('/api/hello2', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
