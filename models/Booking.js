const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
