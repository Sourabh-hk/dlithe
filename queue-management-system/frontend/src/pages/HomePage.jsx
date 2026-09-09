import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, AlertCircle } from 'lucide-react';
import queueService from '../services/queueService';

const HomePage = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, [searchTerm]);

  const fetchQueues = async () => {
    try {
      const data = await queueService.getQueues({ search: searchTerm });
      setQueues(data.data);
    } catch (error) {
      console.error('Error fetching queues', error);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontSize: '1.75rem' }}>Available Queues</h1>
          <p className="text-muted mt-2">Join a queue for the service you need.</p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-light)' }} />
          <input
            type="text" className="form-input" placeholder="Search by service name or counter..."
            style={{ paddingLeft: '2.5rem' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && queues.length === 0 ? (
        <div className="text-center mt-4 text-muted">Loading queues...</div>
      ) : queues.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem 1.5rem' }}>
          <Users size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-light)' }} />
          <h3 className="text-lg font-semibold">No queues found</h3>
          <p className="text-muted mt-2">There are currently no queues available matching your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queues.map((queue) => (
            <div key={queue._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold" style={{ fontSize: '1.125rem' }}>{queue.serviceName}</h3>
                  <p className="text-muted text-sm mt-1">Counter {queue.counterNumber}</p>
                </div>
                <span className={`badge badge-${queue.status.toLowerCase()}`}>{queue.status}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between mb-2">
                  <span className="text-muted text-sm">Capacity</span>
                  <span className="font-semibold text-sm">{queue.currentlyWaiting} / {queue.maxCapacity} waiting</span>
                </div>
                <div style={{ height: '6px', background: 'var(--neutral-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: queue.currentlyWaiting >= queue.maxCapacity ? 'var(--danger)' : 'var(--primary)', width: `${Math.min((queue.currentlyWaiting / queue.maxCapacity) * 100, 100)}%` }} />
                </div>
                {queue.status === 'ACTIVE' && queue.currentToken && (
                  <div className="mt-4 p-3" style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)' }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)', letterSpacing: '0.05em' }}>NOW SERVING</div>
                    <div className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{queue.currentToken}</div>
                  </div>
                )}
                {queue.status === 'ACTIVE' && !queue.currentToken && (
                  <div className="mt-4 p-3" style={{ background: 'var(--neutral-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <div className="text-xs font-semibold mb-1 text-muted" style={{ letterSpacing: '0.05em' }}>STATUS</div>
                    <div className="font-medium text-muted">Waiting for first user</div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Link to={`/queues/${queue._id}`} className="btn btn-primary w-full" style={{ padding: '0.75rem' }}>
                  View Queue Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default HomePage;
