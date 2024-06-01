const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv=require('dotenv').config();
const path = require('path');
//const empController = require('./controller/employee.js');


const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname,'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'build', 'index.html'));
});
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const empRoute = require('./routes/employee.route.js');
app.use('/api/v1',empRoute);





app.listen(port,()=>{
    console.log(`server is running on port: ${port}`);
});