const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
const conn = require('./connect/con');
require('dotenv').config();
const port = process.env.MYSQL_PORT

const corsOption = {
  origin:'https://netzero-cmu.web.app',
  Credential:true,
} 

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-origin','https://netzero-cmu.web.app');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Credentials',true)
  next()
})

app.use(cors(corsOption)); 





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

app.listen(port,()=>{
    console.log(`server connecting http://localhost:${port}`);
})