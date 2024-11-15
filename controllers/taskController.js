const Task = require('../models/Task');

exports.addTask = async (req, res) => {
   console.log("Adding task");
   try{
      const{
         title,
         description,
         status,
         priority,
         dueDate
      } = req.body;
      
      const userId = req.user.id;

      if(
         !title ||
         !description ||
         !status ||
         !priority ||
         !dueDate 
      ){
         return res.status(400).json({
            success: false,
            error: 'Please provide all required fields !'
         });
      }

      if(!['pending', 'in-progress', 'completed'].includes(status)){
        return res.status(400).json({
            success: false,
            error: 'Invalid status !'
         });
      }

      if(!['low', 'medium', 'high'].includes(priority)){
        return res.status(400).json({
            success: false,
            error: 'Invalid priority !'
         });
      }

      const task = await Task.findOne({ title });
      if(task){
        return res.status(400).json({
            success: false,
            error: 'Task with this title already exists !'
         });
      }

      if(new Date(dueDate) < new Date()){
        return res.status(400).json({
            success: false,
            error: 'Due date cannot be in the past !'
         });
      }

      const newTask = new Task({
         title,
         description,
         status,
         priority,
         dueDate,
         userId
      });
      await newTask.save();
      res.status(201).json({
         success: true,
         data: newTask
      });
   }catch(error){
      console.error("Error during adding a task :", error);

      if (error.name === 'ValidationError') {
         return res.status(400).json({
            success: false,
            error: 'Validation Error !',
            details: error.message
         });
      }

      if (error.name === 'MongoError' && error.code === 11000) {
         return res.status(400).json({
            success: false,
            error: 'Duplicate key error !',
            details: error.message
         });
      }

      res.status(500).json({
         success: false,
         error: 'Server error !'
      });
   }

};


exports.getTasks = async (req, res) => {
   try {
      const { status, priority, dueDate, sortBy = 'dueDate', order = 'asc', page = 1, limit = 10 } = req.query;

      let filter = {};
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (dueDate) filter.dueDate = { $lte: new Date(dueDate) }; 

      const skipValue = (page - 1) * limit;
      const isDescending = order.toLowerCase() === 'desc' ? -1 : 1;
      let tasks = await Task.find(filter);

      if (sortBy === 'priority') {
         const priorityOrder = { low: 1, medium: 2, high: 3 };
         tasks = tasks.sort((a, b) => isDescending * (priorityOrder[a.priority] - priorityOrder[b.priority]));
      } else {
         tasks = tasks.sort((a, b) => isDescending * ((a[sortBy] > b[sortBy]) - (a[sortBy] < b[sortBy])));
      }

      const task = tasks.slice(skipValue, skipValue + parseInt(limit));
      const totalTasks = await Task.countDocuments(filter);
      
      res.status(200).json({
         success: true,
         tasks: task,
         pagination: {
            totalTasks,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalTasks / limit),
         }
      });
   } catch (error) {
      console.error("Error during fetching all tasks:", error);
      res.status(500).json({
         success: false,
         error: 'Server error!',
      });
   }
};

exports.getTaskById = async (req, res) => {
   console.log('Get task by id');
   try{
      const id = req.params.id;
      const task = await Task.findById(id);
      if(!task){
         return res.status(404).json({
            success: false,
            error: 'Task not found !'
         });
      }
      res.status(200).json({
         success: true,
         task: task
      });
   }catch(error){
      console.error("Error during fetching task by id :", error);
      res.status(500).json({
         success: false,
         error: 'Server error !'
      });
   }
};

exports.updateTask = async (req, res) => {
   console.log('Updating task');
   try{
      const id = req.params.id;
      const {
         title,
         description,
         status,
         priority,
         dueDate,
         userId
      } = req.body;

      const updateTask = {};

      if(title) updateTask.title = title;
      if(description) updateTask.description = description;
      if(status) updateTask.status = status;
      if(priority) updateTask.priority = priority;
      if(dueDate) updateTask.dueDate = dueDate;
      if(userId) updateTask.userId = userId;

      if(Object.keys(updateTask).length === 0){
         return res.status(400).json({
            success: false,
            error: 'Please provide fields to update !'
         });
      }


      if( status &&  !['pending', 'in-progress', 'completed'].includes(status)){
        return res.status(400).json({
            success: false,
            error: 'Invalid status !'
         });
      }

      if( priority && !['low', 'medium', 'high'].includes(priority)){
        return res.status(400).json({
            success: false,
            error: 'Invalid priority !'
         });
      }

      if( dueDate && new Date(dueDate) < new Date()){
        return res.status(400).json({
            success: false,
            error: 'Due date cannot be in the past !'
         });
      }

      const updatedTask = await Task.findByIdAndUpdate(id, updateTask, { new: true });

      if(!updatedTask){
         return res.status(404).json({
            success: false,
            error: 'Task not found !'
         });
      }

      res.status(200).json({
         success: true,
         data: updatedTask
      });

   }catch(error){
      console.error("Error during updating task :", error);

      if (error.name === 'ValidationError') {
         return res.status(400).json({
            success: false,
            error: 'Validation Error !',
            details: error.message
         });
      }

      if (error.name === 'MongoError' && error.code === 11000) {
         return res.status(400).json({
            success: false,
            error: 'Duplicate key error !',
            details: error.message
         });
      }

      res.status(500).json({
         success: false,
         error: 'Server error !'
      });
   }
};

exports.deleteTask = async (req, res) => {
   console.log('Deleting task');
   try{
      const {id} = req.params;
      const task = await Task.findByIdAndDelete(id);
      if(!task){
         return res.status(404).json({
            success: false,
            error: 'Task not found !'
         });
      }
      res.status(200).json({
         success: true,
         message: 'Task deleted successfully !'
      });
   }catch(error){
      console.error("Error during deleting task :", error);
      res.status(500).json({
         success: false,
         error: 'Server error !'
      });
   }
};

exports.setTaskReminder = async (req, res) => {
   console.log('Setting task reminder');
   try{
      const {id} = req.params;
      const task = await Task.findById(id);
      if(!task){
         return res.status(404).json({
            success: false,
            error: 'Task not found !'
         });
      }

      if(!task.dueDate){
         return res.status(400).json({
            success: false,
            error: 'Due date is not set !'
         });
      }

      task.reminder = true;
      await task.save();
      res.status(200).json({
         success: true,
         message: 'Remainder set successfully !',
         data: task
      });
   }catch(error){
      console.error("Error during setting task reminder :", error);
      res.status(500).json({
         success: false,
         error: 'Server error !'
      });
   }
};

