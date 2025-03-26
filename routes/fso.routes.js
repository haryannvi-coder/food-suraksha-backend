const express = require("express")
const router = express.Router()
const fsoUser = require("../models/fso.model.js")
const { ScanCommand } = require('@aws-sdk/client-dynamodb')
const client = require('../connectAWS.js')
const nodemailer = require('nodemailer')

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


// hotels data
router.get("/hotelData", async (req, res) => {
    try {
        const command = new ScanCommand({ TableName: 'TestResults' })
        const { Items } = await client.send(command)
        console.log("Items = ", Items);
        
        
        const hotels = Items.map((item) => ({
            id_number: item.id_number.S,
            hotel_name: item.hotel_name.S,
            ml_model_output: parseInt(item.ml_model_output.N),
            sanitation: item.sanitation.S,
            timestamp: item.timestamp.S,
            image: item.image_data.S,
            district: item.district.S
        }));
        // console.log('api call made to this endpoint = ', hotels)
        res.json(hotels)
    } 
    catch (error) {
        console.error('Error fetching items:', error)
        res.status(500).send('Internal Server Error')
    }
}) 

module.exports = router
