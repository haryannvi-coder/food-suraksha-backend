const mongoose = require("mongoose")

async function connectDB(){
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/foodsuraksha24X7`)
        console.log("MONGODB connnected");
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
    }
}

module.exports = connectDB