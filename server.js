const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Kết nối MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/bookingSystem',)
  .then(() => console.log('Kết nối MongoDB thành công!'))
  .catch((err) => console.error('Kết nối MongoDB thất bại:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Định tuyến
app.use('/bookings', bookingRoutes);
// Đảm bảo rằng bạn sử dụng POST cho hành động hủy



// Khởi chạy server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
