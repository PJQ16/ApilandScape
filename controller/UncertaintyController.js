const express = require('express');
const app = express();
const {UncertaintyModel} = require('../models/uncertaintyModel');

app.get('/uncertainty/showUncertaintyApi',async(req,res)=>{
    try{
        const showData = await UncertaintyModel.findAll();
        res.status(200).json(showData);
    }catch(e){
        res.status(500).json('Server Error' + e.message);
    }
})

module.exports = app