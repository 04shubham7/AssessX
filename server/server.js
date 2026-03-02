const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for development, restrict in production
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false, // Ensure images can be loaded from same origin or setup properly
}));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// Serve static uploads
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assessx')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('AssessX API is running');
});

const socketHandler = require('./socket/socketHandler');

// Socket.IO Connection
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
