// cd /d D:\shoppingapplication
const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
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


mongoose.connect("mongodb://127.0.0.1:27017")
.then(()=>{
    console.log("Database connected")
})
app.listen(port, ()=>{
    console.log(`Server Started running on port ${port}`)
})