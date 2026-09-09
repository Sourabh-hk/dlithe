import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import queueService from '../services/queueService';
import CreateQueueModal from '../components/CreateQueueModal';
import { useToast } from '../context/ToastContext';

const OperatorDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  
  const [stats, setStats] = useState({ active: 0, paused: 0, waiting: 0, served: 0 });

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueues = async () => {
    try {
      const data = await queueService.getQueues({ status: 'All' });
      setQueues(data.data);
      let active = 0, paused = 0, waiting = 0, served = 0;
      data.data.forEach(q => {
        if (q.status === 'ACTIVE') active++;
        if (q.status === 'PAUSED') paused++;
        waiting += q.currentlyWaiting;
        served += q.totalServed;
      });
      setStats({ active, paused, waiting, served });
    } catch (error) { console.error('Error fetching queues', error); } 
    finally { setLoading(false); }
  };

  const handleCallNext = async (e, queueId) => {
    e.preventDefault(); 
    try {
      await queueService.callNext(queueId);
      showToast('Next token called successfully');
      fetchQueues();
    } catch (error) { showToast(error.response?.data?.message || 'Error calling next token', 'error'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontSize: '1.75rem' }}>Operator Dashboard</h1>
          <p className="text-muted mt-2">Manage service queues and tokens.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/operator/completed" className="btn btn-outline">Completed Queues</Link>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary"><Plus size={18} /> New Queue</button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="text-3xl font-bold text-primary mb-1">{stats.active}</div>
          <div className="text-sm font-semibold text-muted uppercase tracking-wider">Active Queues</div>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="text-3xl font-bold text-warning mb-1">{stats.paused}</div>
          <div className="text-sm font-semibold text-muted uppercase tracking-wider">Paused Queues</div>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="text-3xl font-bold mb-1">{stats.waiting}</div>
          <div className="text-sm font-semibold text-muted uppercase tracking-wider">Waiting Users</div>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem 1rem' }}>
          <div className="text-3xl font-bold text-success mb-1">{stats.served}</div>
          <div className="text-sm font-semibold text-muted uppercase tracking-wider">Served Today</div>
        </div>
      </div>

      {loading && queues.length === 0 ? (
        <div className="text-center mt-4">Loading queues...</div>
      ) : queues.length === 0 ? (
        <div className="card text-center py-12" style={{ padding: '4rem 2rem' }}>
          <Users size={48} className="mx-auto mb-4 text-muted" style={{ margin: '0 auto 1rem', color: 'var(--text-light)' }} />
          <h3 className="text-lg font-semibold">No Active Queues</h3>
          <p className="text-muted mt-2 mb-6">Create a queue to start managing visitors.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">Create First Queue</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {queues.map((queue) => (
            <div key={queue._id} className="card flex items-center justify-between" style={{ padding: '1.25rem 1.5rem' }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{queue.serviceName}</h3>
                  <span className={`badge badge-${queue.status.toLowerCase()}`}>{queue.status}</span>
                </div>
                <div className="flex gap-6 text-sm text-muted">
                  <span>Counter <strong style={{ color: 'var(--text-main)' }}>{queue.counterNumber}</strong></span>
                  <span>Waiting: <strong style={{ color: 'var(--text-main)' }}>{queue.currentlyWaiting}</strong> / {queue.maxCapacity}</span>
                  <span>Served: <strong style={{ color: 'var(--text-main)' }}>{queue.totalServed}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center border-l pl-6 py-1" style={{ borderColor: 'var(--border-color)', minWidth: '140px' }}>
                  <div className="text-xs font-semibold text-muted mb-1 tracking-wider">NOW SERVING</div>
                  <div className="text-2xl font-bold text-primary">{queue.currentToken || '--'}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={(e) => handleCallNext(e, queue._id)} disabled={queue.status !== 'ACTIVE' || queue.currentlyWaiting === 0} className="btn btn-primary font-semibold" style={{ minWidth: '120px' }}>Call Next</button>
                  <Link to={`/operator/queues/${queue._id}`} className="btn btn-outline font-semibold" style={{ minWidth: '120px' }}>Manage</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <CreateQueueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onQueueCreated={fetchQueues} />
    </div>
  );
};
export default OperatorDashboard;
