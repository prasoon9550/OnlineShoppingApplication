const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    photo:{
        data: Buffer,
        contentType:String
        },
    title:{
        type : String,
        required : true
    },
    price:{
        type : Number,
        required : true
    },
    rating:{
        type : Number,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    },
    // fastDelivery:{
    //     type : String,
    //     required : true
    // },
    // freeDelivery:{
    //     type : String,
    //     required : true
    // },
})
module.exports = mongoose.model("productSchema",productSchema)
