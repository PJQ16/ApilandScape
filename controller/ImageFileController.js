const express = require('express');
const multer = require('multer');
const fs = require('fs');


const app = express();
const {ImageFileModel} = require('../models/imageFileModel');
/**
 * @swagger
 * /images/ImageFr02/:activityperiod_id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Image File 02/03 ]
*/
//แสดงรูปภาพเฉพาะโปรเจ็คนั่นๆ
app.get('/images/ImageFr02/:activityperiod_id',async(req,res)=>{
    try{
        const ShowData = await ImageFileModel.findAll({
            where:{
                type_fr:2,
                activityperiod_id:req.params.activityperiod_id
            }
        })

        res.status(200).json(ShowData);

    }catch(err){
        res.status(500).json(err)
    }
});

/**
 * @swagger
 * /images/ImageFr03/:activityperiod_id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Image File 02/03 ]
*/
app.get('/images/ImageFr03/:activityperiod_id',async(req,res)=>{
    try{
        const ShowData = await ImageFileModel.findAll({
            where:{
                type_fr:3,
                activityperiod_id:req.params.activityperiod_id
            }
        })

        res.status(200).json(ShowData);

    }catch(err){
        res.status(500).json(err)
    }
});


const {uploads} = require('../middleware/upload')
/**
 * @swagger
 * /uploadImages:
 *   post:
 *     summary: Upload images
 *     description: Upload multiple images and save their details to the database.
 *     tags: [Image File 02/03 ]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: file
 *         description: The image files to upload
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *       - in: formData
 *         name: fileFr
 *         type: string
 *         description: The type of file
 *         required: true
 *       - in: formData
 *         name: activityperiod_id
 *         type: integer
 *         description: ID of the activity period
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully uploaded images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ImageFileModel'
 *       500:
 *         description: Internal Server Error
 */
app.post('/uploadImages', uploads, async (req, res) => {
    try {
        // สร้างตัวแปร payload เพื่อเก็บข้อมูลที่จะบันทึกลงในฐานข้อมูล
        let payload = {
            images: [] // เริ่มต้นด้วยการสร้างอาร์เรย์เปล่าเพื่อเก็บข้อมูลรูปภาพ
        };

        // วนลูปผ่านทุกไฟล์ที่อัพโหลด
        for (const file of req.files) {
            // เพิ่มข้อมูลของแต่ละไฟล์ลงในอาร์เรย์ images
            payload.images.push({
                file_name: file.filename,
                type_fr: req.body.fileFr,
                activityperiod_id:req.body.activityperiod_id
                // เพิ่มข้อมูลอื่น ๆ ที่ต้องการเก็บลงในฐานข้อมูลตามต้องการ
            });
        }
        // บันทึกข้อมูลลงในฐานข้อมูล
         const uploadImages = await ImageFileModel.bulkCreate(payload.images);

        // ส่งข้อมูลที่บันทึกแล้วกลับไปยังไคลเอนต์
        res.status(200).json(uploadImages);
    } catch (e) {
        // หากมีข้อผิดพลาดเกิดขึ้นในการประมวลผล ส่งข้อความผิดพลาดกลับไปยังไคลเอนต์
        res.status(500).json('Server Error ' + e.message);
    }
});




module.exports = app