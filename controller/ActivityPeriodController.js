const express = require('express');
const app = express();
const { ActivityGHGModel } = require('../models/activityYear');
const { PlaceCmuModels, CampusModels} = require('../models/placeAtCmuModels')
const {ScopeNumberCateModels,ScopeNumberModels,categoryScopeModels,dataScopeModels, HeadCategoryModels, HeadActivityModels} = require('../models/categoryScope')
const conn = require('../connect/con')

/**
 * @swagger
 * /activity/showPeriod:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
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

/**
 * @swagger
 * /activity/showPeriod/:fac_id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
//แสดงข้อมููลเวลา กิจกรรม โดยแสดงตาม ตณะ 
app.get('/activity/showPeriod/:fac_id',async(req,res)=>{
   try{
      const ShowData = await ActivityGHGModel.findAll({
        where:{
           fac_id:req.params.fac_id
        },
        order:[['years','DESC']]
      });
      res.status(200).json(ShowData);
   }catch(e){
      res.status(500).json('Server Error ' + e.message);
   }
})

/**
 * @swagger
 * /activity/showPeriod/:fac_id/:years:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
//แสดงข้อมููลหน้าinfo
app.get('/activity/showPeriod/:fac_id/:years',async(req,res)=>{
   try{
      const ShowData = await ActivityGHGModel.findAll({
         attributes:['id','years','employee_amount','building_area'],
         where:{
            fac_id:req.params.fac_id,
            years:req.params.years
         },
         include:[
            {
               model:CampusModels,
               attributes:['campus_name']
            },
            {
               model:PlaceCmuModels,
               attributes:['fac_name','latitude','longitude','address','logo']
            }
         ]
      });
      res.status(200).json(ShowData);
   }catch(e){
      res.status(500).json('Server Error ' + e.message);
   }
})

//สำหรับผู้ตรวขสอบ
/**
 * @swagger
 * /activity/showPeriodInfo/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
app.get('/activity/showPeriodInfo/:id',async(req,res)=>{
   try{
      const ShowData = await ActivityGHGModel.findAll({
         attributes:['id','years','employee_amount','building_area','comment','status_activity'],
         where:{
            id:req.params.id,
         },
         include:[
            {
               model:CampusModels,
               attributes:['campus_name']
            },
            {
               model:PlaceCmuModels,
               attributes:['fac_name','latitude','longitude','address','logo']
            }
         ]
      });
      res.status(200).json(ShowData);
   }catch(e){
      res.status(500).json('Server Error ' + e.message);
   }
})

/**
 * @swagger
 * /activity/showPeriod/:fac_id/:years/:employee_amount/:building_area:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
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


//ค้นหา แต่ละปีมาแสดงเป็นตาราง
/**
 * @swagger
 * /activityperiod/:years:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
app.get('/activityperiod/:years',async(req,res)=>{
   try{
         const showData = await CampusModels.findAll(
            {     
               attributes:['campus_name'],
               include:[
                  {
                     model:PlaceCmuModels,
                     attributes:['fac_name'],
                     include:[
                        {
                           model:ActivityGHGModel,
                              attributes:['id','years','employee_amount','building_area','status_base_year','comment','status_activity'],
                              where:{
                                 years:req.params.years
                              }

                        }
                     ]
                  }
               ]
               
            }
         );
         res.status(200).json(showData);
   }catch(e){
      res.status(500).json('server error ' + e.message);
   }
});  


//ค้นหาตาม id
/**
 * @swagger
 * /activityperiod/info/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
app.get('/activityperiod/info/:id',async(req,res)=>{
   try{
         const showData = await PlaceCmuModels.findAll(
            {  
                     include:[
                        {
                           model:ActivityGHGModel,
                              attributes:['id','years','employee_amount','building_area','status_base_year','comment','status_activity'],
                              where:{
                                 id:req.params.id
                              }

                        },
                        {
                           model:CampusModels,
                           attributes:['id','campus_name'],
                          
                        }
                     ]
                  }
         );
         res.status(200).json(showData);
   }catch(e){
      res.status(500).json('server error ' + e.message);
   }
});  


/**
 * @swagger
 * /activity/AddPeriod:
 *   post:
 *     summary: Add period to activity
 *     description: Add a new period to the activity.
 *     tags: [Activity Period]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               years:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
app.post('/activity/AddPeriod',async(req,res)=>{
   try{
       const Faculties = await PlaceCmuModels.findAll();
       const cateScopes = await categoryScopeModels.findAll();
       const catescopenums = await ScopeNumberCateModels.findAll();
       const HeadCategory = await HeadCategoryModels.findAll();
       const years = req.body;

      

     
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
               campus_id: faculty[1]
           };
           DataActivityperiodArrays.push(facultyData);
       });

         const AddDataActivity = await ActivityGHGModel.bulkCreate(DataActivityperiodArrays);

       /*    const DataScopenum = [];
        AddDataActivity.forEach((activity) => {
            catescopenums.forEach((catescopenum) => {
                DataScopenum.push({
                    activityperiod_id: activity.id,
                    name: catescopenum.name,
                    numscope_id :catescopenum.id
                });
            });
        });
        
      const AddScopenumber = await ScopeNumberModels.bulkCreate(DataScopenum);  */
      

    /*  const DataHeadActivity= [];
      AddScopenumber.forEach((scopenum)=>{
         HeadCategory.forEach((HeadActivity)=>{
            DataHeadActivity.push({
               head_name:HeadActivity.head_name,
               scopenum_id:HeadActivity.scopenum_id,  
               scopenumactivity_id:scopenum.id
            })
         })
      }) 

      const AddHeadActivity = await HeadActivityModels.bulkCreate(DataHeadActivity);   
      */
    
  /*  const bulkDatas = [];
AddDataActivity.forEach((activity,index) => {
    const bulkData = cateScopes.flatMap(cateScope => ({
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
        GWP_id: 1,
        scopenum_id: AddScopenumber[index].id,
        head_id: cateScope.head_id,
        fac_id: activity.fac_id,
        campus_id: activity.campus_id,
        activityperiod_id: activity.id,
        month: 1
    }));
    bulkDatas.push(bulkData);
}); */


