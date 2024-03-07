const express = require('express');
const app = express();

const { ScopeNumberModels, HeadCategoryModels, GwpModels, categoryScopeModels, dataScopeModels } = require('../models/categoryScope');
const {ActivityGHGModel} =require('../models/activityYear');
const conn = require('../connect/con');
const { PlaceCmuModels,CampusModels } = require('../models/placeAtCmuModels');

const eliteral = conn.literal('(CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs)');

const tco2e = conn
//APi สำหรับการ แสดงผลลัพท์ของแต่ละ scope แบบแยกตามประเภท Activity 
app.get('/landscape', async (req, res) => {
  try {
    const showData = await CampusModels.findAll({
      attributes: ['id', 'campus_name'],
      include: [
        {
          model: PlaceCmuModels,
          attributes: ['fac_name'],
          include: [
            {
              model: ActivityGHGModel,
              attributes: ['years', 'fac_id'],
              include: [
                {
                  model: dataScopeModels,
                  attributes: [
                    'name',
                    'lci',
                    'quantity',
                    [eliteral, 'EF'],
                    'kgCO2e',
                  ],
                  include:[
                    {
                      model:GwpModels,
                      attributes:[]
                    },
                    {
                      model:HeadCategoryModels,
                      attributes:['head_name'],
                      include:[
                        {
                         model:ScopeNumberModels,
                         attributes:['name']   
                        }
                      ]
                    }
                  ]
                },
              ],
            },
          ],
        },
      ],
    });
      res.status(200).send(showData);
  } catch (e) {
      res.status(500).send('Server Error ' + e.message);
  }
});


/* app.get('/landscape', async (req, res) => {
    try {
      const results = await conn.query(`
      SELECT
		  headcategories.id as id,
          head_name,
		  campuses.id as campusId,
          campus_name,
          faculties.id as facultiesID,
          fac_name,
          SUM(quantity * (CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs))/1000 AS tco2e,
          scopenums.name AS name,
          years
        FROM
          data_scopes
        INNER JOIN
          gwps ON data_scopes.GWP_id = gwps.id
        INNER JOIN
          headcategories ON data_scopes.head_id = headcategories.id
        INNER JOIN
          scopenums ON headcategories.scopenum_id = scopenums.id
        INNER JOIN
         campuses ON data_scopes.campus_id = campuses.id
         INNER JOIN
         faculties ON data_scopes.fac_id = faculties.id
        WHERE
          scopenum_id = ?
        GROUP BY
          head_id, scopenums.name,faculties.id,years

        UNION
  
        SELECT
          headcategories.id as id,
          head_name,
		  campuses.id as campusId,
          campus_name,
          faculties.id as facultiesID,
          fac_name,
          SUM(quantity * (kgCO2e))/1000 AS tco2e,
          scopenums.name AS name,
          years
        FROM
          data_scopes
        INNER JOIN
          gwps ON data_scopes.GWP_id = gwps.id
        INNER JOIN
          headcategories ON data_scopes.head_id = headcategories.id
        INNER JOIN
          scopenums ON headcategories.scopenum_id = scopenums.id
           INNER JOIN
         campuses ON data_scopes.campus_id = campuses.id
         INNER JOIN
         faculties ON data_scopes.fac_id = faculties.id
        WHERE
          scopenum_id != ?
        GROUP BY
          head_id, scopenums.name,faculties.id,years
        ORDER BY
        	years,campusId,name,id ASC;
      `, {
        replacements: [1, 1],
        type: conn.QueryTypes.SELECT,
      });
  
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/scope/currentApishow',async(req,res)=>{
    try {
      const current = await conn.query(`SELECT
      scopenums.name AS name,
          years,
           SUM(quantity * (CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs))/1000 AS tco2e
          
         FROM
           data_scopes
         INNER JOIN
           gwps ON data_scopes.GWP_id = gwps.id
         INNER JOIN
           headcategories ON data_scopes.head_id = headcategories.id
         INNER JOIN
           scopenums ON headcategories.scopenum_id = scopenums.id
         INNER JOIN
          campuses ON data_scopes.campus_id = campuses.id
          INNER JOIN
          faculties ON data_scopes.fac_id = faculties.id
         WHERE
           scopenum_id = ?
             AND
           years = YEAR(NOW())
         GROUP BY
        scopenums.name,years
 
         UNION
   
         SELECT
         scopenums.name AS name,
           years,
           SUM(quantity * (kgCO2e))/1000 AS tco2e
         FROM
           data_scopes
         INNER JOIN
           gwps ON data_scopes.GWP_id = gwps.id
         INNER JOIN
           headcategories ON data_scopes.head_id = headcategories.id
         INNER JOIN
           scopenums ON headcategories.scopenum_id = scopenums.id
            INNER JOIN
          campuses ON data_scopes.campus_id = campuses.id
          INNER JOIN
          faculties ON data_scopes.fac_id = faculties.id
         WHERE
           scopenum_id != ?
           AND
           years = YEAR(NOW())
         GROUP BY
           scopenums.name,years`, {
        replacements: [1, 1],
        type: conn.QueryTypes.SELECT,
      });
  
      res.status(200).json(current);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); */
  


