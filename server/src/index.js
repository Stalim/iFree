require('dotenv').config();

const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Minimal test route for healthcheck
app.get('/test', (req, res) => {
  console.log('Healthcheck endpoint hit!');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Environment variables
const PORT = process.env.PORT || 3001;

// Start server first with minimal setup
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize the rest of the application after server is running
  initializeApp().catch(err => {
    console.error('Failed to initialize app:', err);
    // Keep server running even if initialization fails
  });
});

async function initializeApp() {
  const mongoose = require('mongoose');
  const cors = require('cors');
  const path = require('path');
  
  // Configure CORS
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.urlencoded({ extended: true }));

  // Create uploads directory
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
  }

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Connect to MongoDB
  console.log('Attempting to connect to MongoDB...');
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freestyle_app';
  
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB successfully');
    
    // Load routes only after DB connection
    const eventRoutes = require('./routes/events');
    const tablaRouter = require('./routes/tabla');
    const playerRouter = require('./routes/players');
    const knockoutRouter = require('./routes/knockout');

    // Setup routes
    app.use('/api/events', eventRoutes);
    app.use('/api/tabla', tablaRouter);
    app.use('/api/players', playerRouter);
    app.use('/api/knockout', knockoutRouter);

    // Update test route with more info
    app.get('/test', (req, res) => {
      console.log('Test endpoint hit!');
      res.json({ 
        status: 'ok',
        message: 'Server is fully initialized!',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      });
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Server will continue running without database connection');
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });
}

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    if (mongoose) {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.log('Server will continue running after uncaught exception');
}); 