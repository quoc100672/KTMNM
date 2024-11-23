const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Định nghĩa các route
router.get('/', bookingController.getAllBookings); // Hiển thị danh sách
router.get('/new', bookingController.showAddForm); // Trang thêm mới
router.post('/', bookingController.addBooking);    // Thêm mới
router.get('/:id/edit', bookingController.showEditForm); // Trang sửa
router.put('/:id', bookingController.updateBooking);     // Cập nhật
router.delete('/:id', bookingController.deleteBooking);  // Hủy đặt chỗ

module.exports = router;
