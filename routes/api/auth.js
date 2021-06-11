const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");
//@type   GET
//@route  /api/auth
//@desc   just for testing
//@access public

router.get("/",function(req,res){
    res.json({test : "Auth is being tested"});
})

//Import Schema for Person to register

const Person = require("../../models/Person");

//@type   POST
//@route  /api/auth/register
//@desc   route for registration of users
//@access public

router.post("/register",function(req,res){
    Person.findOne({email : req.body.email})
           .then(function(person){
               if(person){
                    return res.status(400).json({emailError : "Email already registered"})
               }else{
                const newPerson = new Person({
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password
                })
                
                 //Encrypt password using bcryptjs
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newPerson.password, salt, function(err, hash) {
                        if(err){
                            throw err;
                        }
                        newPerson.password = hash;
                        newPerson.save()
                                .then(function(person){
                                    res.json(person)
                                })
                                .catch(function(err){
                                    console.log(err);
                                });
                    });
                });
            }
           

           })
           .catch(function(err){
               console.log(err);
           })
})

module.exports = router;