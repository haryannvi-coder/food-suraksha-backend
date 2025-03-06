const express = require("express")
const router = express.Router();
const fsoUser = require("../models/fso.model.js");

// signup code 
router.post('/signup', async function (req, res){

    try{
        const newUser = await fsoUser.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        })


        res.json({
            message: "FSO User created successfully",
            fso : newUser
        })
        return;
    } 
    catch (err){        
        res.status(411).json({
            msg : "Error creating FSO User",
            error : err
        })
    }
})


// signin code
router.post("/signin", async (req, res) => {

    const user = await fsoUser.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (user) {
        res.json({
            msg : "log in successfull",
        })
    }
    else{
        res.status(411).json({
            message: "wrong credentials",
        })
    }
})


module.exports = router