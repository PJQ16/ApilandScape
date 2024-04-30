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
/**
 * @swagger
 * /users/Addrole:
 *   post:
 *     summary: Add Role
 *     description: Add a new role to the database.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleModel'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleModel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         role_name:
 *           type: string
 */

app.post('/users/Addrole',async(req,res)=>{
    try{
        const AddData = await RoleModels.create(req.body);
        res.status(200).json(AddData);
    }catch(e){
        res.status(500).json('Server Error '+ e.message);
    }
})

/**
 * @swagger
 * /users/Addusers:
 *   post:
 *     summary: Add User
 *     description: Add a new user to the database.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               sname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               fac_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/UserModel'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserModel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fname:
 *           type: string
 *         sname:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role_id:
 *           type: integer
 *         fac_id:
 *           type: string
 */

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
      const user = await UsersModels.findOne({ where: { email: email, role_id: 4 } });
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

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UsersModels.findOne({ where: { email: email, role_id: 3 } });
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
  /**
 * @swagger
 * /users/showUserApi:
 *   get:
 *     summary: Show User API
 *     description: Retrieve user details.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/UserDetails'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fname:
 *           type: string
 *         sname:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: object
 *           properties:
 *             role_name:
 *               type: string
 *         place:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             fac_name:
 *               type: string
 *             campus:
 *               type: object
 *               properties:
 *                 campus_name:
 *                   type: string
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 */

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
  
  app.get('/users',async(req,res)=>{
    try{
      const ShowData = await UsersModels.findAll(
        {
          attributes:[
            'fname',
            'sname',
            'email'
          ],
          include:[
            {
              model:RoleModels,
              attributes:['role_name']
            },
            {
              model:PlaceCmuModels,
              attributes:['id','fac_name'],
              include:[
                {
                  model:CampusModels,
                  attributes:['id','campus_name']
                }
              ]

            }
          ]
        }
      )
      res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
  })
  
  app.get('/role',async(req,res)=>{
    try{
      const ShowData = await RoleModels.findAll()
      res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Server Error ' + e.message);
    }
  })

  app.post('/addrole', async (req, res) => {
    try {
        const data = req.body;

        const existingRole = await RoleModels.findAll({ where: { role_name: data.role_name } });
  
        if (existingRole.length > 0) {
            return res.status(400).json('ข้อมูลนี้มีอยู่แล้วในระบบ ');
        } else {
            const addData = await RoleModels.create(data);
            return res.status(200).json(addData);
        }

    } catch (e) {
        res.status(500).json('Server Error ' + e.message);
    }
});
module.exports = app