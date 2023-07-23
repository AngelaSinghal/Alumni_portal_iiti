const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model
const User = require('../models/User');
const { route } = require('.');

//login page
router.get('/login', (req, res) => res.render('login'));

// register  page
router.get('/register', (req, res) => res.render('register'));

//register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    let errors = [];

    // check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all the fields' });
    }

    //check passwords match
    if (password !== password2) {
        errors.push({ msg: 'passwords do not match' });
    }

    //check password lenght
    if (password.length < 6) {
        errors.push({ msg: 'password should be atleast 6 character long' });
    }


    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user exist
                    errors.push({ msg: 'email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // set password to hashed
                            newUser.password = hash;
                            //save useer
                            newUser.save()
                                .then(user => {
                                    req.flash('succes_msg', 'you are now registered')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));

                        }));
                }
            });
    }

});



// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((error)=>{
        if(error){
            return next(error)
        }
        res.redirect('/users/login');
    });
    req.flash('success_msg', 'You are logged out');
});
module.exports = router;