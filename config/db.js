const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongoURL = process.env.MONGO_URI;

const connectDB = async () => {
   try {
        console.log("Connecting to database... ")
       await mongoose.connect(mongoURL, {
       });
       console.log('Connected to MongoDB successfully');
   } catch (error) {
       console.error(error.message);
       process.exit(1);
   }
};

module.exports = connectDB;
