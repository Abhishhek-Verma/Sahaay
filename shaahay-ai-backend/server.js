require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Import routes
const chatRoute = require("./routes/chat");
const usersRoute = require("./routes/users");
const appointmentsRoute = require("./routes/appointments");
const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:4028', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Shaahay AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/users", usersRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/admin", adminRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Shaahay AI running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
