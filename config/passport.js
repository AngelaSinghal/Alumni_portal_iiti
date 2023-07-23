const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user model
const User = require('../models/User');


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //match user
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'that email is not registered' });
                    }

                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' })
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );
    // passport.serializeUser((user, done) => {
    //     done(null, user.id);
    // });


    // User.findById(id,  (err, user)=> {
    //     done(err, user);
    // });
    // User.findById(id)
    //     .then(result => {
    //         // Handle the result of the query
    //         console.log(result);
    //     })
    //     .catch(error => {
    //         // Handle any errors that occurred during the query
    //         console.error(error);
    //     });
    // passport.deserializeUser(async (id, done) => {
    //     await User.findById(id)
    //         .then((data) => {
    //             res.send({ status: 200, message: data });
    //         })
    //         .catch((err) => {
    //             res.send({ status: 400, message: err });
    //         });
    // });
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
    //   passport.deserializeUser((id, done) => {
    //     User.findById(id, (err, user) => {
    //       done(err, user);
    //     });
    //   });
      passport.deserializeUser(async (id, done) => {
        let userd;
        let error;
        await User.findById(id)
          .then((data) => {
            userd = data;
          })
          .catch((err) => {
            error = err;
            console.log(err);
          });
        done(error, userd);
      });
      

};

