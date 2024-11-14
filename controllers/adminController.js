const User = require('../models/User');
const Task = require('../models/Task');

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });

    }catch(error){
        console.error("Error fetching users ", error);
        res.status(500).json({
            success: false,
            message: 'Server error !',
            error: error.message
        });
    }   
};

exports.deleteTaskByAdmin = async (req, res) => {
    try{
        const id = req.params.id;
        const task = await Task.findByIdAndDelete(id);
        if(!task){
            return res.status(404).json({
                success: false,
                message: 'Task not found !'
            });
        }    
        res.status(200).json({
            success: true,
            message: 'Task deleted successfully !'
        });
    }catch(error){
        console.error("Error deleting task ", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task !',
            error: error.message
        });
    }
};
