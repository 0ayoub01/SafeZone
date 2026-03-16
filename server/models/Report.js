const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String }, // Can store base64 string or URL
  city: { type: String, required: true },
  neighborhood: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
