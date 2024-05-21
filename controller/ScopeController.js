const express = require('express');
const { Op } = require("sequelize");
const app = express();

const { ScopeNumberCateModels, HeadCategoryModels, GwpModels, categoryScopeModels, dataScopeModels, HeadActivityModels } = require('../models/categoryScope');
const {ActivityGHGModel} =require('../models/activityYear');
const {ReportModel} =require('../models/reportModel');
const conn = require('../connect/con');
const { PlaceCmuModels,CampusModels } = require('../models/placeAtCmuModels');
const { QueryTypes } = require('sequelize');
const eliteral = conn.literal('(kgCO2e) + (CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs)');

/**
 * @swagger
 * /landscape:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/landscape', async (req, res) => {
  try {
      const query = `
          SELECT 
              campuses.id AS campus_id,
              campus_name,
              faculties.id AS fac_id,
              fac_name,
              years,
              catescopenums.name AS scope_name,
              headcategories.id as head_id,
              headcategories.head_name,
              data_scopes.name,
              lci,
              SUM((quantity * (
                              (kgCO2e)  +
                              (CO2 * gwp_CO2) + 
                              (Fossil_CH4 * gwp_Fossil_CH4) + 
                              (CH4 * gwp_CH4) + 
                              (N2O * gwp_N2O) + 
                              (SF6 * gwp_SF6) + 
                              (NF3 * gwp_NF3) + 
                              (HFCs * GWP_HFCs) + 
                              (PFCs * GWP_PFCs)
                            )) / 1000) AS tCO2e
          FROM 
              data_scopes 
              INNER JOIN activityperiods ON data_scopes.activityperiod_id = activityperiods.id 
              INNER JOIN gwps ON data_scopes.GWP_id = gwps.id  
              INNER JOIN faculties ON activityperiods.fac_id = faculties.id
              INNER JOIN campuses ON faculties.campus_id = campuses.id
              INNER JOIN headcategories ON data_scopes.head_id = headcategories.id
              INNER JOIN catescopenums ON headcategories.scopenum_id = catescopenums.id
          GROUP BY
              campus_id,
              fac_id,
              activityperiods.id,
              years,
              catescopenums.id,
              catescopenums.name,
              headcategories.head_name,
              data_scopes.name,
              lci`;

      const data = await conn.query(query, { type: QueryTypes.SELECT });

      const formattedData = [];
      let currentCampusId = null;
      let currentFacId = null;
      let currentActivityPeriodId = null;
      let campus = null;
      let faculty = null;
      let activityPeriod = null;

      data.forEach(item => {
          if (item.campus_id !== currentCampusId) {
              currentCampusId = item.campus_id;
              campus = {
                  id: currentCampusId,
                  campus_name: item.campus_name,
                  faculties: []
              };
              formattedData.push(campus);
              currentFacId = null;
          }

          if (item.fac_id !== currentFacId) {
              currentFacId = item.fac_id;
              faculty = {
                  id: currentFacId,
                  fac_name: item.fac_name,
                  activityperiods: []
              };
              campus.faculties.push(faculty);
              currentActivityPeriodId = null;
          }

          if (item.years !== currentActivityPeriodId) {
              currentActivityPeriodId = item.years;
              activityPeriod = {
                  years: item.years,
                  scopenums: []
              };
              faculty.activityperiods.push(activityPeriod);
          }

          const scopeIndex = activityPeriod.scopenums.findIndex(scope => scope.name === item.scope_name);
          if (scopeIndex === -1) {
              activityPeriod.scopenums.push({
                  name: item.scope_name,
                  headcategories: [
                      {
                          head_id: item.head_id,
                          head_name: item.head_name,
                         
                          data_scopes: [
                              {
                                  name: item.name,
                                  lci: item.lci,
                                  tCO2e: item.tCO2e
                              }
                          ]
                      }
                  ]
              });
          } else {
              const headIndex = activityPeriod.scopenums[scopeIndex].headcategories.findIndex(head => head.head_name === item.head_name);
              if (headIndex === -1) {
                  activityPeriod.scopenums[scopeIndex].headcategories.push({
                      head_id: item.head_id,
                      head_name: item.head_name,
                      data_scopes: [
                          {
                              name: item.name,
                              lci: item.lci,
                              tCO2e: item.tCO2e
                          }
                      ]
                  });
              } else {
                  activityPeriod.scopenums[scopeIndex].headcategories[headIndex].data_scopes.push({
                      name: item.name,
                      lci: item.lci,
                      tCO2e: item.tCO2e
                  });
              }
          }
      });

      // เรียงลำดับ headcategories ตาม head_id จากน้อยไปมาก
      formattedData.forEach(campus => {
          campus.faculties.forEach(faculty => {
              faculty.activityperiods.forEach(activityPeriod => {
                  activityPeriod.scopenums.forEach(scope => {
                      scope.headcategories.sort((a, b) => a.head_id - b.head_id);
                  });
              });
          });
      });

      res.status(200).json(formattedData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

//แสดงข้อมูล หน้าการกรอกข้อมูล 
/**
 * @swagger
 * /showHeadActivity:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/showHeadActivity',async(req,res)=>{
  try{
    const showData = await ScopeNumberCateModels.findAll({
      attributes:['id','name'],
        include:[
          {
            model:HeadCategoryModels,
            attributes:['head_name'],
             include:[
              {
                model:categoryScopeModels,
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
              }
             ]
          }
        ]
    })
    res.status(200).json(showData);

  }catch(err){
    res.status(500).json('Server Error' + err.message);
  }
})

/**
 * @swagger
 * /datascope/summary/:years/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/datascope/summary/:years/:id', async (req, res) => {
  try {
      const rawquery = await conn.query(`
          SELECT 
              years,
              SUM(quantity * (
                  (CO2 * gwp_CO2) + 
                  (Fossil_CH4 * gwp_Fossil_CH4) + 
                  (CH4 * gwp_CH4) + 
                  (N2O * gwp_N2O) + 
                  (SF6 * gwp_SF6) + 
                  (NF3 * gwp_NF3) + 
                  (HFCs * GWP_HFCs) + 
                  (PFCs * GWP_PFCs)
              ) / 1000) AS tco2e, 
              catescopenums.name AS name  
          FROM 
              catescopenums 
          INNER JOIN 
              headcategories ON catescopenums.id = headcategories.scopenum_id 
          INNER JOIN  
              data_scopes ON headcategories.id = data_scopes.head_id 
          INNER JOIN 
              gwps ON data_scopes.GWP_id = gwps.id 
          INNER JOIN 
              activityperiods ON data_scopes.activityperiod_id = activityperiods.id 
          WHERE 
              catescopenums.id = :catescopenum_id 
              AND years = :years  
              AND activityperiod_id = :id
          GROUP BY 
              catescopenums.name, activityperiods.years

          UNION

          SELECT 
              years,
              SUM(quantity * (kgCO2e) / 1000) AS tco2e, 
              catescopenums.name AS name  
          FROM 
              catescopenums 
          INNER JOIN 
              headcategories ON catescopenums.id = headcategories.scopenum_id 
          INNER JOIN  
              data_scopes ON headcategories.id = data_scopes.head_id 
          INNER JOIN 
              gwps ON data_scopes.GWP_id = gwps.id 
          INNER JOIN 
              activityperiods ON data_scopes.activityperiod_id = activityperiods.id 
          WHERE 
              catescopenums.id != :catescopenum_id 
              AND years = :years 
              AND activityperiod_id = :id 
          GROUP BY 
              catescopenums.name, activityperiods.years;
      `, { replacements: { catescopenum_id: 1, years: req.params.years, id: req.params.id }, type: conn.QueryTypes.SELECT });

      res.status(200).json(rawquery);
  } catch (e) {
      res.status(500).json('Server Error ' + e.message);
  }
});

  
/**
 * @swagger
 * /scope/currentApishow:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
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
  }); 
  
//แสดง หมวดหมู่ทั้งหมดของ scop1 scope2 scop3 removal separate

/**
 * @swagger
 * /scope/apiShowAll:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/scope/apiShowAll', async (req, res) => {
    try {
        const showData = await categoryScopeModels.findAll({
            attributes: ['id','name'],
            include: [
                {
                    model: HeadCategoryModels,
                    attributes: ['id','head_name'],
                    include: [
                        {
                            model: dataScopeModels,
                            attributes: [
                                'id',
                                'name',
                                'lci',
                                'quantity',
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

/**
 * @swagger
 * /scope/apiHeadCategoryData1:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
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

/**
 * @swagger
 * /scope/apiGWP:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/scope/apiGWP',async(req,res)=>{
    try{
        const showData = await GwpModels.findAll();
        res.status(200).send(showData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
})

/**
 * @swagger
 * /scope/apiActivityScope:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/scope/apiActivityScope',async(req,res)=>{
    try{
        const showData = await ScopeNumberModels.findAll();
        res.status(200).send(showData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
})

/**
 * @swagger
 * /scope/apiCateScope:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/scope/apiCateScope',async(req,res)=>{
    try{
        const showData = await categoryScopeModels.findAll();
        res.status(200).send(showData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
})


//เช็คว่ามีข้อมูลมไหม
/**
 * @swagger
 * /checkExistingData/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/checkExistingData/:id', async (req, res) => {
  try {
    const { id } = req.params; // เรียกใช้ id จาก params ไม่ใช่ query

    // ตรวจสอบข้อมูลใน activityperiod_id ว่ามีหรือไม่
    const existingData = await dataScopeModels.findAll({
      attributes: ['id', 'name'],
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
              where: {
                activityperiod_id: id, // ตั้งค่าเงื่อนไข where เพื่อกรองด้วย activityperiod_id
              },
    });

    res.status(200).json(existingData);
  } catch (err) {
    res.status(500).json('Server Error' + err.message);
  }
});


//แสดง api  สำหรับการเพิ่มข้อมูล
/**
 * @swagger
 * /scope/datasocpe/:activityperiod_id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/scope/datasocpe/:activityperiod_id', async (req, res) => {
  try {
      const result = await ScopeNumberCateModels.findAll({
        attributes:['id','name'],
        include:[{
          model:HeadCategoryModels,
          attributes:['id','head_name'],
          include:[{
            model:dataScopeModels,
            attributes: [
              'id',
              'name',
              'lci',
              'quantity',
              [eliteral, 'EF'],
              'kgCO2e',
              'month',
              'head_id'
          ],
          where:{
            activityperiod_id:req.params.activityperiod_id
          },
            include:[
              {
                model:GwpModels,
                attributes:[]
              }
            ]
          }]
        }]
      }
      
      );
      res.status(200).json(result);
  } catch (e) {
      res.status(500).json('Server Error ' + e.message);
  }
});

//สำหรับผู้ตรวจสอบ
//แสดง api  สำหรับการเพิ่มข้อมูล
/**
 * @swagger
 * /scope/datasocpeTester/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/scope/datasocpeTester/:id', async (req, res) => {
  try {
    const showData = await ScopeNumberCateModels.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: HeadCategoryModels,
        attributes: ['id', 'head_name']
      }]
    });
     
    const result = await dataScopeModels.findAll({
      attributes: [
        'id',
        'head_id',
        'name',
        [conn.fn('sum', conn.col('quantity')), 'quantity'],
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
        'kgCO2e',
        'sources'
      ],
      where: {
        activityperiod_id: req.params.id
      },
      group: ['head_id', 'name'],
      order: [['id', 'ASC']],
      include: [{
        model: GwpModels,
        attributes: []
      }]
    });
    
    // จัดรูปแบบข้อมูลใหม่
    const data = showData.map(item => ({
      id: item.id,
      name: item.name,
      headcategories: item.headcategories.map(headCategory => ({
        id: headCategory.id,
        head_name: headCategory.head_name,
        data_scopes: result
          .filter(scope => scope.head_id === headCategory.id)
          .map(scope => ({
            id: scope.id,
            head_id: scope.head_id,
            name: scope.name,
            quantity: scope.quantity,
            lci: scope.lci,
            CO2: scope.CO2,
            Fossil_CH4: scope.Fossil_CH4,
            CH4: scope.CH4,
            N2O: scope.N2O,
            SF6: scope.SF6,
            NF3: scope.NF3,
            HFCs: scope.HFCs,
            PFCs: scope.PFCs,
            GWP_HFCs: scope.GWP_HFCs,
            GWP_PFCs: scope.GWP_PFCs,
            EF: scope.kgCO2e,
            sources: scope.sources
          }))
      }))
    }));
    
    
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json('Server Error ' + e.message);
  }
});


/**
 * @swagger
 * /data_scope/:activityperiod_id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.get('/data_scope/:activityperiod_id',async(req,res)=>{
  try{
    const showData = await dataScopeModels.findAll({
      where:{
        activityperiod_id:req.params.activityperiod_id
      }
    })
    res.status(200).json(showData);
  }catch(err){
    res.status(500).json('Server Error ' + err.message);
  }
})

/**
 * @swagger
 * /scope:
 *   get:
 *     summary: Get all Scope Number Categories
 *     description: Retrieve all Scope Number Categories.
 *     tags: 
 *       - Data Activity
 *     responses:
 *       '200':
 *         description: Successfully retrieved Scope Number Categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the Scope Number Category
 *                   name:
 *                     type: string
 *                     description: The name of the Scope Number Category
 *                   value:
 *                     type: number
 *                     description: The value of the Scope Number Category
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
app.get('/scope',async(req,res)=>{
  try{
    const ShowData = await ScopeNumberCateModels.findAll()

    res.status(200).json(ShowData);

  }catch(e){
    res.status(500).json('Server Error ' + e.message);
  }
});

/**
 * @swagger
 * /headscope/:id:
 *   get:
 *     summary: Get Head Categories by Scope Number Category ID
 *     description: Retrieve Head Categories by providing the Scope Number Category ID.
 *     tags: 
 *       - Data Activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Scope Number Category
 *     responses:
 *       '200':
 *         description: Successfully retrieved Head Categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the Head Category
 *                   name:
 *                     type: string
 *                     description: The name of the Head Category
 *                   description:
 *                     type: string
 *                     description: The description of the Head Category
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

app.get('/headscope/:id',async(req,res)=>{
  try{
    const ShowData = await HeadCategoryModels.findAll({
      where:{
        scopenum_id:req.params.id
      }
    }
    )

    res.status(200).json(ShowData);

  }catch(e){
    res.status(500).json('Server Error ' + e.message);
  }
})

/**
 * @swagger
 * /categoryScope/:head_id:
 *   get:
 *     summary: Get Category Scopes by Head Category ID
 *     description: Retrieve Category Scopes by providing the Head Category ID.
 *     tags: 
 *       - Data Activity
 *     parameters:
 *       - in: path
 *         name: head_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Head Category
 *     responses:
 *       '200':
 *         description: Successfully retrieved Category Scopes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the Category Scope
 *                   name:
 *                     type: string
 *                     description: The name of the Category Scope
 *                   lci:
 *                     type: string
 *                     description: The life cycle inventory
 *                   CO2:
 *                     type: number
 *                     description: The CO2 value
 *                   Fossil_CH4:
 *                     type: number
 *                     description: The Fossil CH4 value
 *                   CH4:
 *                     type: number
 *                     description: The CH4 value
 *                   N2O:
 *                     type: number
 *                     description: The N2O value
 *                   SF6:
 *                     type: number
 *                     description: The SF6 value
 *                   NF3:
 *                     type: number
 *                     description: The NF3 value
 *                   HFCs:
 *                     type: number
 *                     description: The HFCs value
 *                   PFCs:
 *                     type: number
 *                     description: The PFCs value
 *                   GWP_HFCs:
 *                     type: number
 *                     description: The GWP HFCs value
 *                   GWP_PFCs:
 *                     type: number
 *                     description: The GWP PFCs value
 *                   kgCO2e:
 *                     type: number
 *                     description: The kgCO2e value
 *                   sources:
 *                     type: string
 *                     description: The sources of data
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

app.get('/categoryScope/:head_id',async(req,res)=>{
  try{
    const ShowData = await categoryScopeModels.findAll(
      {
        attributes:['id','name','lci','CO2','Fossil_CH4','CH4','N2O','SF6','NF3','HFCs','PFCs','GWP_HFCs','GWP_PFCs','kgCO2e','sources'],
        where:{
          head_id:req.params.head_id
        }
      }
    )

    res.status(200).json(ShowData);

  }catch(e){
    res.status(500).json('Server Error ' + e.message);
  }
})


// api  สำหรับการเพิ่มข้อมูล
/**
 * @swagger
 * /scope/addGWP:
 *   post:
 *     summary: Add a new GWP (Global Warming Potential)
 *     description: Add a new Global Warming Potential (GWP) by providing the necessary data.
 *     tags: [Data Activity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the GWP
 *               value:
 *                 type: number
 *                 description: The value of the GWP
 *     responses:
 *       '200':
 *         description: GWP added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the added GWP
 *                 name:
 *                   type: string
 *                   description: The name of the GWP
 *                 value:
 *                   type: number
 *                   description: The value of the GWP
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
app.post('/scope/addGWP',async(req,res)=>{
    try{
        const addData = await GwpModels.create(req.body);
        res.status(200).send(addData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
});

/**
 * @swagger
 * /scope/addHeadCate:
 *   post:
 *     summary: Add a new Head Category
 *     description: Add a new Head Category by providing the necessary data.
 *     tags: 
 *       - Data Activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Head Category
 *               description:
 *                 type: string
 *                 description: The description of the Head Category
 *     responses:
 *       '200':
 *         description: Head Category added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the added Head Category
 *                 name:
 *                   type: string
 *                   description: The name of the Head Category
 *                 description:
 *                   type: string
 *                   description: The description of the Head Category
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

app.post('/scope/addHeadCate',async(req,res)=>{
    try{
        const addData = await HeadCategoryModels.create(req.body);
        res.status(200).send(addData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
});

/**
 * @swagger
 * /scope/addCategoryScope:
 *   post:
 *     summary: Add Category Scope
 *     description: Add a new category scope to the database.
 *     tags: 
 *      - Data Activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lci:
 *                 type: string
 *               CO2:
 *                 type: number
 *               Fossil_CH4:
 *                 type: number
 *               CH4:
 *                 type: number
 *               N2O:
 *                 type: number
 *               SF6:
 *                 type: number
 *               NF3:
 *                 type: number
 *               HFCs:
 *                 type: number
 *               PFCs:
 *                 type: number
 *               GWP_HFCs:
 *                 type: number
 *               GWP_PFCs:
 *                 type: number
 *               kgCO2e:
 *                 type: number
 *               sources:
 *                 type: string
 *               head_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully added Category Scope
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryScopeModel'
 *       500:
 *         description: Internal Server Error
 */

