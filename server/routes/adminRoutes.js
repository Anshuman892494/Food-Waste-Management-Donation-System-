const express = require('express');
const { getUsers, getAnalytics, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/analytics', getAnalytics);
router.delete('/users/:id', deleteUser);

module.exports = router;
