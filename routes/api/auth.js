const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//............auth............
const auth = require('../../middleware/auth');
//-----------models---------------------
const User = require('../../models/User');

//--------------routers--------------

//@route Post api/auth
//@desc Auth user
//@access Public
router.post('/' , (req , res) => { 
  const  {email , password} = req.body;
  //checking req.body field
  if(!email || !password) {
    return res.status(400).json({massage : 'Please fill all the filed '});
  }
  //locking to see if user with this email exist
  User.findOne({email})
  .then(user => {
    //user exist or not ? 
    if(!user) {return res.status(400).json({massage : 'user dose not exist'})}

    //comparing hash password
    bcrypt.compare(password, user.password).then((isValid) => {
      if(!isValid) {
        return res.status(400).json({massage : 'email or password is wrong'})
      }
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

    });
    
  });
  
});

//@route Post api/auth/user
//@desc getting user details
//@access Private
router.get('/user' , auth , (req , res) => { 
  User.findById(req.user.id)
  .select('-password').then(user => res.json(user));
});

//-------export---------------
module.exports = router;

