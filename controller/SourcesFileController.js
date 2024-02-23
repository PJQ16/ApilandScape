const express = require('express');
const app = express();
const {SourcesFileModel } = require('../models/sourcesFileModel');

app.get('/sourcesfile/showSourcesFileApi',async(req,res)=>{
    try{
        const showData = await SourcesFileModel.findAll();
        res.status(200).json(showData);
    }catch(e){
        res.status(500).json('Server Error' + e.message);
    }
})

module.exports = app