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

//@type   POST
//@route  /api/profile/
//@desc   route for updating and saving personnal user profile
//@access private

router.post(
    "/",
    passport.authenticate("jwt",{session : false}),
    (req,res) => {
        const profileValues = {};
        profileValues.user = req.user.id;
        if(req.body.username) profileValues.username = req.body.username;
        if(req.body.website) profileValues.website = req.body.website;
        if(req.body.country) profileValues.country = req.body.country;
        if(req.body.portfolio) profileValues.portfolio = req.body.portfolio;
        if(typeof req.body.languages !== undefined){
            profileValues.languages = req.body.languages.split(",");
        }

        //get social links
        profileValues.social = {}
        if(req.body.youtube) profileValues.social.youtube = req.body.youtube;
        if(req.body.facebook) profileValues.social.facebook = req.body.facebook;
        if(req.body.instagram) profileValues.social.instagram = req.body.instagram;


        //Do Database stuff
        Profile.findOne({user : req.user.id})
                .then( profile => {
                    if(profile){
                        Profile.findOneAndUpdate(
                            {user : req.user.id},
                            {$set : profileValues},
                            {new : true}
                        ).then(profile => res.json(profile)).catch(err => {console.log("Problem in update " + err )})
                    } else {
                        Profile.findOne({username : profileValues.username})
                                .then(profile => {
                                    //username already exist
                                    if(profile){
                                        res.status(400).json({username : "Username already exist"})
                                    } 
                                    new Profile(profileValues)
                                    .save()
                                    .then(profile => res.json(profile))
                                    .catch(err => console.log("err in saving new profile" + err))
                                })
                                .catch(err => {console.log("Profile.findOne in else " + err)})
                    }
                })
                .catch(err =>{
                    console.log("Problem in fetching profile " + err);
                });
        

    }
)


module.exports = router;