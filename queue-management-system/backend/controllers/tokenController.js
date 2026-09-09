const Queue = require('../models/Queue');
const Token = require('../models/Token');

const joinQueue = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) { res.status(404); throw new Error('Queue not found'); }
    if (queue.status !== 'ACTIVE') { res.status(400); throw new Error(`Queue is currently ${queue.status.toLowerCase()}`); }
    if (queue.currentlyWaiting >= queue.maxCapacity) { res.status(400); throw new Error('Queue is currently full.'); }

    const sequenceNumber = queue.totalJoined + 1;
    const tokenNumber = `${queue.tokenPrefix}-${String(sequenceNumber).padStart(3, '0')}`;

    const token = await Token.create({ queueId: queue._id, tokenNumber, sequenceNumber, status: 'WAITING' });

    queue.totalJoined += 1;
    if (!queue.nextToken) queue.nextToken = tokenNumber;
    await queue.save();

    const peopleAhead = await Token.countDocuments({ queueId: queue._id, status: 'WAITING', sequenceNumber: { $lt: sequenceNumber } });
    const estimatedWait = peopleAhead * 5;

    res.status(201).json({ success: true, message: 'Successfully joined', data: { token: tokenNumber, tokenId: token._id, queueId: queue._id, peopleAhead, estimatedWait } });
  } catch (error) { next(error); }
};

const callNext = async (req, res, next) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) { res.status(404); throw new Error('Queue not found'); }
    if (queue.status === 'PAUSED') { res.status(400); throw new Error('Queue is paused.'); }
    if (queue.status !== 'ACTIVE') { res.status(400); throw new Error(`Queue is ${queue.status.toLowerCase()}`); }

    const currentServing = await Token.findOne({ queueId: queue._id, status: 'SERVING' });
    if (currentServing) {
      currentServing.status = 'SERVED';
      currentServing.servedAt = Date.now();
      await currentServing.save();
      queue.totalServed += 1;
    }

    const nextToken = await Token.findOne({ queueId: queue._id, status: 'WAITING' }).sort({ sequenceNumber: 1 });
    if (!nextToken) {
      queue.currentToken = null; queue.nextToken = null;
      if (queue.totalJoined > 0 && queue.totalServed >= queue.totalJoined) { queue.status = 'COMPLETED'; queue.completedAt = Date.now(); }
      await queue.save();
      res.status(200).json({ success: true, message: 'No users are waiting.', data: queue });
      return;
    }

    nextToken.status = 'SERVING';
    await nextToken.save();

    const oneAfterNext = await Token.findOne({ queueId: queue._id, status: 'WAITING', _id: { $ne: nextToken._id } }).sort({ sequenceNumber: 1 });
    queue.currentToken = nextToken.tokenNumber;
    queue.nextToken = oneAfterNext ? oneAfterNext.tokenNumber : null;
    await queue.save();

    const remaining = await Token.countDocuments({ queueId: queue._id, status: 'WAITING' });
    res.status(200).json({ success: true, message: 'Next token called', data: { queue, currentToken: nextToken.tokenNumber, remaining } });
  } catch (error) { next(error); }
};

const leaveQueue = async (req, res, next) => {
  try {
    const { id, tokenId } = req.params;
    const token = await Token.findOne({ _id: tokenId, queueId: id });
    if (!token) { res.status(404); throw new Error('Token not found in this queue'); }
    if (token.status !== 'WAITING') { res.status(400); throw new Error(`Cannot leave queue, token is ${token.status}`); }

    token.status = 'LEFT'; token.leftAt = Date.now();
    await token.save();

    const queue = await Queue.findById(id);
    if(queue && queue.nextToken === token.tokenNumber) {
        const nextWaiting = await Token.findOne({ queueId: queue._id, status: 'WAITING' }).sort({ sequenceNumber: 1 });
        queue.nextToken = nextWaiting ? nextWaiting.tokenNumber : null;
        await queue.save();
    }
    res.status(200).json({ success: true, message: 'Left the queue' });
  } catch (error) { next(error); }
};

const getTokenStatus = async (req, res, next) => {
  try {
    const { id, tokenId } = req.params;
    const token = await Token.findOne({ _id: tokenId, queueId: id }).populate('queueId');
    if (!token) { res.status(404); throw new Error('Token not found'); }

    let peopleAhead = 0; let estimatedWait = 0;
    if (token.status === 'WAITING') {
      peopleAhead = await Token.countDocuments({ queueId: id, status: 'WAITING', sequenceNumber: { $lt: token.sequenceNumber } });
      estimatedWait = peopleAhead * 5;
    }
    res.status(200).json({ success: true, data: { token: token.tokenNumber, status: token.status, queue: token.queueId, peopleAhead, estimatedWait } });
  } catch (error) { next(error); }
};

module.exports = { joinQueue, callNext, leaveQueue, getTokenStatus };
