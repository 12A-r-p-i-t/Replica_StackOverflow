const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
//load person model 
const Person = require("../../models/Person");

//load profile model
const Profile = require("../../models/Profile");

//load Question model

const Question = require("../../models/Question");

//@type   GET
//@route  /api/questions
//@desc   route for showing all questions
//@access PUBLIC
router.get("/",function(req,res){
    Question.find()
            .sort({date : "desc"})
            .then( questions => res.json(questions) )
            .catch(err => console.log("No questions to display " + err))
})

//@type   POST
//@route  /api/questions
//@desc   route for submitting questions
//@access PRIVATE

router.post("/",passport.authenticate("jwt",{session : false}),(req,res) =>
{

    const newQuestion = new Question({
        textone : req.body.textone,
        texttwo : req.body.texttwo,
        user : req.user.id,
        name : req.body.name
    });
    newQuestion.save()
                .then(question => res.json(question) )
                .catch(err => console.log("Unable to push question to database " + err));
})

module.exports = router;