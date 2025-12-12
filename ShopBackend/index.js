// cd /d D:\shoppingapplication
const express = require("express");
require('dotenv').config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const productRoutes = require("./Views/ProductApi");

app.use(cors({
    origin: "http://localhost:5173",  
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
app.use(productRoutes);
app.use(cors());
app.use("/api/products", productRoutes);

console.log(process.env.mongoPassword)
mongoose.connect(`mongodb+srv://vjprasoon1357:${process.env.mongoPassword}@cluster0.bzb3adf.mongodb.net/`)
.then(()=>{
    console.log("Database connected")
})
app.listen(PORT, ()=>{
    console.log(`Server Started running on port ${PORT}`)
})