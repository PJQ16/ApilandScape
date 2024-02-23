const express = require('express')
const app = express();
const {CampusModels,PlaceCmuModels} = require('../models/placeAtCmuModels');

app.get('/place/showAllPlace',async(req,res)=>{
    try {
        const ShowData = await CampusModels.findAll({
            attributes: [
                'id',
                'campus_name',
            ],
            include: [
                {
                    model: PlaceCmuModels,
                    attributes: [
                        'id',
                        'fac_name',
                    ],
                }
            ]
        });
    
        res.json(ShowData); // Add this line to send the response
    } catch (e) {
        res.status(500).json(e.message);
    }
    
});

app.get('/place/showCampus',async(req,res)=>{
    try{
        const ShowData = await CampusModels.findAll();
        res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Error Server ' + e.message);
    }
})

app.get('/place/showFaculty',async(req,res)=>{
    try{
        const ShowData = await PlaceCmuModels.findAll();
        res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Error Server ' + e.message);
    }
})

//เพิ่มหน่วยงาน
/* app.post('/place/addFaculty',async(req,res)=>{
    try{
       const AddData = await PlaceCmuModels.create(req.body);

       res.status(200).json(AddData);
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});
 */
//เพิ่มวิทยาเขต
/* app.post('/place/addCampus',async(req,res)=>{
    try{
        const AddData = await CampusModels.create(req.body);
        res.status(200).json(AddData);
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
}); */




module.exports = app