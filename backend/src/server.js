/**
 * ==============================================
 * LOTUS VIDEO PLATFORM - MAIN SERVER FILE
 * ==============================================
 * 
 * This is the entry point for the backend application.
 * It initializes the Express server, connects to MongoDB,
 * and starts listening for incoming requests.
 * 
 * @author Lotus Team
 * @version 1.0.0
 */

import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

// Configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server Function
 * Connects to database and starts the Express server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         🪷 LOTUS VIDEO PLATFORM - BACKEND API            ║
║                                                           ║
║  Environment: ${NODE_ENV.toUpperCase().padEnd(42)}║
║  Port:        ${PORT.toString().padEnd(42)}║
║  Status:      RUNNING ✓${' '.repeat(34)}║
║  Time:        ${new Date().toISOString().padEnd(42)}║
║                                                           ║
║  API Docs:    http://localhost:${PORT}/api${' '.repeat(23)}║
║  Health:      http://localhost:${PORT}/api/health${' '.repeat(16)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(err.name, err.message);
      logger.error(err.stack);
      
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully...');
      server.close(() => {
        logger.info('💥 Process terminated!');
      });
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('👋 SIGINT RECEIVED. Shutting down gracefully...');
      server.close(() => {
        logger.info('💥 Process terminated!');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
