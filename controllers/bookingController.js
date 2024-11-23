const Booking = require('../models/Booking');

// Hàm kiểm tra ngày và giờ hợp lệ
async function validateBookingData(date, time, bookingId = null) {
  const requestedDateTime = new Date(`${date}T${time}:00`);  // Tạo đối tượng Date từ ngày và giờ

  // Kiểm tra nếu ngày và giờ nhỏ hơn thời gian hiện tại
  if (requestedDateTime < new Date()) {
    throw new Error('Ngày và giờ không hợp lệ. Vui lòng chọn thời gian trong tương lai.');
  }

  // Kiểm tra nếu ngày và giờ đã có trong hệ thống, trừ đặt chỗ đang sửa
  const existingBooking = await Booking.findOne({
    date: requestedDateTime.toISOString().split('T')[0],  // Chuyển ngày thành chuỗi định dạng YYYY-MM-DD
    time: time,
    _id: { $ne: bookingId } // Nếu là sửa, loại bỏ đặt chỗ đang sửa khỏi kết quả
  });

  if (existingBooking) {
    throw new Error('Đặt chỗ đã tồn tại vào thời gian này. Vui lòng chọn thời gian khác.');
  }

  return true; // Nếu không có lỗi thì trả về true
}

// Hiển thị danh sách đặt chỗ
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.render('list', { bookings });
  } catch (err) {
    req.flash('error', 'Lỗi khi lấy danh sách đặt chỗ!');
    res.redirect('/bookings');
  }
};

// Hiển thị form thêm đặt chỗ
exports.showAddForm = (req, res) => {
  res.render('new');
};

// Thêm đặt chỗ mới
exports.addBooking = async (req, res) => {
  const { customerName, date, time } = req.body;
  try {
    // Kiểm tra dữ liệu đầu vào
    await validateBookingData(date, time);
    
    // Thêm đặt chỗ mới
    const newBooking = new Booking({ customerName, date, time, status: 'Pending' });
    await newBooking.save();

    // Hiển thị thông báo thành công
    req.flash('success', 'Đặt chỗ đã được thêm thành công!');
    res.redirect('/bookings'); // Chuyển hướng về trang danh sách
  } catch (err) {
    // Hiển thị thông báo lỗi
    req.flash('error', `Lỗi: ${err.message}`);
    res.redirect('/bookings');
  }
};

// Hiển thị form sửa đặt chỗ
exports.showEditForm = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      req.flash('error', 'Không tìm thấy đặt chỗ!');
      return res.redirect('/bookings');
    }
    res.render('edit', { booking });
  } catch (err) {
    req.flash('error', 'Lỗi khi lấy thông tin đặt chỗ!');
    res.redirect('/bookings');
  }
};

// Cập nhật đặt chỗ
exports.updateBooking = async (req, res) => {
  const { customerName, date, time, status } = req.body;
  const bookingId = req.params.id;

  try {
    // Kiểm tra dữ liệu đầu vào
    await validateBookingData(date, time, bookingId);
    
    // Cập nhật đặt chỗ
    await Booking.findByIdAndUpdate(bookingId, { customerName, date, time, status });

    // Hiển thị thông báo thành công
    req.flash('success', 'Đặt chỗ đã được cập nhật thành công!');
    res.redirect('/bookings'); // Chuyển hướng về trang danh sách
  } catch (err) {
    // Hiển thị thông báo lỗi
    req.flash('error', `Lỗi: ${err.message}`);
    res.redirect('/bookings');
  }
};
// Hủy đặt chỗ (thay đổi trạng thái thành 'Cancelled')
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      req.flash('error', 'Không tìm thấy đặt chỗ!');
      return res.redirect('/bookings');
    }

    // Cập nhật trạng thái thành 'Cancelled' thay vì xóa
    booking.status = 'Cancelled';
    await booking.save();

    // Hiển thị thông báo thành công
    req.flash('success', 'Đặt chỗ đã bị hủy thành công!');
    res.redirect('/bookings'); // Chuyển hướng về trang danh sách
  } catch (err) {
    // Hiển thị thông báo lỗi
    req.flash('error', 'Lỗi khi hủy đặt chỗ!');
    res.redirect('/bookings');
  }
};

