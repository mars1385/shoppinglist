const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//-----------models---------------------
const User = require('../../models/User');

//--------------routers--------------

//@route Post api/users
//@desc Register user
//@access Public
router.post('/' , (req , res) => { 
  const  {name , email , password} = req.body;
  //checking req.body field
  if(!name || !email || !password) {
    return res.status(400).json({massage : 'Please fill all the filed '});
  }

  //locking to see if user with this email exist
  //if user not exist creat new user
  User.findOne({email})
  .then(user => {
    //user exist or not ? 
    if(user) {return res.status(400).json({massage : 'this email already exist'})}
    //we can creat user then hashing password 
    //like :
    // const newUser = new User({name , email , password });
    //or
    //hashing password and create new user 
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, (err, hash) =>{
        if(err)  throw err;
        //hashing user password if we create user before
        // like :
        // newUser.password = hash;
        //or
        //creating new user with hash password
        const newUser = new User({name , email , password :hash});
        //
        newUser.save().then(user => {
          //creating jwt token and sending token and user to client 
          jwt.sign(
            {id : user.id},
            process.env.JWT_SECRET,
            {expiresIn : 7200},
            (err , token) => {
              if (err) throw err; 
              res.json({
                jwtToken : token,
                user : {
                  id : user.id,
                  name : user.name,
                  email : user.email
                } 
              })
            }
          );
        })
      });
    });
  })

});


//-------export---------------
module.exports = router;

