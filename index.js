const express = require('express');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const taskRoute = require('./routes/taskRoute');
const adminRoute = require('./routes/adminRoute');
const  errorHandler  = require('./middleware/errorMiddleware');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/task', taskRoute);
app.use('/api/v1/admin', adminRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
