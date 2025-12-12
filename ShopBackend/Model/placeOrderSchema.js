// models/placeOrderSchema.js
const mongoose = require("mongoose");

const placeOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },

    userName: {
      type: String,
      required: true
    },

    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },

        // IMPORTANT: ONLY URL, NOT BASE64 OR BUFFER
        image: { 
          type: String, 
          required: true 
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    address: {
      fullName: String,
      phoneNo: String,
      houseNo: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Orders", placeOrderSchema);
