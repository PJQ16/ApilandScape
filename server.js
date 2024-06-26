const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const ExcelJS = require('exceljs');
const {swaggerSpec,swaggerUi } =require('./connect/swaggerConfig');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads',express.static('./uploads'))
app.use('/images',express.static('./images'))
app.use('/sourcesfile',express.static('./sourcesfile'))
const conn = require('./connect/con');
require('dotenv').config();
const port = process.env.MYSQL_PORT

app.use(cors()); 


app.get('/checkConnect',async(req,res)=>{
    try {
        await conn.authenticate();
        res.status(200).send('Connection has been established successfully.');
      } catch (error) {
        res.status(500).send('Unable to connect to the database:', error);
      }
})

//ใช้ในการจัดการscope หมวดหมู่
app.use(require('./controller/ScopeController'));
app.use(require('./controller/PlaceController'));
app.use(require('./controller/UserController'));
app.use(require('./controller/ActivityPeriodController'));
app.use(require('./controller/SourcesFileController'));
app.use(require('./controller/ImageFileController'));
app.use(require('./controller/UncertaintyController'));
app.use(require('./controller/SignificanceController'));
app.use(require('./controller/ReportController'));
app.use(require('./controller/GoogleMapController'))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port,()=>{
    console.log(`server connecting http://localhost:${port}`);
})