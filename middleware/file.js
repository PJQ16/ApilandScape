const multer = require('multer');

// กำหนดตำแหน่งที่จะบันทึกไฟล์ภาพ
 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'sourcesfile') // แก้เป็นโฟลเดอร์ที่คุณต้องการเก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
}); 

// กำหนด multer middleware และให้มันรับเฉพาะไฟล์เดียวที่ชื่อ image
exports.File = multer({ storage: storage }).single('file_name'); //เป็น key ที่ได้จาก react 