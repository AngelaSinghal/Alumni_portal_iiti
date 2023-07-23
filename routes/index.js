const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const path = require('path');


//welcome page
router.get('/',(req,res)=> express.static(path.resolve(__dirname + '../static/index.html')));
router.get('/stories',(req,res)=> {
    res.sendFile(path.resolve(__dirname+'/../public/stories.html'));
});
router.get('/contact',(req,res)=> {
    res.sendFile(path.resolve(__dirname+'/../public/contact.html'));
});

//dashboard page
router.get('/dashboard', ensureAuthenticated , ( req ,res)=> 
res.render('dashboard',{
    name:req.user.name
}));


module.exports = router;