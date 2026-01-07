const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const http = require('http');
const socketIo = require('socket.io');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Adjust depending on frontend URL
        methods: ["GET", "POST"]
    }
});

// Set io instance to be accessible in routes/controllers
app.set('io', io);

io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
