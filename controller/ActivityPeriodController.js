const express = require('express');
const app = express();
const { ActivityGHGModel } = require('../models/activityYear');

app.get('/activity/showPeriod',async(req,res)=>{
    try{
       const ShowData = await ActivityGHGModel.findAll();
       res.status(200).json(ShowData);
    }catch(e){
       res.status(500).json('Server Error ' + e.message);
    }
})


app.post('/activity/AddPeriod',async(req,res)=>{
     try{
      const {activities} = req.body
        const AddData = await ActivityGHGModel.bulkCreate(activities);
        res.status(200).json(AddData);
     }catch(e){
        res.status(500).json('Server Error ' + e.message);
     }
})
module.exports = app