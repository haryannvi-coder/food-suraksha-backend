const express = require("express")
const router = express.Router()
const hotelModel = require("../models/hotel.model.js")


// add new hotel to database
router.post("/add", async (req, res) => {
    try{
        const newHotel = await hotelModel.create({
            name: req.body.name,
            district: req.body.district,
            managerEmail: req.body.managerEmail
        })

        res.json({
            message: "Hotel added successfully",
            hotel : newHotel
        })
        return;
    } 
    catch (err){        
        res.status(411).json({
            msg : "Error adding hotel",
            error : err
        })
    }
})

module.exports = router