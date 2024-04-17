const multer = require('multer');

// กำหนดตำแหน่งที่จะบันทึกไฟล์ภาพ
 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images') // แก้เป็นโฟลเดอร์ที่คุณต้องการเก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
}); 

// กำหนด multer middleware และให้มันรับเฉพาะไฟล์เดียวที่ชื่อ image
exports.Image = multer({ storage: storage }).single('image_name'); //เป็น key ที่ได้จาก react 