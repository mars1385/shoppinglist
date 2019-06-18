//imports
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//building router
const app = express();

//body-parser
app.use(express.json());

// database config
const db = process.env.MONGO_URI;

//..............database connect..................
mongoose.connect(db , {
    useNewUrlParser : true,
    useCreateIndex : true
    })
    .then( () => console.log(' database is connected'))
    .catch(error => console.log(`error when connecting. error : ${error}`));

// ............using router.....................
//getting or adding or deleting item
app.use('/api/items' , require('./routes/api/items'));
//getting user 
app.use('/api/users' , require('./routes/api/users'));
//authorized user
app.use('/api/auth' , require('./routes/api/auth'));

// ............running server................
const port = process.env.Port || 5000 ;
app.listen(port , () => {
    console.log(`server is start on port : ${port}`);
});



