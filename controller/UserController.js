const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
app.use(express.json());
require('dotenv').config();
const Service = require('../controller/Service');

const {RoleModels,UsersModels} = require('../models/userModel');
const {PlaceCmuModels, CampusModels} = require('../models/placeAtCmuModels');

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
          attributes: ['id','fac_name','campus_id','latitude','longitude','logo'],
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

/**
* @swagger
* /users:
*   get:
*     summary: Get Users
*     description: Retrieve a list of users with their details including first name, last name, email, role, facility name, and campus name.
*     tags:
*       - Users
*     responses:
*       '200':
*         description: A list of users with details
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   fname:
*                     type: string
*                     description: First name of the user
*                   sname:
*                     type: string
*                     description: Last name of the user
*                   email:
*                     type: string
*                     description: Email address of the user
*                   role:
*                     type: object
*                     properties:
*                       id:
*                         type: number
*                         description: Role ID
*                       role_name:
*                         type: string
*                         description: Role name
*                   place:
*                     type: object
*                     properties:
*                       id:
*                         type: number
*                         description: Facility ID
*                       fac_name:
*                         type: string
*                         description: Facility name
*                       campus:
*                         type: object
*                         properties:
*                           id:
*                             type: number
*                             description: Campus ID
*                           campus_name:
*                             type: string
*                             description: Campus name
*       '500':
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Server Error Internal server error
*/

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
            attributes:['id','role_name']
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

/**
* @swagger
* /role:
*   get:
*     summary: Get Roles
*     description: Retrieve a list of roles.
*     tags:
*       - Users
*     responses:
*       '200':
*         description: A list of roles
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: number
*                     description: Role ID
*                   role_name:
*                     type: string
*                     description: Role name
*       '500':
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Server Error Internal server error
*/

app.get('/role',async(req,res)=>{
  try{
    const ShowData = await RoleModels.findAll()
    res.status(200).json(ShowData);
  }catch(e){
      res.status(500).json('Server Error ' + e.message);
  }
})
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

app.post('/users/Addusers',Service.isLogin, async (req, res) => {
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user by email and password.
 *     tags:
 *      - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       '401':
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid password
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

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

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticate an admin by email and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Admin authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       '401':
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid password
 *       '404':
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

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
  


  /**
 * @swagger
 * /addrole:
 *   post:
 *     summary: Add Role
 *     description: Add a new role.
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
 *                 description: Name of the role to be added.
 *     responses:
 *       '200':
 *         description: Role added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: ID of the newly added role
 *                 role_name:
 *                   type: string
 *                   description: Name of the newly added role
 *       '400':
 *         description: Role already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the role already exists
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server Error Internal server error
 */

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


/**
 * @swagger
 * /update/userRole/:email:
 *   put:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Users]
*/
//แสดงข้อมููลหน้าinfo
app.put('/update/userRole/:email',async(req,res)=>{
  try{
     const updateData = await UsersModels.update(req.body,{
      where:{
        email:req.params.email
      }
    }) 
    res.status(200).json(updateData); 

  }catch(e){
    res.status(500).json('Server Error ' + e.message);
  }
});


app.post('/forgot-password', async (req, res) => { // เส้นทาง API สำหรับการขอรีเซ็ตรหัสผ่าน
  const { email } = req.body; // ดึง email จาก body ของคำขอ
  const user = await UsersModels.findOne({ where: { email } }); // ค้นหาผู้ใช้ในฐานข้อมูลตามอีเมล
  if (!user) { // ถ้าหาผู้ใช้ไม่พบ
    return res.status(404).send('ไม่พบ Email ผู้ใช้งานในระบบ'); // ส่งสถานะ 404 และข้อความ "User not found"
  }

  // สร้าง JWT โดยมี userId เป็น payload และกำหนดอายุการใช้งาน 5 นาที
  const secret = process.env.SECRET_KEY
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '5m' });
  // สร้างลิงก์รีเซ็ตรหัสผ่าน โดยแนบ token
  const resetLink = `http://localhost:3001/netzero-cmu-ghglandscape/reset-password?token=${token}`;

  // กำหนดการตั้งค่า nodemailer สำหรับการส่งอีเมล
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ใช้ Gmail เป็นเซิร์ฟเวอร์อีเมล
    auth: {
      user: 'your-email@gmail.com', // อีเมลที่ใช้ส่ง
      pass: 'your-email-password' // รหัสผ่านของอีเมลที่ใช้ส่ง
    }
  });

  // การตั้งค่าของอีเมลที่จะส่ง
  const mailOptions = {
    from: 'your-email@gmail.com', // จากอีเมล
    to: user.email, // ถึงอีเมลของผู้ใช้
    subject: 'Password Reset', // หัวข้ออีเมล
    text: `Click the link to reset your password: ${resetLink}` // เนื้อหาอีเมล
  };

  // ส่งอีเมล
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) { // ถ้ามีข้อผิดพลาดในการส่งอีเมล
      return res.status(500).send(error.toString()); // ส่งสถานะ 500 และข้อความข้อผิดพลาด
    }
    res.status(200).send('Password reset link sent'); // ส่งสถานะ 200 และข้อความ "Password reset link sent"
  });
});


app.post('/reset-password', async (req, res) => { // เส้นทาง API สำหรับการรีเซ็ตรหัสผ่าน
  const { token, newPassword } = req.body; // ดึง token และรหัสผ่านใหม่จาก body ของคำขอ

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // ตรวจสอบและถอดรหัส JWT
    const hashedPassword = await bcrypt.hash(newPassword, 10); // เข้ารหัสรหัสผ่านใหม่ด้วย bcrypt

    // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
    await UsersModels.update({ password: hashedPassword }, { where: { id: decoded.userId } });

    res.status(200).send('Password has been reset'); // ส่งสถานะ 200 และข้อความ "Password has been reset"
  } catch (error) {
    res.status(400).send('Invalid or expired token'); // ส่งสถานะ 400 และข้อความ "Invalid or expired token" ถ้ามีข้อผิดพลาด
  }
});

module.exports = app