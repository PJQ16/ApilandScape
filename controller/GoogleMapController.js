const express = require('express');
const app = express();
const {GoogleMapApi} = require('../models/googleMapApi')

app.get('/googlemapkey',async(req,res)=>{
    try{

        const  ShowData = await GoogleMapApi.findAll(
          /*   {
                where:{
                    status_activity:1
                }
            } */
        );

        res.status(200).json(ShowData)
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});

app.post('/getKeymap',async(req,res)=>{
    try{

         const  ShowData = await GoogleMapApi.create(req.body);

        res.status(200).json(ShowData) 
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});

app.put('/getKeymap/:id',async(req,res)=>{
    try{

        const  ShowData = await GoogleMapApi.update(req.body);

        res.status(200).json(ShowData)
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});

app.delete('/deleteKeymap/:id',async(req,res)=>{
    try{

        const  deleteData = await GoogleMapApi.destroy(
            {
            where:{
                id:req.params.id
            }
        }
        );

        res.status(200).json(deleteData)
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});

module.exports = app