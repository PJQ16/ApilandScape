const express = require('express');
const app = express();

const { ScopeNumberModels, HeadCategoryModels, GwpModels, categoryScopeModels } = require('../models/categoryScope');
const conn = require('../connect/con');
//APi สำหรับการ แสดงผลลัพท์ของแต่ละ scope แบบแยกตามประเภท Activity 
app.get('/socpe/apiShowResultData', async (req, res) => {
    try {
      const results = await conn.query(`
        SELECT
          head_name,
          SUM(quantity * (CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs))/1000 AS tco2e,
          scopenums.name AS name
        FROM
          data_scopes
        INNER JOIN
          gwps ON data_scopes.GWP_id = gwps.id
        INNER JOIN
          headcategories ON data_scopes.head_id = headcategories.id
        INNER JOIN
          scopenums ON headcategories.scopenum_id = scopenums.id
        WHERE
          scopenum_id = ?
        GROUP BY
          head_id, scopenums.name
  
        UNION
  
        SELECT
          head_name,
          SUM(quantity * (kgCO2e))/1000 AS tco2e,
          scopenums.name AS name
        FROM
          data_scopes
        INNER JOIN
          gwps ON data_scopes.GWP_id = gwps.id
        INNER JOIN
          headcategories ON data_scopes.head_id = headcategories.id
        INNER JOIN
          scopenums ON headcategories.scopenum_id = scopenums.id
        WHERE
          scopenum_id != ?
        GROUP BY
          head_id, scopenums.name
      `, {
        replacements: [1, 1], // ตัวเลข 1 แทน ? ใน query
        type: conn.QueryTypes.SELECT,
      });
  
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


//แสดง หมวดหมู่ทั้งหมดของ scop1 scope2 scop3 removal separate
const eliteral = conn.literal('(CO2 * gwp_CO2) + (Fossil_CH4 * gwp_Fossil_CH4) + (CH4 * gwp_CH4) + (N2O * gwp_N2O) + (SF6 * gwp_SF6) + (NF3 * gwp_NF3) + (HFCs * GWP_HFCs) + (PFCs * GWP_PFCs)');
app.get('/scope/apiShowAll', async (req, res) => {
    try {
        const showData = await categoryScopeModels.findAll({
            attributes: [
                'headcategory.head_name',
                'name',
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
                {
                    model: HeadCategoryModels,
                    attributes: ['head_name'],  
                }
        ]
        });
        res.status(200).send(showData);
    } catch (e) {
        res.status(500).send('Server Error ' + e.message);
    }
});


app.get('/scope/apiHeadCategoryData',async(req,res)=>{
    try{
        const showData = await HeadCategoryModels.findAll();
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




module.exports = app;