const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    pickupDate: {
        type: String,
        required: true
    },
    pickupLocation:{
        type: String,
        required: true
    },
    returnDate:{
        type:String,
        required: true
    },
    returnLocation:{
        type:String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId  ,
        ref:'User',
        required: true
    },
    car: {
        type: mongoose.Schema.ObjectId ,
        ref:'Car',
        required: true
    },
    numberOfDays:{
        type:Number,
    },
    assumePrice:{
        type:Number,
    },
    carId:{
        type:String,
    },
    carModel:{
        type:String,
    }
});

module.exports = mongoose.model('Booking', BookingSchema);

// _id?: string
//   carId: string
//   carModel: string
//   : number
//   : number
//   : string
//   : string
//  : string
//   : string
//   user?: string
//   car?: CarItem