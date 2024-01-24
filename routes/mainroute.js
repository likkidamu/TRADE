const express = require('express');
const maincontroller = require('../controllers/maincontroller');
const mainrouter = express.Router();

//Get /index
mainrouter.get('/', maincontroller.index);
//mainrouter.get('/',(req,res)=>{res.send('Get index.ejs');});

//Get /index
mainrouter.get('/index', maincontroller.index);
//mainrouter.get('/index.ejs',(req,res)=>{res.send('Get index.ejs');});

//Get /about.ejs
mainrouter.get('/about',maincontroller.about);
//mainrouter.get('/about.ejs',(req,res)=>{res.send('Get about.ejs');});

//Get /contact.ejs 
mainrouter.get('/contact',maincontroller.contact);
//mainrouter.get('/contact.ejs',(req,res)=>{res.send('Get contact.ejs');});

module.exports = mainrouter;