app.post('/scope/addCategoryScope',async(req,res)=>{
    try{
        const addData = await categoryScopeModels.create(req.body);
        res.status(200).send(addData);
    }catch(e){
        res.status(500).send('Server Error' + e.message);
    }
});



app.put('/scope/updateCategoryScope/:id',async(req,res)=>{
  try{
       const addData = await categoryScopeModels.update(req.body,{
        where:{
          id:req.params.id
        }
      }); 
       res.status(200).json(addData); 
  }catch(e){
      res.status(500).json('Server Error' + e.message);
  }
});

app.delete('/catescopeDelete/:id',async(req,res)=>{
  try{
        const removeData = await categoryScopeModels.destroy({
        where:{
          id:req.params.id
        }
      });  
       res.status(200).json(removeData);
  }catch(e){
      res.status(500).json('Server Error' + e.message);
  }
});


//เพิิ่ม DataScope
/**
 * @swagger
 * /scope/addDataScope:
 *   post:
 *     summary: Add Data Scope
 *     description: Add data scope to the database.
 *     tags: 
 *      - Data Activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/DataScopeModel'
 *     responses:
 *       200:
 *         description: Successfully added Data Scope
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataScopeModel'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DataScopeModel:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         quantity:
 *           type: number
 *         lci:
 *           type: string
 *         CO2:
 *           type: number
 *         Fossil_CH4:
 *           type: number
 *         CH4:
 *           type: number
 *         N2O:
 *           type: number
 *         SF6:
 *           type: number
 *         NF3:
 *           type: number
 *         HFCs:
 *           type: number
 *         PFCs:
 *           type: number
 *         GWP_HFCs:
 *           type: number
 *         GWP_PFCs:
 *           type: number
 *         kgCO2e:
 *           type: number
 *         sources:
 *           type: string
 *         GWP_id:
 *           type: integer
 *         head_id:
 *           type: integer
 *         fac_id:
 *           type: string
 *         campus_id:
 *           type: string
 *         activityperiod_id:
 *           type: integer
 *         month:
 *           type: integer
 */

