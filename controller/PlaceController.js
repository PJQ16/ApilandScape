const express = require('express')
const app = express();
const {CampusModels,PlaceCmuModels} = require('../models/placeAtCmuModels');

/**
 * @swagger
 * /place/showAllPlace:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Campus and Faculties ]
*/
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

app.get('/place/showCampus/:id',async(req,res)=>{
    try {
        const ShowData = await PlaceCmuModels.findAll({
            where:{
                campus_id:req.params.id
            }
        });
    
        res.json(ShowData); // Add this line to send the response
    } catch (e) {
        res.status(500).json(e.message);
    }
    
});

/**
 * @swagger
 * /place/showAllPlace:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Campus and Faculties ]
*/
app.get('/place/showCampus',async(req,res)=>{
    try{
        const ShowData = await CampusModels.findAll();
        res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Error Server ' + e.message);
    }
})

/**
 * @swagger
 * /place/showFaculty:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Campus and Faculties ]
*/
app.get('/place/showFaculty',async(req,res)=>{
    try{
        const ShowData = await PlaceCmuModels.findAll();
        res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Error Server ' + e.message);
    }
});




module.exports = app