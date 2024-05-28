/* const express = require('express');
const app = express();
const passport = require('passport');
require('dotenv').config();

const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.use('cmu-oauth', new OAuth2Strategy({
    authorizationURL: process.env.AUTHORIZATIONURL,
    tokenURL: process.env.TOKENURL,
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL
  },
  function(accessToken, refreshToken, profile, cb) {
    // สามารถทำการตรวจสอบ profile หรือบันทึกข้อมูลผู้ใช้งานได้ที่นี่
    return cb(null, profile);
  }
));


app.get('/auth/cmu', passport.authenticate('cmu-oauth'));

app.get('/auth/cmu/callback', 
  passport.authenticate('cmu-oauth', { failureRedirect: '/login' }),
  function(req, res) {
    // หลังจากตรวจสอบสิทธิ์เสร็จสิ้น ทำการเรียกใช้งานเส้นทางที่คุณต้องการให้ผู้ใช้ไปยังนั้น
    res.redirect('/');
  }
);

module.exports = app; */