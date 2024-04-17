const express = require('express');
const app = express();

const { ScopeNumberCateModels, HeadCategoryModels, GwpModels, categoryScopeModels, dataScopeModels, HeadActivityModels } = require('../models/categoryScope');
const {ActivityGHGModel} =require('../models/activityYear');
const {ReportModel} =require('../models/reportModel');
const conn = require('../connect/con');
const { PlaceCmuModels,CampusModels } = require('../models/placeAtCmuModels');

const eliteral = conn.literal('(CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs)');

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
    const showscopes = await ScopeNumberCateModels.findAll();
    const result = [];

    for (const item of showscopes) {
      let tCO2e;
      const scopeName = item.id;

      // คำนวณ tCO2e ตามเงื่อนไขโดยใช้ SQL expression ในการคำนวณโดยตรงใน query
      const scopeData = await ScopeNumberCateModels.findAll({
        attributes: ['name'],
        include: [
          {
            model: HeadCategoryModels,
            attributes: ['head_name'],
            include: [
              {
                model: dataScopeModels,
                attributes: [
                  'id',
                  'name',
                  'lci',
                  'quantity',
                  [eliteral, 'EF'],
                  'kgCO2e',
                  [
                    conn.literal(`(quantity * (
                      (kgCO2e)  +
                      (CO2 * gwp_CO2) + 
                      (Fossil_CH4 * gwp_Fossil_CH4) + 
                      (CH4 * gwp_CH4) + 
                      (N2O * gwp_N2O) + 
                      (SF6 * gwp_SF6) + 
                      (NF3 * gwp_NF3) + 
                      (HFCs * GWP_HFCs) + 
                      (PFCs * GWP_PFCs)
                    )) / 1000`),
                    'tco2e'
                  ],
                  'month'
                ],
                include: [
                  {
                    model: GwpModels,
                    attributes: [] // เลือกไม่ใช้ attributes จาก GwpModels
                  }
                ]
              }
            ]
          }
        ]
      });

      // เพิ่มข้อมูลลงใน result
      result.push(scopeData);
    }

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
 */
  
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
        const showData = await ScopeNumberModels.findAll({
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


// api  สำหรับการเพิ่มข้อมูล
/**
 * @swagger
 * /scope/addHeadCate:
 *   post:
 *     summary: Add Head Category
 *     description: Add a new head category to the database.
 *     tags: 
 *       - Head Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               head_name:
 *                 type: string
 *               scopenum_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully added Head Category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HeadCategoryModel'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HeadCategoryModel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         head_name:
 *           type: string
 *         scopenum_id:
 *           type: integer
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
 *     summary: Add Head Category
 *     description: Add a new head category to the database.
 *     tags: 
 *       - Head Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               head_name:
 *                 type: string
 *               scopenum_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully added Head Category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HeadCategoryModel'
 *       500:
 *         description: Internal Server Error
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
 *       - Category Scope
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

//เพิิ่ม DataScope
/**
 * @swagger
 * /scope/addDataScope:
 *   post:
 *     summary: Add Data Scope
 *     description: Add data scope to the database.
 *     tags: 
 *       - Data Scope
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

//เช็คว่ามีข้อมูลมไหม
/**
 * @swagger
 * /scope/datasocpe/:activityperiod_id:
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
 * /scope/updateQuantity:
 *   put:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Data Activity]
*/
app.put('/scope/updateQuantity', async (req, res) => {
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
              'month'
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


const {Image} = require('../middleware/Image'); // ใช้ middleware ที่เตรียมไว้
/**
 * @swagger
 * /report/generateRport:
 *   get:
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

module.exports = app;