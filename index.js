const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const questions = require("./routes/api/questions");
const app = express();

// Middleware for bodyParser

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// mongoDB configuration
const db = require("./setup/myurl").mongoURL;
const passport = require("passport");

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

//Passport middlewares
app.use(passport.initialize());

//config for JWT strategy

require("./strategies/jsonwtStrategy")(passport);

// routes


//just For testing
app.get("/",function(req,res){
    res.send("oii");
})

// actual Routes

app.use("/api/auth",auth);

app.use("/api/profile",profile);

app.use("/api/questions",questions);








const port = process.env.PORT || 3000 ;

app.listen(3000,function(){
    console.log("Server is running at port : 3000");
})