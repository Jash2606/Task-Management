const express = require('express');
const { getAllUsers, deleteTaskByAdmin } = require('../controllers/adminController');
const {auth}  = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/users', auth, admin, getAllUsers); 
router.delete('/tasks/:id', auth, admin, deleteTaskByAdmin); 

module.exports = router;
