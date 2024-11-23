const { Sequelize, DataTypes } = require('sequelize');

// Kết nối SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './bookings.db'
});

// Định nghĩa bảng Bookings
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
    defaultValue: 'Pending'
  }
});

// Đồng bộ cơ sở dữ liệu
sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

module.exports = { Booking };
