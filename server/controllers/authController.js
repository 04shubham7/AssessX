const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const Admin = require('../models/Admin');

const authSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new admin
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
    try {
        const { email, password } = authSchema.parse(req.body);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(400).json({ message: 'Invalid request data' });
    }

    const { email, password } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin
    const admin = await Admin.create({
        email,
        password,
    });

    if (admin) {
        res.status(201).json({
            _id: admin.id,
            email: admin.email,
            token: generateToken(admin.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// @desc    Authenticate a admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = authSchema.parse(req.body);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(400).json({ message: 'Invalid credentials format' });
    }

    const { email, password } = req.body;

    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
        res.json({
            _id: admin.id,
            email: admin.email,
            token: generateToken(admin.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get admn data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.admin);
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getMe,
};
