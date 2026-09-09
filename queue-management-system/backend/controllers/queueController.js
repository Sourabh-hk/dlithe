const Queue = require('../models/Queue');
const Token = require('../models/Token');

const getQueues = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = { status: { $in: ['ACTIVE', 'PAUSED', 'FULL'] } };
    
    if (status) {
      if (status === 'All') query = { status: { $ne: 'CLOSED' } };
      else query.status = status;
    } else {
        query.status = { $in: ['ACTIVE', 'PAUSED'] };
    }

    if (search) {
      query.$or = [
        { serviceName: { $regex: search, $options: 'i' } },
        { counterNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const queues = await Queue.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: queues });
  } catch (error) { next(error); }
};

const getCompletedQueues = async (req, res, next) => {
  try {
    const queues = await Queue.find({ status: 'COMPLETED' }).sort({ completedAt: -1 });
    res.status(200).json({ success: true, data: queues });
  } catch (error) { next(error); }
};

const getQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) {
      res.status(404);
      throw new Error('Queue not found');
    }
    res.status(200).json({ success: true, data: queue });
  } catch (error) { next(error); }
};

const createQueue = async (req, res, next) => {
  try {
    const { serviceName, counterNumber, maxCapacity } = req.body;
    if (!serviceName || !counterNumber || !maxCapacity) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const words = serviceName.trim().split(/\s+/);
    let tokenPrefix = '';
    if (words.length === 1) tokenPrefix = words[0].substring(0, 3).toUpperCase();
    else {
      tokenPrefix = (words[0][0] + (words[1] ? words[1][0] : '') + (words[2] ? words[2][0] : '')).toUpperCase();
      if(tokenPrefix.length < 3) tokenPrefix = serviceName.substring(0, 3).toUpperCase();
    }

    const queue = await Queue.create({ serviceName, counterNumber, maxCapacity, tokenPrefix });
    res.status(201).json({ success: true, data: queue, message: 'Queue created successfully' });
  } catch (error) { next(error); }
};

const pauseQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) { res.status(404); throw new Error('Queue not found'); }
    if (queue.status === 'COMPLETED' || queue.status === 'CLOSED') { res.status(400); throw new Error(`Cannot pause a ${queue.status.toLowerCase()} queue`); }
    queue.status = 'PAUSED';
    await queue.save();
    res.status(200).json({ success: true, data: queue, message: 'Queue paused' });
  } catch (error) { next(error); }
};

const resumeQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) { res.status(404); throw new Error('Queue not found'); }
    if (queue.status !== 'PAUSED') { res.status(400); throw new Error('Queue is not paused'); }
    queue.status = 'ACTIVE';
    await queue.save();
    res.status(200).json({ success: true, data: queue, message: 'Queue resumed' });
  } catch (error) { next(error); }
};

const closeQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) { res.status(404); throw new Error('Queue not found'); }
    queue.status = 'CLOSED';
    queue.closedAt = Date.now();
    await queue.save();
    res.status(200).json({ success: true, data: queue, message: 'Queue closed' });
  } catch (error) { next(error); }
};

const resetQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) { res.status(404); throw new Error('Queue not found'); }
    await Token.deleteMany({ queueId: queue._id, status: { $in: ['WAITING', 'SERVING'] } });
    queue.status = 'ACTIVE';
    queue.currentToken = null; queue.nextToken = null;
    queue.totalJoined = 0; queue.totalServed = 0;
    queue.completedAt = null; queue.closedAt = null;
    await queue.save();
    res.status(200).json({ success: true, data: queue, message: 'Queue reset successfully' });
  } catch (error) { next(error); }
};

module.exports = { getQueues, getCompletedQueues, getQueue, createQueue, pauseQueue, resumeQueue, closeQueue, resetQueue };
