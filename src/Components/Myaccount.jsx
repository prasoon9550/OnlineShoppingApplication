    import React, { useState, useEffect } from "react";
    import "./Myaccount.css";
    import { Link } from "react-router-dom";

    export default function MyAccount() {
    const [selected, setSelected] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);

    const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: ""
    });

    const [editData, setEditData] = useState(userData);
    const username = localStorage.getItem("userName");

    useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/getUserDetailsByUserName/${username}`)
    .then((res) => res.json())
    .then((result) => {
    const data = result.data;
    const newUser = {
    firstName: data.firstName || "",
    middleName: data.middleName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phoneNo: data.phoneNo || "",
    address: data.address || ""
    };

    setUserData(newUser);
    setEditData(newUser);
    })
    .catch((err) => console.log("API Error:", err));
    }, [username]);

    const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);

    // API CALL for saving details (optional)
    // fetch("http://your-api/updateUser", { method: "PUT", body: JSON.stringify(editData) })
    };

    const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
    };

    return (
    <div className="account-container">
    <div className="sidebar">
    <h3 className="hello-user">Hello, {userData.firstName || "User"}</h3>

    <div className="sidebar-section">
    <Link to="/allorders" className="no-decoration">
    <h4>MY ORDERS</h4>
    </Link>
    </div>

    <div className="sidebar-section">
    <h4>ACCOUNT SETTINGS</h4>
    <p className={selected === "profile" ? "a" : ""} onClick={() => setSelected("profile")}>
    Profile Information
    </p>
    <p className={selected === "address" ? "a" : ""} onClick={() => setSelected("address")}>
    Manage Addresses
    </p>
    </div>

    <div className="sidebar-section">
    <h4>PAYMENTS</h4>
    <p>Gift Cards</p>
    <p>Saved UPI</p>
    <p>Saved Cards</p>
    </div>
    </div>

    {/* RIGHT CONTENT */}
    <div className="content-area">
    {selected === "profile" && (
    <div className="profile-box">

    <div className="profile-header">
        <h2>Personal Information</h2>

        {!isEditing && (
        <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        )}
    </div>

    <div className="row">
        <div>
        <label>First Name</label>
        <input
            name="firstName"
            className="fname"
            type="text"
            value={isEditing ? editData.firstName : userData.firstName}
            onChange={handleChange}
            readOnly={!isEditing}
        />
        </div>

        <div>
        <label>Last Name</label>
        <input
            name="lastName"
            className="lname"
            type="text"
            value={isEditing ? editData.lastName : userData.lastName}
            onChange={handleChange}
            readOnly={!isEditing}
        />
        </div>
    </div>

    <div>
        <label>Email Address</label>
        <input
        name="email"
        className="email"
        type="text"
        value={isEditing ? editData.email : userData.email}
        onChange={handleChange}
        readOnly={!isEditing}
        />
    </div>

    <div style={{ marginTop: "18px" }}>
        <label>Mobile Number</label>
        <input
        name="phoneNo"
        className="mnum"
        type="text"
        value={isEditing ? editData.phoneNo : userData.phoneNo}
        onChange={handleChange}
        readOnly={!isEditing}
        />
    </div>

    {/* SAVE + CANCEL BUTTONS */}
    {isEditing && (
        <div className="btn-row">
        <button className="save-btn" onClick={handleSave}>Update</button>
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
    )}
    </div>
    )}

    {selected === "address" && (
    <div className="address-container">

    <h2 style={{marginBottom:"30px"}}>Manage Addresses</h2>

    {/* ADD NEW ADDRESS BUTTON */}
    <div className="add-address-box">
    <span className="plus-icon">+</span> ADD A NEW ADDRESS
    </div>

    {/* ADDRESS CARD */}
    <div className="address-card">
    <div className="address-type">HOME</div>

    <div className="address-name-mobile">
    <strong>{userData.firstName} {userData.lastName}</strong>
    <span className="mobile">{userData.phoneNo}</span>
    </div>

    <div className="full-address">
    {userData.address}
    </div>

    <div className="dots-menu">⋮</div>
    </div>

    </div>
    )}
    </div>
    </div>
    );
    }
