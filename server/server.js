const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Routes
const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

// Database connection
// For local development, assume a local MongoDB instance
mongoose.connect('mongodb://127.0.0.1:27017/safezone', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
