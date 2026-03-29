const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// connect db
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("mongodb connected successfully");
})
.catch((err) => {
    console.log(err);
});

// middleware
app.use(express.json());

// routes
app.use('/user', require('./Routes/user'));

// ✅ ERROR HANDLING MIDDLEWARE (VERY IMPORTANT)
app.use((err, req, res, next) => {
    console.error("ERROR:", err.message);
    res.status(500).json({
        error: err.message
    });
});

// server
app.listen(4000, () => {
    console.log("my server is running");
});