const express = require('express');
const router = express.Router();
const User = require('../models/Member');
const bcrypt = require('bcryptjs');

/* @desc GET / page. */
router.get('/', (req, res) => {
  if (req.session.user != null) {
    res.redirect('/');
  } else {
    res.render('login.ejs', { title: 'Who goes there!?', error: '' });
  }
});

//post route for logging in
router.post('/', (req, res) => {
  //check if user is already logged in
  if (req.session.user != null) {
    res.redirect('/');
  }
  //check to see if both username and password is entered 
  else if (req.body.user && req.body.pass) {
    //search for a corresponding username
    User.findOne({ userName: req.body.user }).exec(function (err, user) {
      //if username found
      if (user) {
        //compare password hash to entered text
        bcrypt.compare(req.body.pass, user.user, function (err, res) {
          //if good password match
          if (res) {
            //init session and redirect back to home page
            req.session.user = user._id;
            res.redirect('/');
          } else if (err) {
            console.log(err);
          } else {
            res.render('login.ejs', { title: 'Who goes there!?', error: 'Wrong username or password!' });
          }
        });
      } else if (err) {
        console.log(err);
      } else {
        console.log("something terribly wrong happened!!");
      }
    });
    //if some fields were empty
  } else {
    res.render('login.ejs', { title: 'Who goes there!?', error: 'Incomplete form!' });
  }
});

module.exports = router;
