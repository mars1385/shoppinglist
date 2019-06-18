const jwt = require('jsonwebtoken');


//
const auth = (req , res , next) =>{
  const userToken = req.header('user-auth-token');

  //check for user token
  if(!userToken) {return res.status(401).json({massage : 'unauthorized'})}
  // verified user
  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

    //sending decoded token
    req.user = decoded;
    //going next point
    next();

  } catch(err) {
    res.status(400).json({massage : 'Invalid token'});
  }
}

module.exports = auth;