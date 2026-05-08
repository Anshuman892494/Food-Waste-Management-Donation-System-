const express = require('express');
const { getAssignedTasks, updateDeliveryStatus } = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/tasks', protect, authorize('volunteer'), getAssignedTasks);
router.put('/update/:id', protect, authorize('volunteer'), updateDeliveryStatus);

module.exports = router;
