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
/*
//router.get("/hotelData", async (req, res) => {
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
*/



let lastEmailedHotel = null;
let lastEmailTimestamp = 0;
const EMAIL_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown

router.get("/hotelData", async (req, res) => {
    try {
        const command = new ScanCommand({ TableName: 'TestResults' });
        const { Items } = await client.send(command);
        
        const hotels = Items.map((item) => ({
            id_number: item.id_number.S,
            hotel_name: item.hotel_name.S,
            ml_model_output: parseInt(item.ml_model_output.N),
            sanitation: item.sanitation.S,
            timestamp: item.timestamp.S,
            image: item.image_data.S,
        }));

        // Group hotels by name and count issues
        const hotelIssues = hotels.reduce((acc, hotel) => {
            acc[hotel.hotel_name] = acc[hotel.hotel_name] || { count: 0, data: [] };
            acc[hotel.hotel_name].count++;
            acc[hotel.hotel_name].data.push(hotel);
            return acc;
        }, {});

        // Find the hotel with max issues
        let maxIssueHotel = null;
        let maxCount = 0;
        Object.entries(hotelIssues).forEach(([hotelName, details]) => {
            if (details.count > maxCount) {
                maxCount = details.count;
                maxIssueHotel = { name: hotelName, details: details.data };
            }
        });

        // Send email only if it's a new hotel or cooldown time has passed
        const now = Date.now();
        if (maxIssueHotel && (maxIssueHotel.name !== lastEmailedHotel || now - lastEmailTimestamp > EMAIL_COOLDOWN_MS)) {
            sendEmail(maxIssueHotel);
            lastEmailedHotel = maxIssueHotel.name;
            lastEmailTimestamp = now;
        }

        res.json(hotels);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to send email
async function sendEmail(hotel) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: process.env.RECEIVER_EMAIL,
        subject: `Alert: Issues Detected at ${hotel.name}`,
        text: `Issues detected at ${hotel.name}. Details:\n\n` +
            hotel.details.map(h => `Time: ${h.timestamp}, Sanitation: ${h.sanitation}, Image: ${h.image}`).join("\n\n"),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${process.env.RECEIVER_EMAIL} for ${hotel.name}`);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
}

    
module.exports = router
