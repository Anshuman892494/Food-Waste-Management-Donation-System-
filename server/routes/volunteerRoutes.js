const express = require('express');
const { getAssignedTasks, updateDeliveryStatus, getAvailableTasks, acceptTask } = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/tasks', protect, authorize('volunteer'), getAssignedTasks);
router.get('/available', protect, authorize('volunteer'), getAvailableTasks);
router.put('/accept/:id', protect, authorize('volunteer'), acceptTask);
router.put('/update/:id', protect, authorize('volunteer'), updateDeliveryStatus);

module.exports = router;
