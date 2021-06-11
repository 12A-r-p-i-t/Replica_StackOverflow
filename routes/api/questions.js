const express = require("express");
const router = express.Router();


router.get("/",function(req,res){
    res.json({questions : "question is success"});
})


module.exports = router;