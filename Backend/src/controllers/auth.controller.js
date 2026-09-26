const model = require('mongoose');
const userModel = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model.js');

/**
 * @name register a user
 * @description register a user expecting username, email, password fields
 * @access Public
 */
const register = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        if(!username || !email || !password) {
            return res.status(400).json({
                message: 'Please provide all fields',
                status: false,
            })
        }
    
        const isUserAlreadyExits = await userModel.findOne({
            // $or -> for condition about finding user by username or email
            $or: [
                { username },
                { email },
            ],
        });
    
        if(isUserAlreadyExits) {
            return res.status(400).json({
                message: 'User already exits with this email or username',
                success: false,
            })
        }
    
        // hashing the password
        const hash = await bcrypt.hash(password, 10);
    
        // creating user
        const user = await userModel.create({
            username,
            email,
            password: hash
        })
    
        // creating token
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );
    
        // setting token into cookies
        res.cookie('token', token);
    
        return res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            message: 'User registered successfully!',
            success: true,
        })
    }
    catch (error) {
        console.error(error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }

}

/**
 * @name login a user
 * @description login a user expecting username/email and password field
 * @access Public
 */
const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({
            email,
        })
    
        if(!user) {
            return res.status(400).json({
                message: 'Invalid Credentials',
                status: false,
            })
        }
    
        // comparing received password with the password saved in the DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if(!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid Credentials',
                status: false,
            })
        }
    
        // creating token
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );
        // setting token into cookies
        res.cookie("token", token);
    
        return res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            message: 'User logged in successfully!',
            success: true
        })
    }

    catch (error) {
        console.error(error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }

}

/**
 * @name logout a user
 * @description clear token from the cookies & add token into the blacklist
 * @access Public
 */
const logout = async (req, res) => {

    try {
        // fetching token from the cookies
        const token = req.cookies.token;

        // if token exits, then adding it to the blacklist
        if(token) {
            await tokenBlacklistModel.create({
                token,
            })
        }

        // clearing token from cookies
        res.clearCookie("token");

        return res.status(200).json({
            message: 'User logout successfully!',
            success: true,
        })
    }
    catch (error) {
        console.error(error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }
}

/**
 * @name Get details of logged in user
 * @description get the details of the current logged in user
 * @access Public
 */
const getMe = async (req, res) => {

    try {
        // finding user by the req.user.id
        const user = await userModel.findById(req.user.id);

        // sending response after fetching user
        return res.status(200).json({
            messgae: 'User details fetched successfully!',
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    }
    catch (error) {
        console.error(error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }
}





module.exports = {
    register,
    login,
    logout,
    getMe,
}