const express = require('express');
const app = express();
const {GoogleMapApi} = require('../models/googleMapApi')

/**
 * @swagger
 * /googlemapkey:
 *   get:
 *     summary: Get Google Maps API key
 *     description: Retrieve the Google Maps API key.
 *     tags: 
 *       - Google Maps
 *     responses:
 *       '200':
 *         description: Google Maps API key retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   example: "your-google-maps-api-key"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

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

/**
 * @swagger
 * /getKeymap:
 *   post:
 *     summary: Create a new Google Maps API key
 *     description: Create a new Google Maps API key by providing the necessary data.
 *     tags: 
 *       - Google Maps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: The Google Maps API key
 *     responses:
 *       '200':
 *         description: Google Maps API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created API key
 *                 apiKey:
 *                   type: string
 *                   description: The Google Maps API key
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

app.post('/getKeymap',async(req,res)=>{
    try{

         const  ShowData = await GoogleMapApi.create(req.body);

        res.status(200).json(ShowData) 
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});

/**
 * @swagger
 * /getKeymap/:id:
 *   put:
 *     summary: Update Google Maps API key by ID
 *     description: Update the Google Maps API key by providing its ID and new data.
 *     tags: 
 *       - Google Maps
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Google Maps API key to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: The new Google Maps API key
 *     responses:
 *       '200':
 *         description: Google Maps API key updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated API key
 *                 apiKey:
 *                   type: string
 *                   description: The updated Google Maps API key
 *       '404':
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

app.put('/getKeymap/:id',async(req,res)=>{
    try{

        const  ShowData = await GoogleMapApi.update(req.body);

        res.status(200).json(ShowData)
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
});

/**
 * @swagger
 * /deleteKeymap/:id:
 *   delete:
 *     summary: Delete Google Maps API key by ID
 *     description: Delete the Google Maps API key by providing its ID.
 *     tags: 
 *       - Google Maps
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Google Maps API key to delete
 *     responses:
 *       '200':
 *         description: Google Maps API key deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the deleted API key
 *       '404':
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */

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