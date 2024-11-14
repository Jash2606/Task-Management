const express = require('express');
const { addTask, getTasks, getTaskById, updateTask, deleteTask , setTaskReminder } = require('../controllers/taskController');
const {auth} = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', auth, addTask);
router.get('/', getTasks); 
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.post('/:id/reminder', auth, setTaskReminder);


module.exports = router;
