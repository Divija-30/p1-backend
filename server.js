const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); // Your authentication routes
const jwt = require('jsonwebtoken'); // JWT package for token verification

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Body parser middleware

// Use the authentication routes
app.use('/api/auth', authRoutes); // All auth-related routes will start with '/api/auth'

// Middleware to check for valid JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from the Authorization header
  if (!token) return res.status(403).json({ message: "Access Denied, No Token Provided!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token!" });
    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  });
}

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user // You can access user info from the token here
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
