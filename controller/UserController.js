const express = require('express');
const app = express();

const {RoleModels,UsersModels} = require('../models/userModel');
const {PlaceCmuModels} = require('../models/placeAtCmuModels');

//แสดงข้อมูลuser และ บทบาท หน่วยงานที่สังกัด
app.get('/users/showUserApi',async(req,res)=>{
    try{
        const showData = await UsersModels.findAll({
            include: [
                {
                    model: RoleModels,
                    attributes: [],   
                },
                {
                    model: PlaceCmuModels,
                    attributes: [],  
                },
        ],
        });
        res.status(200).json(showData);
    }catch(e){
        res.status(500).json('Server Error '+ e.message);
    }
});
//เพิ่มข้อมูล
app.post('/users/Addrole',async(req,res)=>{
    try{
        const AddData = await RoleModels.create(req.body);
        res.status(200).json(AddData);
    }catch(e){
        res.status(500).json('Server Error '+ e.message);
    }
})

app.post('/users/Addusers',async(req,res)=>{
    try{
        const AddData = await UsersModels.create(req.body);
        res.status(200).json(AddData);
    }catch(e){
        res.status(500).json('Server Error '+ e.message);
    }
})




// ลงทะเบียนผู้ใช้
/* app.post('/register', async (req, res) => {
    try {
        const { fname, sname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UsersModels.create({
            fname,
            sname,
            email,
            password: hashedPassword,
            // ใส่ค่าอื่น ๆ ตามที่ต้องการ
        });

        res.status(200).json(newUser);
    } catch (e) {
        res.status(500).json('Server Error ' + e.message);
    }
}); */

// เข้าระบบ
/* app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UsersModels.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json('ไม่พบผู้ใช้');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // ทำสิ่งที่คุณต้องการเมื่อเข้าระบบสำเร็จ
            res.status(200).json('เข้าระบบสำเร็จ');
        } else {
            res.status(401).json('รหัสผ่านไม่ถูกต้อง');
        }
    } catch (e) {
        res.status(500).json('Server Error ' + e.message);
    }
}); */

module.exports = app