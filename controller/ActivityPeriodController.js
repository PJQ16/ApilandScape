const express = require('express');
const app = express();
const { ActivityGHGModel } = require('../models/activityYear');
const conn = require('../connect/con')

app.get('/activity/showPeriod',async(req,res)=>{
    try{
       const ShowData = await ActivityGHGModel.findAll({
         order:[['years','DESC']]
       });
       res.status(200).json(ShowData);
    }catch(e){
       res.status(500).json('Server Error ' + e.message);
    }
})

app.get('/activity/showPeriod/:fac_id/:years/:employee_amount/:building_area', async (req, res) => {
   try {
     const { fac_id, years,employee_amount,building_area } = req.params;
     const showData = await ActivityGHGModel.findOne({
       where: { fac_id, 
         years: conn.literal(`years + 543`),
         employee_amount,
         building_area
         },
     });
 
     if (!showData) {
       return res.status(404).json({ error: 'Activity not found' });
     }
 
     res.status(200).json(showData);
   } catch (e) {
     res.status(500).json('Server Error ' + e.message);
   }
 });

app.post('/activity/AddPeriod',async(req,res)=>{
     try{
        const AddData = await ActivityGHGModel.create(req.body);
        res.status(200).json(AddData);
     }catch(e){
        res.status(500).json('Server Error ' + e.message);
     }
})

app.put('/activity/modifyDataPeriod/:id',async(req,res)=>{
   try{
      const  ModifyData = await ActivityGHGModel.update({
         where:{
            id:req.body.id
         }
      });

      res.status(200).json(ModifyData);

   }catch(e){
      res.status(500).json('Server Error' + e.message);
   }
});
module.exports = app