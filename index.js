const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// mongoDB configuration
const db = require("./setup/myurl").mongoURL;

//connecting to database
// If not connecting try deleting the id address added on mongoDB server and adding it again
//https://stackoverflow.com/questions/50173080/mongonetworkerror-failed-to-connect-to-server-localhost27017-on-first-connec
mongoose
    .connect(db,{
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true 
    })
    .then(function(){
        console.log("MongoDB conected Successfully")
    })
    .catch(err => console.log(err));



// routes
app.get("/",function(req,res){
    res.send("oii");
})









const port = process.env.PORT || 3000 ;

app.listen(3000,function(){
    console.log("Server is running at port : 3000");
})