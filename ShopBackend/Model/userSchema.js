const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,   
    required: false 
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNo: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true     
  },
  password: {
    type: String,
    required: true
  },

  loginStatus: {
    type: String,
    required: true,
    default:0
  }
});

module.exports = mongoose.model("userDetail", userSchema);
