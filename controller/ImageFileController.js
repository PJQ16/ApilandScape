const express = require('express');
const app = express();
const {ImageFileModel} = require('../models/imageFileModel');

app.get('/imagefile/showImagefileApi',async(req,res)=>{
    try{
        const showData = await ImageFileModel.findAll();
        res.status(200).json(showData);
    }catch(e){
        res.status(500).json('Server Error' + e.message);
    }
})

module.exports = app