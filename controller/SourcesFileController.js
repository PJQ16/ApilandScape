const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {SourcesFileModel } = require('../models/sourcesFileModel');

/**
 * @swagger
 * /sourcesfile/:id:
 *   get:
 *     summary: Get Sources File
 *     description: Retrieve sources files based on the provided activity period ID.
 *     tags: 
 *       - Sources Files
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the activity period
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Sources files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SourcesFile'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

app.get('/sourcesfile/:id',async(req,res)=>{
    try{
        const showData = await SourcesFileModel.findAll({
            where:{
                activityperiod_id:req.params.id
             }
        }
        );
        res.status(200).json(showData);
    }catch(e){
        res.status(500).json('Server Error' + e.message);
    }
})
const {File} = require('../middleware/file'); 
/**
 * @swagger
 * /importSourcesfile:
 *   post:
 *     summary: Import Sources File
 *     description: Upload and import a sources file.
 *     tags:
 *       - Sources Files
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Sources file imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SourcesFile'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

app.post('/importSourcesfile',File,async(req,res)=>{
    try{
        const data = {
            ...req.body,
            file_name: req.file.filename // ชื่อไฟล์ที่อัพโหลด
          };
         const addData = await SourcesFileModel.create(data);
        res.status(200).json(addData); 
    }catch(e){
        res.status(500).json('Server Error' + e.message);
    }
})
module.exports = app