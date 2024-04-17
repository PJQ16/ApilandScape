const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // แก้เป็นโฟลเดอร์ที่คุณต้องการเก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const uploads = multer({ storage: storage }).array('images', 5); // รับไฟล์เป็น array และจำกัดจำนวนไฟล์ไว้ที่ 5 ไฟล์

exports.uploads = uploads;