app.post('/scope/addDataScope',async(req,res)=>{
    try{
      const dataScope = req.body;
      const AddData = await dataScopeModels.bulkCreate(dataScope);
      res.status(200).json(AddData);
    }catch(e){
      res.status(500).json('Error Server' + e.message);
    }
})


/**
 * @swagger
 * /generateActivity:
 *   post:
 *     summary: Generate Activity
 *     description: Generate activity data based on provided parameters.
 *     tags: 
 *       - Data Activity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activityperiod_id:
 *                 type: integer
 *                 description: ID of the activity period
 *               fac_id:
 *                 type: integer
 *                 description: ID of the facility
 *               campus_id:
 *                 type: integer
 *                 description: ID of the campus
 *     responses:
 *       '200':
 *         description: Activity generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the generated activity data
 *                   name:
 *                     type: string
 *                     description: The name of the category scope
 *                   lci:
 *                     type: string
 *                     description: The life cycle inventory
 *                   CO2:
 *                     type: number
 *                     description: The CO2 value
 *                   Fossil_CH4:
 *                     type: number
 *                     description: The Fossil CH4 value
 *                   CH4:
 *                     type: number
 *                     description: The CH4 value
 *                   N2O:
 *                     type: number
 *                     description: The N2O value
 *                   SF6:
 *                     type: number
 *                     description: The SF6 value
 *                   NF3:
 *                     type: number
 *                     description: The NF3 value
 *                   HFCs:
 *                     type: number
 *                     description: The HFCs value
 *                   PFCs:
 *                     type: number
 *                     description: The PFCs value
 *                   GWP_HFCs:
 *                     type: number
 *                     description: The GWP HFCs value
 *                   GWP_PFCs:
 *                     type: number
 *                     description: The GWP PFCs value
 *                   kgCO2e:
 *                     type: number
 *                     description: The kgCO2e value
 *                   sources:
 *                     type: string
 *                     description: The sources of data
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
app.post('/generateActivity', async (req, res) => {
  try {
      const cateScopes = await categoryScopeModels.findAll();

      const { activityperiod_id, fac_id, campus_id } = req.body;

      const bulkData = cateScopes.flatMap(cateScope => {
          const bulkDataPerMonth = [];
          for (let month = 1; month <= 12; month++) {
              bulkDataPerMonth.push({
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
                  head_id: cateScope.head_id,
                  fac_id: fac_id,
                  campus_id: campus_id,
                  activityperiod_id: activityperiod_id,
                  month: month
              });
          }
          return bulkDataPerMonth;
      });
       const generateData = await dataScopeModels.bulkCreate(bulkData);
 
      res.status(200).json(generateData);
  } catch (err) {
      res.status(500).json('Server Error' + err.message);
  }
});


//update ค่าที่ได้จาก activity ในการกรอกข้อมูล บันทึกแบบauto
//แสดง api  สำหรับการเพิ่มข้อมูล
/**
 * @swagger
 * /scope/updateQuantity/:id:
 *   put:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.put('/scope/updateQuantity/:id', async (req, res) => {
  try {
    const payload = req.body;
    const id = payload.id; // รับค่า id จาก payload
    
    const quantity = payload.quantity; // รับค่า quantity จาก payload    
    // ดำเนินการอัพเดทข้อมูลโดยใช้ฟังก์ชัน update() ของโมเดล
    const modifyData = await dataScopeModels.update({ quantity }, {
      where: { id } // ระบุเงื่อนไขในการอัพเดทโดยใช้ id
    });

    res.status(200).json(modifyData); // ส่งข้อความแจ้งว่าอัปเดตข้อมูลสำเร็จ

  } catch (e) {
    res.status(500).json('Server Error ' + e.message); // หากเกิดข้อผิดพลาดในการอัปเดตข้อมูล
  }
});




const {Image} = require('../middleware/Image'); // ใช้ middleware ที่เตรียมไว้
/**
 * @swagger
 * /report/generateRport:
 *   post:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Report]
*/
app.post('/report/generateRport', Image, async (req, res) => {
  try{
    const data = {
      ...req.body,
      image_name: req.file.filename // ชื่อไฟล์ที่อัพโหลด
    };
    const addData = await ReportModel.create(data);  
    res.status(200).json(addData); 

  }catch(e){
      res.status(500).json('Server Error '+ e.message)
  }
});


