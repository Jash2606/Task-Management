const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.register = async (req, res) => {
   console.log('Registering user...');
   console.log(req.body);
   try{
      const{
         name,
         email,
         password,
         confirmPassword,
         role = 'user'
      } = req.body;

      if(
         !name ||
         !email ||
         !password ||
         !confirmPassword
      ){
         return res.status(400).json({
            success: false,
            message: "All fields are required.",
         });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
            return res.status(400).json({
            success: false,
            message: "Invalid email format.",
         });
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
      if (!passwordRegex.test(password)) {
         return res.status(400).json({
            success: false,
            message:
               "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
         });
      }

      if (password !== confirmPassword) {
         return res.status(400).json({
           success: false,
           message:
             "Password and confirm password do not match. Please try again.",
         });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(409).json({
         success: false,
         message: "User already registered.",
         });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userData = {
         name,
         email,
         password: hashedPassword,
         role,
      };

      const user = new User(userData);

      const savedUser = await user.save();
      if (savedUser) {
         console.log('User registered successfully.');
         return res.status(201).json({
         success: true,
         message: "User registered successfully.",
         });
      }

   }catch(error){
      console.error('Registration error:', error);
      if (error.name === "ValidationError") {
         return res.status(400).json({
           success: false,
           message: "Validation error. Please check your input.",
         });
      } else if (error.name === "MongoError" || error.code === 11000) {
         return res.status(500).json({
           success: false,
           message: "Database error. Please try again later.",
         });
      }
      return res.status(500).json({
         success: false,
         message: "User registration failed. Please try again later.",
      });
   }
};

exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;
   
      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required.",
         });
      }
   
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         return res.status(400).json({
            success: false,
            message: "Invalid email format.",
         });
      }

      if (password.length < 6) {
         return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long.",
         });
      }

      console.log("Finding User , ", email);
      const user = await User.findOne({ email });
      console.log(user);

      if (!user) {
         console.log('User not found');
         return res.status(401).json({
            success: false,
            message: "User is not registered. Please sign up first.",
         });
      }
   
      const isPasswordMatch = await bcrypt.compare(password, user.password);


      if (!isPasswordMatch) {
         return res.status(401).json({
            success: false,
            message: "Password is incorrect.",
         });
      }

   
      const payload = {
         email: user.email,
         id: user._id,
         role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
         expiresIn: "2d",
      });
   
      user.token = token;
      user.password = undefined;
   
      const options = {
         expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict'
      };
   
      return res.cookie("token", token, options).status(200).json({
         success: true,
         token,
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, 
         },
         message: "Logged in successfully.",
      });
   } catch (error) {
      console.error("Login error:", error);
   
      if (error.name === "ValidationError") {
         return res.status(400).json({
            success: false,
            message: "Validation error. Please check your input.",
         });
      } else if (error.name === "MongoError" || error.code === 11000) {
         return res.status(500).json({
            success: false,
            message: "Database error. Please try again later.",
         });
      }
      return res.status(500).json({
         success: false,
         message: "Login failed. Please try again later.",
      });
   }
 };
