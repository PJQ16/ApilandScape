const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
app.use(express.json());
require('dotenv').config();
const Service = require('../controller/Service');

const {RoleModels,UsersModels} = require('../models/userModel');
const {PlaceCmuModels, CampusModels} = require('../models/placeAtCmuModels');

//เพิ่มข้อมูล
app.post('/users/Addrole',async(req,res)=>{
    try{
        const AddData = await RoleModels.create(req.body);
        res.status(200).json(AddData);
    }catch(e){
        res.status(500).json('Server Error '+ e.message);
    }
})
app.post('/users/Addusers', async (req, res) => {
    try {
        const { fname, sname, email, password, role_id, fac_id } = req.body;
        const AddData = await UsersModels.create({
            fname,
            sname,
            email, 
            password, 
            role_id, 
            fac_id
        })
        res.status(200).json({ message: 'Success', data : AddData });
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
});


app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UsersModels.findOne({ where: { email }});

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Create JWT token
        const secretKey = process.env.SECRET_KEY; // Replace with your actual secret key
        const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

        // Send JWT token to the client for authentication
        res.status(200).json({ message: 'success', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  
  //แสดงข้อมูลuser และ บทบาท หน่วยงานที่สังกัด
  app.get('/users/showUserApi', Service.isLogin, async (req, res) => {
    try {
      const payLoad = jwt.decode(Service.getToken(req));
      const users = await UsersModels.findByPk(payLoad.userId, {
        attributes: ['id', 'fname', 'sname', 'email'],
        include: [
          {
            model: RoleModels,
            attributes: ['role_name'],
          },
          {
            model: PlaceCmuModels,
            attributes: ['id','fac_name','campus_id','latitude','longitude'],
            include: [
              {
                model: CampusModels,
                attributes: ['campus_name'],
              },
            ],
          },
        ],

      });
      res.status(200).json({ result: users, message: 'success' });
    } catch (e) {
      res.status(500).json('Server Error ' + e.message);
    }
  });
  

module.exports = app