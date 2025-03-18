const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    name : {
        type: 'string',
        required: true
    },
    district : {
        type : 'string',
        required : true
    },
    id : {
        type : Number,
        unique : true
    },
    managerEmail : {
        type : 'string',
        required : true,
    }
})

// Auto-increment logic before saving
hotelSchema.pre("save", async function (next) {
    if (this.isNew) {
        const lastHotel = await this.constructor.findOne().sort({ id: -1 });
        this.id = lastHotel ? lastHotel.id + 1 : 1;
    }
    next();
});


const hotelModel = mongoose.model("Hotel", hotelSchema);


module.exports = hotelModel;