    const express = require("express");
    const router = express.Router();
    const formidable = require("formidable");
    const IncomingForm = require("formidable");
    const productSchema = require("../Model/productschema");
    const userSchema = require("../Model/userSchema");
    const placeOrderSchema = require("../Model/placeOrderSchema");
    const fs = require("fs");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const JWT_SECRET = "MY_SUPER_SECRET_KEY";
    const crypto = require("crypto");

    // UPLOAD PRODUCTS API
    router.post("/uploadProduct", (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, file) => {
    if (err) {
    return res.status(400).json({ error: err });
    }

    let productObj = {
    title: fields.title[0],
    description: fields.description[0],
    rating: Number(fields.rating[0]),
    price: Number(fields.price[0]),
    category: fields.category[0]
    };

    let product = new productSchema(productObj);

    if (file.photo && file.photo[0]) {
    if (file.photo[0].size > 3000000) {
    return res.status(400).json({ error: "File size too big!" });
    }

    product.photo = {
    data: fs.readFileSync(file.photo[0].filepath),
    contentType: file.photo[0].mimetype
    };
    }

    let result = await product.save();
    return res.json(result);
    });
    });

    // GET PRODUCTS BASED ON CATEGORY
    router.get("/products/:category", async (req, res) => {
    try {
    const { category } = req.params;

    const mobiles = await productSchema.find({ category });

    if (!mobiles || mobiles.length === 0) {
    return res.status(404).json({
    success: false,
    message: "No products found in this category"
    });
    }

    res.json({
    success: true,
    count: mobiles.length,
    data: mobiles
    });

    } catch (error) {
    res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: error.message
    });
    }
    });

    // USER REGISTER API
    router.post("/userRegister", async (req, res) => {
    try {
    let { firstName, middleName, lastName, phoneNo, email, address, userName, password } = req.body;

    if (!firstName || firstName.trim() === "") {
    return res.json({ success: false, message: "First Name is required" });
    }

    if (!lastName || lastName.trim() === "") {
    return res.json({ success: false, message: "Last Name is required" });
    }

    if (!phoneNo || phoneNo.trim() === "") {
    return res.json({ success: false, message: "Phone Number is required" });
    }

    if (phoneNo.length !== 10) {
    return res.json({ success: false, message: "Phone Number must be 10 digits" });
    }

    if (!email || email.trim() === "") {
    return res.json({ success: false, message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    return res.json({ success: false, message: "Invalid Email Format" });
    }

    if (!address || address.trim() === "") {
    return res.json({ success: false, message: "Address is required" });
    }

    if (!userName || userName.trim() === "") {
    return res.json({ success: false, message: "Username is required" });
    }

    if (!password || password.trim() === "") {
    return res.json({ success: false, message: "Password is required" });
    }

    if (password.length < 6) {
    return res.json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await userSchema.findOne({ userName });
    if (existingUser) {
    return res.json({
    success: false,
    message: "Username already exists"
    });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userSchema({
    firstName,
    middleName,
    lastName,
    phoneNo,
    email,
    address,
    userName,
    password: hashedPassword
    });

    const savedUser = await newUser.save();

    return res.json({
    success: true,
    message: "User created successfully",
    data: savedUser
    });

    } catch (err) {
    return res.json({
    success: false,
    error: err.message
    });
    }
    });


    router.post("/login", async (req, res) => {
    try {
    const { userName, password } = req.body;
    const user = await userSchema.findOne({ userName });
    if (!user) {
    return res.json({
    success: false,
    message: "No user found"
    });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
    return res.json({
    success: false,
    message: "Invalid username or password"
    });
    }
    user.loginStatus = "1";
    await user.save();
    const token = jwt.sign(
    {
    id: user._id,
    userName: user.userName
    },
    JWT_SECRET,
    {
    expiresIn: "2h"
    }
    );

    return res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
    id: user._id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    fullName: user.firstName + " " + user.middleName + " " + user.lastName,
    phoneNo:user.phoneNo,
    address:user.address,
    loginStatus:user.loginStatus
    }
    });

    } catch (err) {
    return res.json({
    success: false,
    error: err.message
    });
    }
    });

    router.post("/logout", async (req, res) => {
    const { userName } = req.body;

    const user = await userSchema.findOne({ userName });
    user.loginStatus = "0";
    await user.save();

    return res.json({
    success: true,
    message: "Logout successful"
    });
    });



    // GET PRODUCT BY ID
    router.get("/product/:id", async (req, res) => {
    try {
    const { id } = req.params;

    const product = await productSchema.findById(id);

    if (!product) {
    return res.status(404).json({
    success: false,
    message: "Product not found",
    });
    }

    res.json({
    success: true,
    data: product
    });

    } catch (error) {
    res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: error.message
    });
    }
    });

    router.get("/getUserDetailsByUserName/:userName", async (req, res) => {
    try {
    const { userName } = req.params;
    const user = await userSchema.findOne({ userName }).select("-password");

    if (!user) {
    return res.json({
    success: false,
    message: "User not found"
    });
    }

    return res.json({
    success: true,
    message: "User details fetched successfully",
    data: user
    });

    } catch (err) {
    return res.json({
    success: false,
    error: err.message
    });
    }
    });

    function generateOrderId() {
    return "ORD" + Math.floor(100000 + Math.random() * 900000);
    }


    function normalizeItems(items) {
    if (!Array.isArray(items)) return { error: "items must be an array" };

    const normalized = [];

    for (let i = 0; i < items.length; i++) {
    const it = items[i];

    const productId = it.productId || it._id || it.id || null;
    const name = it.name || it.title || it.productName || null;
    const price = (it.price !== undefined && it.price !== null) ? Number(it.price) : NaN;
    const quantity = (it.quantity !== undefined && it.quantity !== null) ? Number(it.quantity) : NaN;

    let image = it.image || null;
    if (!image && it.photo) {
    image = it.photo.url || it.photoUrl || null;

    if (!image && it.photo.contentType && it.photo.data) {
    try {
    const inner = typeof it.photo.data === "string" ? it.photo.data : (it.photo.data.data || null);
    if (inner) {
    if (inner.startsWith("data:")) image = inner;
    else image = `data:${it.photo.contentType};base64,${inner}`;
    }
    } catch (e) {
    image = null;
    }
    }
    }
    if (!productId || !name || Number.isNaN(price) || Number.isNaN(quantity) || !image) {
    return {
    error: `Invalid cart item at index ${i}. Required: productId, name, price, quantity, image`,
    index: i,
    };
    }

    normalized.push({
    productId: String(productId),
    name: String(name),
    price: Number(price),
    quantity: Number(quantity),
    image: String(image),
    });
    }

    return { items: normalized };
    }

    router.post("/placeOrder", async (req, res) => {
    try {
    const body = req.body || {};
    const userName = body.userName || body.user || null;
    const addressPayload = body.address || body.shippingAddress || null;
    const itemsPayload = body.items || body.cart || null;
    const totalAmountPayload = (body.totalAmount !== undefined && body.totalAmount !== null)
    ? Number(body.totalAmount)
    : (body.orderTotal !== undefined && body.orderTotal !== null)
    ? Number(body.orderTotal)
    : null;

    if (!userName) return res.json({ success: false, message: "Missing required field: userName" });
    if (!addressPayload) return res.json({ success: false, message: "Missing required field: address/shippingAddress" });
    if (!itemsPayload) return res.json({ success: false, message: "Missing required field: items (cart)" });

    let address = {};
    if (typeof addressPayload === "string") {
    address = {
    fullName: body.fullName || userName,
    phoneNo: body.phoneNo || body.mobile || "",
    houseNo: "",
    street: addressPayload,
    city: "",
    state: "",
    pincode: ""
    };
    } else {
    address = {
    fullName: addressPayload.fullName || body.fullName || userName,
    phoneNo: addressPayload.phoneNo || body.phoneNo || body.mobile || "",
    houseNo: addressPayload.houseNo || "",
    street: addressPayload.street || addressPayload.line1 || addressPayload.address || "",
    city: addressPayload.city || "",
    state: addressPayload.state || "",
    pincode: addressPayload.pincode || addressPayload.zip || ""
    };
    }
    const normalized = normalizeItems(itemsPayload);
    if (normalized.error) {
    return res.json({ success: false, message: normalized.error });
    }
    const items = normalized.items;
    let totalAmount = totalAmountPayload;
    if (totalAmount === null) {
    totalAmount = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);
    }

    if (!Number.isFinite(totalAmount)) {
    return res.json({ success: false, message: "Invalid totalAmount" });
    }
    const orderId = generateOrderId();
    const newOrder = new placeOrderSchema({
    orderId,
    userName,
    items,
    totalAmount,
    address,
    paymentStatus: "Pending"
    });

    await newOrder.save();

    return res.json({ success: true, message: "Order Placed Successfully", orderId });
    } catch (err) {
    console.error("Order error:", err);
    return res.json({ success: false, message: "Server error", error: err.message || err.toString() });
    }
    });

    router.get("/getOrderDetailsByUserName/:userName", async (req, res) => {
    try {
    const { userName } = req.params;
    const orders = await placeOrderSchema

    .find({ userName })
    .sort({ createdAt: -1 }); 

    if (!orders || orders.length === 0) {
    return res.json({
    success: false,
    message: "No orders found for this user",
    });
    }

    return res.json({
    success: true,
    message: "Order details fetched successfully",
    data: orders,
    });
    } catch (err) {
    return res.json({
    success: false,
    error: err.message,
    });
    }
    });




    module.exports = router;
