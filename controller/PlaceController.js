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

module.exports = app