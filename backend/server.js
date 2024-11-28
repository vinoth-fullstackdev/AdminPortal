const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path");
const mongoose = require('mongoose');
const router = require('./Routes/employeeRoutes');


dotenv.config(); // Load environment variables at the very beginning

const app = express();
const PORT = process.env.PORT || 9000; // Use environment variable for port

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('Database Connected Successful');  
    }).catch(err => {
        console.error('Failed to Connect Database',err); 
        process.exit(1);  
    })
// Middleware
app.use(express.json());
app.use(cors());
app.use("uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use(router);
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