//เช็คอัพเดท fuel 
/**
 * @swagger
 * /datascope/pullDataFuel/:id:
 *   put:
 *     summary: Pull Data Fuel
 *     description: Update data for fuel categories based on provided parameters.
 *     tags: 
 *       - Data Activity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the activity period
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: update successfully
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

app.put('/datascope/pullDataFuel/:id',async(req,res)=>{
  try{
     //มาอัพเดทค่า scope3
     const showData1 = await dataScopeModels.findAll(
      {
        attributes: [
          "id",
          "name",
          [conn.fn("sum", conn.col("quantity")), "quantity"],
          "lci",
          "month",
          "activityperiod_id"
        ],
        where: {
          head_id: { [Op.between]: [1, 3] },
          activityperiod_id: req.params.id
        },
        group: ["name", "month"],
        order: [["id", "ASC"]]
      }
    )
 
    const showData2 = await dataScopeModels.findAll({
        attributes: [
          "id",
          "name",
         "quantity",
          "lci",
          "month",
          "activityperiod_id"
        ],
      where: {
        head_id: 8,
        [Op.or]: [
          { name: 'Electricity from PEA' },
          { name: 'Electricity from Private Company' }
        ],
        activityperiod_id: req.params.id
      },
      order: [['id', 'ASC']]
    });

     const combinedData = [...showData1,...showData2]; 
     

// ทำการสร้างข้อมูลที่จะถูกใช้ในการอัพเดท
const updateData = combinedData.map(data => ({
  quantity: data.quantity, // ใช้ค่าที่คำนวณไว้ล่วงหน้าเป็นค่าใหม่สำหรับ quantity
  // เพิ่มเงื่อนไข WHERE เพื่อให้อัพเดทเฉพาะข้อมูลที่มีชื่อและเดือนตรงกัน
  where: {
    head_id:11,
    name: data.name,
    month: data.month,
    activityperiod_id: data.activityperiod_id
  }
}));
// ลูปผ่านข้อมูลที่จะถูกใช้ในการอัพเดทและดำเนินการอัพเดทแยกตามแต่ละรายการ
for (const data of updateData) {
  await dataScopeModels.update({ quantity: data.quantity }, { where: data.where });
}

//สำหรับรายงานแยก1
  const separateUpdate = await dataScopeModels.findAll({
    where:{
      name:{
        [Op.in]: ['Biodiesel', 'Biogas', 'Biomass'],
      },
      activityperiod_id: req.params.id,
      head_id: {
        [Op.eq]: 1, // ใช้ Op.eq แทนเพื่อให้ Sequelize รู้ว่าเป็นเงื่อนไขที่เท่ากัน
      },
    }
  })

  const separateSyncData  = separateUpdate.map(data =>({
    quantity: data.quantity,
    where: {
      head_id:30,
      name: data.name,
      month: data.month,
      activityperiod_id: data.activityperiod_id
    } 
  }))

  for (const dataSeparate of separateSyncData) {
    await dataScopeModels.update({ quantity: dataSeparate.quantity }, { where: dataSeparate.where });
  }

  //สำหรับรายงานแยก 3
  const separateUpdate3 = await dataScopeModels.findAll({
    where:{
      name:{
        [Op.in]: ['Biodiesel', 'Biogas'],
      },
      activityperiod_id: req.params.id,
      head_id: {
        [Op.eq]: 3, // ใช้ Op.eq แทนเพื่อให้ Sequelize รู้ว่าเป็นเงื่อนไขที่เท่ากัน
      },
    }
  })

  const separateSyncData3  = separateUpdate3.map(data =>({
    quantity: data.quantity,
    where: {
      head_id:31,
      name: data.name,
      month: data.month,
      activityperiod_id: data.activityperiod_id
    } 
  }))

  for (const dataSeparate3 of separateSyncData3) {
    await dataScopeModels.update({ quantity: dataSeparate3.quantity }, { where: dataSeparate3.where });
  }


  //สำหรับรายงานแยก 7
  const separateUpdate7 = await dataScopeModels.findAll({
    where:{
      activityperiod_id: req.params.id,
      head_id: {
        [Op.eq]: 7, // ใช้ Op.eq แทนเพื่อให้ Sequelize รู้ว่าเป็นเงื่อนไขที่เท่ากัน
      },
    }
  })

  const separateSyncData7  = separateUpdate7.map(data =>({
    quantity: data.quantity,
    where: {
      head_id:32,
      name: data.name,
      month: data.month,
      activityperiod_id: data.activityperiod_id
    } 
  }))

  for (const dataSeparate7 of separateSyncData7) {
    await dataScopeModels.update({ quantity: dataSeparate7.quantity }, { where: dataSeparate7.where });
  }

   //สำหรับรายงานแยก 33
    const separateUpdate33 = await dataScopeModels.findAll({
      attributes: [
        'id',
        [conn.fn('sum', conn.col('quantity')), 'quantity'],
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
        'kgCO2e',
        'sources',
        'GWP_id',
        'head_id',
        'fac_id',
        'campus_id',
        'activityperiod_id',
        'month',
        'createdAt',
        'updatedAt'
      ],
      where: {
        activityperiod_id: req.params.id,
        head_id: 28
      },
      group: ['month'],
      order: [['id', 'ASC']]
  })

  const separateSyncData33  = separateUpdate33.map(data =>({
    quantity: data.quantity,
    where: {
      head_id:33,
      month: data.month,
      activityperiod_id: data.activityperiod_id
    } 
  }))

  for (const dataSeparate33 of separateSyncData33) {
    await dataScopeModels.update({ quantity: dataSeparate33.quantity }, { where: dataSeparate33.where });
  } 


    res.status(200).json('update successfully');
  }catch(e){
    res.status(500).json('Server Error ' + e.message);
  }
})

app.get('/dividData/:id', async (req, res) => {
  try {
    const result = await dataScopeModels.count({
      where: {
        activityperiod_id: req.params.id,
        name: 'CH4 จากน้ำขังในพื้นที่นา',
        quantity: {
          [Op.ne]: 0.000,
        },
      },
    });

    res.status(200).json(result);
  }catch(e){
    res.status(500).json('Server Error ' + e.message);
  }
})

app.get('/dataDashboard', async (req, res) => {
  try {
    const query = `SELECT   years,catescopenums.name as scopename,
    SUM((quantity * (
                                  (kgCO2e)  +
                                  (CO2 * gwp_CO2) + 
                                  (Fossil_CH4 * gwp_Fossil_CH4) + 
                                  (CH4 * gwp_CH4) + 
                                  (N2O * gwp_N2O) + 
                                  (SF6 * gwp_SF6) + 
                                  (NF3 * gwp_NF3) + 
                                  (HFCs * GWP_HFCs) + 
                                  (PFCs * GWP_PFCs)
                                )) / 1000) AS tCO2e
                              
                                FROM catescopenums 
    INNER JOIN headcategories on catescopenums.id =  headcategories.scopenum_id 
    INNER JOIN data_scopes on headcategories.id = data_scopes.head_id 
    INNER JOIN gwps on data_scopes.GWP_id = gwps.id
    INNER JOIN activityperiods on data_scopes.activityperiod_id = activityperiods.id
    GROUP by years,scopename
    ORDER BY data_scopes.id ASC;`;

    const data = await conn.query(query, { type: QueryTypes.SELECT });

    // Restructure data into desired format
    const result = data.reduce((acc, item) => {
      let year = acc.find(y => y.year === item.years);
      if (!year) {
        year = { year: item.years, scope: [] };
        acc.push(year);
      }

      year.scope.push({
        scopename: item.scopename,
        tCO2e: item.tCO2e
      });

      return acc;
    }, []);

    // Send only the 'years' array as response
    res.json(result.map(item => ({ year: item.year, scope: item.scope })));

  } catch (e) {
    res.status(500).json('Server Error ' + e.message);
  }
});

module.exports = app;