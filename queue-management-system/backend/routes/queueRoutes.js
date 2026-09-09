const express = require('express');
const router = express.Router();
const { getQueues, getCompletedQueues, getQueue, createQueue, pauseQueue, resumeQueue, closeQueue, resetQueue } = require('../controllers/queueController');
const { joinQueue, callNext, leaveQueue, getTokenStatus } = require('../controllers/tokenController');

router.route('/').get(getQueues).post(createQueue);
router.get('/completed', getCompletedQueues);
router.route('/:id').get(getQueue);

router.patch('/:id/pause', pauseQueue);
router.patch('/:id/resume', resumeQueue);
router.patch('/:id/close', closeQueue);
router.patch('/:id/reset', resetQueue);

router.post('/:id/join', joinQueue);
router.patch('/:id/next', callNext);

router.route('/:id/tokens/:tokenId').get(getTokenStatus).delete(leaveQueue);

module.exports = router;
