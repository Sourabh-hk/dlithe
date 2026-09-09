import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import queueService from '../services/queueService';
import { useToast } from '../context/ToastContext';

const OperatorQueueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchQueue = async () => {
    try {
      const data = await queueService.getQueue(id);
      setQueue(data.data);
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  const handleCallNext = async () => {
    try {
      await queueService.callNext(id);
      showToast('Next token called');
      fetchQueue();
    } catch (error) { showToast(error.response?.data?.message || 'Error calling next', 'error'); }
  };

  const handlePause = async () => {
    try {
      await queueService.pauseQueue(id);
      showToast('Queue paused');
      fetchQueue();
    } catch (error) { showToast(error.response?.data?.message || 'Error pausing queue', 'error'); }
  };

  const handleResume = async () => {
    try {
      await queueService.resumeQueue(id);
      showToast('Queue resumed');
      fetchQueue();
    } catch (error) { showToast(error.response?.data?.message || 'Error resuming queue', 'error'); }
  };

  const handleClose = async () => {
    if (!window.confirm('Are you sure you want to close this queue? Users will no longer be able to join.')) return;
    try {
      await queueService.closeQueue(id);
      showToast('Queue closed');
      navigate('/operator');
    } catch (error) { showToast(error.response?.data?.message || 'Error closing queue', 'error'); }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset this queue? This will clear all waiting tokens.')) return;
    try {
      await queueService.resetQueue(id);
      showToast('Queue reset successfully');
      fetchQueue();
    } catch (error) { showToast(error.response?.data?.message || 'Error resetting queue', 'error'); }
  };

  if (loading && !queue) return <div className="text-center mt-8 text-muted">Loading queue details...</div>;
  if (!queue) return <div className="text-center mt-8 font-semibold" style={{ color: 'var(--danger)' }}>Queue not found</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/operator" className="inline-flex items-center gap-2 text-muted mb-6 transition-colors" style={{ textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <div className="card mb-6">
         <div className="flex justify-between items-start mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontSize: '1.75rem' }}>{queue.serviceName}</h1>
            <div className="text-muted font-medium text-lg">Counter {queue.counterNumber}</div>
          </div>
          <span className={`badge badge-${queue.status.toLowerCase()} text-sm px-3 py-1`}>{queue.status}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center justify-center p-8 rounded-lg" style={{ backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
            <div className="text-sm font-bold text-primary mb-2 tracking-wider">CURRENTLY SERVING</div>
            <div className="font-bold text-primary" style={{ fontSize: '4rem', lineHeight: 1 }}>{queue.currentToken || '--'}</div>
            <div className="mt-4 text-sm font-semibold text-primary" style={{ opacity: 0.8 }}>Next: {queue.nextToken || 'None'}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 border rounded-lg text-center" style={{ borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="text-sm font-semibold text-muted mb-1 tracking-wider">WAITING</div>
                <div className="text-4xl font-bold">{queue.currentlyWaiting}</div>
                <div className="text-xs text-muted mt-1 font-medium">out of {queue.maxCapacity} capacity</div>
             </div>
             <div className="p-4 border rounded-lg text-center" style={{ borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="text-sm font-semibold text-muted mb-1 tracking-wider">SERVED</div>
                <div className="text-4xl font-bold text-success">{queue.totalServed}</div>
                <div className="text-xs text-muted mt-1 font-medium">total today</div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-primary font-bold px-6 py-3" style={{ fontSize: '1.125rem' }} onClick={handleCallNext} disabled={queue.status !== 'ACTIVE' || queue.currentlyWaiting === 0}>Call Next Token</button>
          {queue.status === 'ACTIVE' && (<button className="btn btn-outline font-semibold px-4" onClick={handlePause}>Pause Queue</button>)}
          {queue.status === 'PAUSED' && (<button className="btn btn-outline font-semibold px-4" onClick={handleResume}>Resume Queue</button>)}
          <div style={{ flexGrow: 1 }}></div>
          <button className="btn btn-outline font-semibold px-4" onClick={handleReset}>Reset</button>
          {(queue.status !== 'CLOSED' && queue.status !== 'COMPLETED') && (<button className="btn btn-danger font-semibold px-4" onClick={handleClose}>Close Queue</button>)}
        </div>
      </div>
    </div>
  );
};
export default OperatorQueueDetail;
