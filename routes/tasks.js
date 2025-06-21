const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { authenticateToken, requireAdmin, requireOwnership } = require('../middleware/auth');

// Apply authentication to all task routes
router.use(authenticateToken);

// GET /api/tasks - Get all tasks with filtering, sorting, and search
router.get('/', async (req, res) => {
  try {
    const { 
      filter, 
      sort, 
      search, 
      priority, 
      dueDateRange,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter query
    const filterQuery = { user: req.user._id };

    // Filter by completion status
    if (filter === 'active') {
      filterQuery.completed = false;
    } else if (filter === 'completed') {
      filterQuery.completed = true;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filterQuery.priority = priority;
    }

    // Filter by due date range
    if (dueDateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dueDateRange) {
        case 'today':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          filterQuery.dueDate = { $gte: today, $lt: tomorrow };
          break;
        case 'week':
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          filterQuery.dueDate = { $gte: today, $lte: nextWeek };
          break;
        case 'overdue':
          filterQuery.dueDate = { $lt: today };
          filterQuery.completed = false;
          break;
      }
    }

    // Text search
    if (search) {
      filterQuery.$text = { $search: search };
    }

    // Build sort query
    const sortQuery = {};
    if (sort && sort !== 'default') {
      const [field, order] = sort.split('_');
      sortQuery[field] = order === 'desc' ? -1 : 1;
    } else {
      sortQuery.createdAt = -1; // Default sort: newest first
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const tasks = await Task.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username email');

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalTasks / parseInt(limit));

    res.json({
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTasks,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// GET /api/tasks/all - Admin route to get all tasks from all users
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const { 
      filter, 
      sort, 
      search, 
      priority, 
      userId,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter query (no user restriction for admin)
    const filterQuery = {};

    // Filter by user if specified
    if (userId) {
      filterQuery.user = userId;
    }

    // Apply other filters (same as regular route)
    if (filter === 'active') {
      filterQuery.completed = false;
    } else if (filter === 'completed') {
      filterQuery.completed = true;
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filterQuery.priority = priority;
    }

    if (search) {
      filterQuery.$text = { $search: search };
    }

    // Build sort query
    const sortQuery = {};
    if (sort && sort !== 'default') {
      const [field, order] = sort.split('_');
      sortQuery[field] = order === 'desc' ? -1 : 1;
    } else {
      sortQuery.createdAt = -1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const tasks = await Task.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username email');

    const totalTasks = await Task.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalTasks / parseInt(limit));

    res.json({
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTasks,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// POST /api/tasks - Add a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, isPublic } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = new Task({
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      isPublic: isPublic || false,
      user: req.user._id
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate('user', 'username email');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', requireOwnership, async (req, res) => {
  try {
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.user;
    delete updateData._id;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', requireOwnership, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// GET /api/tasks/stats - Get task statistics for the current user
router.get('/stats', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          active: { $sum: { $cond: ['$completed', 0, 1] } },
          overdue: {
            $sum: {
              $cond: [
                { $and: [{ $lt: ['$dueDate', new Date()] }, { $eq: ['$completed', false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: stats[0]?.total || 0,
      completed: stats[0]?.completed || 0,
      active: stats[0]?.active || 0,
      overdue: stats[0]?.overdue || 0,
      completionRate: stats[0]?.total ? Math.round((stats[0].completed / stats[0].total) * 100) : 0,
      priorityBreakdown: priorityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;
