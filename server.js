import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.config.js';

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION:', err.message);
      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION:', err.message);
      server.close(() => process.exit(1));
    });   

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();


