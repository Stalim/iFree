require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const eventRoutes = require('./routes/events');
const tablaRouter = require('./routes/tabla');
const playerRouter = require('./routes/players');
const knockoutRouter = require('./routes/knockout');

const app = express();

// Configure CORS to accept requests from your mobile app
app.use(cors({
  origin: '*', // During development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Add a test route to verify the server is running
app.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Server is running!' });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/tabla', tablaRouter);
app.use('/api/players', playerRouter);
app.use('/api/knockout', knockoutRouter);

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB');
    // Only start the server after successful database connection
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      const address = server.address();
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server bound to ${address.address}:${address.port}`);
      console.log(`Test the API at: http://localhost:${PORT}/test`);
      console.log(`Events API at: http://localhost:${PORT}/api/events`);
      console.log(`Players API at: http://localhost:${PORT}/api/players`);
      console.log('Available on your network at:');
      require('os').networkInterfaces()['Wi-Fi']?.forEach(interface => {
        if (interface.family === 'IPv4') {
          console.log(`  http://${interface.address}:${PORT}`);
        }
      });
    });

    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}); 