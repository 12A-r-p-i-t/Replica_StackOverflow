const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load person model 
const Person = require("../../models/Person");

//load profile model
const Profile = require("../../models/Profile");

//@type   GET
//@route  /api/profile/
//@desc   route for personal user profile
//@access private

router.get("/",passport.authenticate("jwt",{session : false}), function(req,res){

    Profile.findOne({user : req.user.id})
            .then( profile => {
                if(!profile){
                    return res.status(404).json({profileNotfound : "profile not found"})
                }
                res.json(profile);
            })
            .catch(function(err){
                console.log("Error in Profile " + err);
            });
})


module.exports = router;