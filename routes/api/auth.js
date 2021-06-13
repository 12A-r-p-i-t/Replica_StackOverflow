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
const { session } = require("passport");

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


//@type   POST
//@route  /api/auth/login
//@desc   route for login of users
//@access public

router.post("/login",function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    Person.findOne({email})
           .then(function(person){
               if(!person){
                   return res.status(404).json({emailError : "User not found with this email"})
               } 
               bcrypt.compare(password,person.password)
                    .then(function(isCorrect){
                        if(isCorrect){
                            // res.json({success : "User logged in successfully"})
                            //use payload and create token for user
                            const payload = {
                                id : person.id,
                                name : person.name,
                                email : person.email
                            };
                            jsonwt.sign(
                                payload,
                                key.secret,
                                {expiresIn : 3600},
                                function(err,token){
                                    res.json({
                                        success : true,
                                        token : "Bearer " + token
                                    })
                                }
                            )
                        }
                        else {
                            res.status(400).json({passwordError : "Password did not match"})
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    });
            })
           .catch(function(err){
               console.log(err);
           });
})



//@type   POST
//@route  /api/auth/profile
//@desc   route for user profile
//@access private


router.get(
    "/profile",
    passport.authenticate("jwt",{session : false}),
    (req,res) => {
    // console.log(req);
    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email,
        profilepic : req.user.profilepic
    })
    }
);

module.exports = router;


