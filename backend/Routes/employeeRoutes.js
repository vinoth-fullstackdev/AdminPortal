const express = require('express');
const multer = require('multer');
const router = express.Router();
const Employee = require('../models/Employee'); // Ensure the path is correct
const fs = require('fs');
const path = require('path');

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads'); 
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => { 
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single employee by ID
router.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) throw Error('No employee found');
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new employee
router.post('/employees/create', upload.single('image'), async (req, res) => {    
    const { name, email, mobile, designation, gender, course } = req.body;
    try {
        // Log the incoming request body and file
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);
        const image = req.file ? req.file.path : null;
       
        const employee = new Employee({ name, email, mobile, designation, gender, course, image });
        console.log("dwewr");
        // Attempt to save the employee and log the result
        await employee.save();
        console.log('Employee saved successfully:', employee);

        res.status(200).json(employee);
    } catch (error) {
        // Log the error to understand what went wrong
        console.error('Error saving employee:', error.message);
        res.status(500).json({ error: "Failed to add employee" });
    }
});


// Update an employee by ID
router.put('/update', upload.single('image'), async (req, res) => {
    const { name, email, mobile, designation, gender, course } = req.body;
    try {
        const image = req.file ? req.file.path : null;
        const updateData = { name, email, mobile, designation, gender, course };
        if (image) {
            updateData.image = image;
        }
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedEmployee) throw Error('No employee found');
        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an employee by ID
router.delete('/employees/:id', async (req, res) => {
    try {
        const removedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!removedEmployee) throw Error('No employee found');
        res.json(removedEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