/* // นำ bulkDatas มาเชื่อมต่อเป็นข้อมูลเดียวกัน (flatten) เพื่อส่งค่ากลับ
const finalBulkData = bulkDatas.flat();
//ทำงานได้แล้วเหลือ จัดการกับ ขนาดที่จะรับในฐานข้อมูล
   const createData_scope =  await dataScopeModels.bulkCreate(finalBulkData);
 res.status(200).json(createData_scope);  */

 res.status(200).json(AddDataActivity);
   }catch(e){
      res.status(500).json('Server Error ' + e.message);
   }
})


/**
 * @swagger
 * /activity/modifyDataPeriod/:id:
 *   put:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Activity Period]
*/
app.put('/activity/modifyDataPeriod/:id',async(req,res)=>{
   try{

      const id = req.params.id;
      const { employee_amount, building_area } = req.body;
   
      const [updatedRowsCount, updatedRows] = await ActivityGHGModel.update(
         { employee_amount, building_area },
         { where: { id } }
       );

       if (updatedRowsCount > 0) {
         res.status(200).json({ message: 'Update successful', updatedRowsCount, updatedRows });
       } else {
         res.status(404).json({ message: 'No data found to update' });
       }
     } catch (e) {
       console.error('Error:', e.message);
       res.status(500).json({ message: 'Server Error', error: e.message });
     }
   });

   app.put('/activity/check/:id',async(req,res)=>{
      try{
   
         const id = req.params.id;
         const { comment,status_activity  } = req.body;
      
         const [updatedRowsCount, updatedRows] = await ActivityGHGModel.update(
            { comment,status_activity },
            { where: { id } }
          );
   
          if (updatedRowsCount > 0) {
            res.status(200).json({ message: 'Update successful', updatedRowsCount, updatedRows });
          } else {
            res.status(404).json({ message: 'No data found to update' });
          }
        } catch (e) {
          console.error('Error:', e.message);
          res.status(500).json({ message: 'Server Error', error: e.message });
        }
      });

module.exports = app