//แสดง หมวดหมู่ทั้งหมดของ scop1 scope2 scop3 removal separate

app.get('/scope/apiShowAll', async (req, res) => {
    try {
        const showData = await ScopeNumberModels.findAll({
            attributes: ['name'],
            include: [
                {
                    model: HeadCategoryModels,
                    attributes: ['id','head_name'],
                    include: [
                        {
                            model: categoryScopeModels,
                            attributes: [
                                'name',
                                'lci',
                                'CO2',
                                'Fossil_CH4',
                                'CH4',
                                'N2O',
                                'SF6',
                                'NF3',
                                'HFCs',
                                'PFCs',
                                'GWP_HFCs',
                                'GWP_PFCs',
                                [eliteral, 'EF'],
                                'sources',
                                'kgCO2e',
                            ],
                            include: [
                                {
                                    model: GwpModels,
                                    attributes: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        res.status(200).send(showData);
    } catch (e) {
        res.status(500).send('Server Error ' + e.message);
    }
});

/* app.get('/scope/yearData', async (req, res) => {
  try {
    const showData = await CampusModels.findAll({
      attributes: ['id', 'campus_name'],
      include: [
        {
          model: PlaceCmuModels,
          attributes: ['fac_name'],
          include: [
            {
              model: ActivityGHGModel,
              attributes: ['years', 'fac_id'],
              include: [
                {
                  model: dataScopeModels,
                  attributes: [
                    'name',
                    'lci',
                    'quantity',
                    [eliteral, 'EF'],
                    'kgCO2e',
                  ],
                  include:[
                    {
                      model:GwpModels,
                      attributes:[]
                    },
                    {
                      model:HeadCategoryModels,
                      attributes:['head_name'],
                      include:[
                        {
                         model:ScopeNumberModels,
                         attributes:['name']   
                        }
                      ]
                    }
                  ]
                },
              ],
            },
          ],
        },
      ],
    });
      res.status(200).send(showData);
  } catch (e) {
      res.status(500).send('Server Error ' + e.message);
  }
}); */


app.get('/scope/apiHeadCategoryData1',async(req,res)=>{
    try{
        const showData = await HeadCategoryModels.findAll({
          where:{
            scopenum_id:1
          }
        });
        res.status(200).send(showData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
})

app.get('/scope/apiGWP',async(req,res)=>{
    try{
        const showData = await GwpModels.findAll();
        res.status(200).send(showData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
})

app.get('/scope/apiActivityScope',async(req,res)=>{
    try{
        const showData = await ScopeNumberModels.findAll();
        res.status(200).send(showData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
})

app.get('/scope/apiCateScope',async(req,res)=>{
    try{
        const showData = await categoryScopeModels.findAll();
        res.status(200).send(showData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
})


// api  สำหรับการเพิ่มข้อมูล
app.post('/scope/addScopenumber',async(req,res)=>{
    try{
        const addData = await ScopeNumberModels.create(req.body);
        res.status(200).send(addData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
});

app.post('/scope/addGWP',async(req,res)=>{
    try{
        const addData = await GwpModels.create(req.body);
        res.status(200).send(addData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
});

app.post('/scope/addHeadCate',async(req,res)=>{
    try{
        const addData = await HeadCategoryModels.create(req.body);
        res.status(200).send(addData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
});

app.post('/scope/addCategoryScope',async(req,res)=>{
    try{
        const addData = await categoryScopeModels.create(req.body);
        res.status(200).send(addData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
});

//เพิิ่ม DataScope
app.post('/scope/addDataScope',async(req,res)=>{
    try{
      const dataScope = req.body;
      const AddData = await dataScopeModels.bulkCreate(dataScope);
      res.status(200).json(AddData);
    }catch(e){
      res.status(500).json('Error Server' + e.message);
    }
})




module.exports = app;