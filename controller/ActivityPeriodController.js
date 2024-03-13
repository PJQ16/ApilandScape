const express = require('express');
const app = express();
const { ActivityGHGModel } = require('../models/activityYear');
const { PlaceCmuModels} = require('../models/placeAtCmuModels')
const {ScopeNumberCateModels,ScopeNumberModels,categoryScopeModels,dataScopeModels} = require('../models/categoryScope')
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
         const Faculties = await PlaceCmuModels.findAll();
         const Scopenums = await ScopeNumberModels.findAll();
         const cateScopes = await categoryScopeModels.findAll();
         const catescopenums = await ScopeNumberCateModels.findAll();
         
         const years = req.body;

         catescopenums.map((catescopenum)=>catescopenum.name);
         Scopenums.map((scopenum)=>scopenum.name)

       
         //เอาmodel faculty มาลูป -> ตารางactivityperiod
         const rawDataFalculty =  Faculties.map((faculty)=>{
            const facultyDataArray = [];
            facultyDataArray.push(
            faculty.id,
            faculty.campus_id,
            faculty.fac_name
            )
            return facultyDataArray;
         })


         //นำข้อมูลไปบันทึกลงใน ActivityGHGModel
         const DataActivityperiodArrays = [];
         rawDataFalculty.forEach((faculty) => {
             const facultyData = {
                 ...years,
                 fac_id: faculty[0],
                 faculty: faculty[1]
             };
             DataActivityperiodArrays.push(facultyData);
         });
        
         const AddDataActivity = await ActivityGHGModel.bulkCreate(DataActivityperiodArrays).then(()=>{
         
            const activityIds = AddDataActivity.map(activity => activity.id);

            const rawDataScopenum =  catescopenums.map((catescopenum) => {
               const scopenumDataArray = [];
               AddDataActivity.forEach((activity, index) => { // แก้ไขที่นี่เพื่อใช้ index
                   scopenumDataArray.push({
                       name: catescopenum.name,
                       activityperiod_id: activityIds[index], // ใช้ index ที่ได้จากการรัน forEach ของ AddDataActivity
                   });
               });
               return scopenumDataArray;
           });
           
            
            
           const rawDataCateScope = cateScopes.map((cateScope, index) => { // ใช้ flatMap เพื่อลด array 1 มิติ
            const scopeDataArray = [];
            rawDataFalculty.forEach((faculty) => {
                for (let i = 1; i <= 12; i++) {
                    scopeDataArray.push({
                        name: cateScope.name,
                        lci: cateScope.lci,
                        CO2: cateScope.CO2,
                        Fossil_CH4: cateScope.Fossil_CH4,
                        CH4: cateScope.CH4,
                        N2O: cateScope.N2O,
                        SF6: cateScope.SF6,
                        NF3: cateScope.NF3,
                        HFCs: cateScope.HFCs,
                        PFCs: cateScope.PFCs,
                        GWP_HFCs: cateScope.GWP_HFCs,
                        GWP_PFCs: cateScope.GWP_PFCs,
                        kgCO2e: cateScope.kgCO2e,
                        sources: cateScope.sources,
                        GWP_id: cateScope.GWP_id,
                        head_id: cateScope.head_id,
                        fac_id: faculty[0], 
                        campus_id: faculty[1],
                        activityperiod_id: activityIds[index], // ใช้ index เพื่อเข้าถึง activityIds
                        month: i
                    });
                }
            });
            return scopeDataArray;
        });
        

              dataScopeModels.bulkCreate(rawDataCateScope);
              ScopeNumberModels.bulkCreate(rawDataScopenum);

            console.log('เพิ่มข้อมูลเรียบร้อยแล้ว')
         }).catch((error)=>{
             console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล',error);
         })
        res.status(200).json(AddDataActivity)
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