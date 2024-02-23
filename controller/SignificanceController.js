const express = require('express');
const app = express();
const {SignificanceModel} = require('../models/significanceModel');

app.get('/significance/showSignificanceApi',async(req,res)=>{
    try{
        const showData = await SignificanceModel.findAll();
        res.status(200).json(showData);
    }catch(e){
        res.status(500).json('Server Error' + e.message);
    }
})

module.exports = app