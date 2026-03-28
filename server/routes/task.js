const express = require('express');
const router = express.Router();
const { getTasks, createOrUpdateTask, deleteTask } = require('../controllers/task');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createOrUpdateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
