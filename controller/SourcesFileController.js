const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {SourcesFileModel } = require('../models/sourcesFileModel');

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