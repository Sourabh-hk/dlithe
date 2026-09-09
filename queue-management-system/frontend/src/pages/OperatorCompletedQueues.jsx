import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import queueService from '../services/queueService';

const OperatorCompletedQueues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCompletedQueues(); }, []);

  const fetchCompletedQueues = async () => {
    try {
      const data = await queueService.getCompletedQueues();
      setQueues(data.data);
    } catch (error) { console.error('Error fetching completed queues', error); } 
    finally { setLoading(false); }
  };

  return (
    <div>
      <Link to="/operator" className="inline-flex items-center gap-2 text-muted mb-6 transition-colors" style={{ textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontSize: '1.75rem' }}>Completed Queues</h1>
          <p className="text-muted mt-2">History of queues that have been completed.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-4 text-muted">Loading history...</div>
      ) : queues.length === 0 ? (
        <div className="card text-center py-12" style={{ padding: '4rem 2rem' }}>
          <CheckCircle size={48} className="mx-auto mb-4 text-success" style={{ margin: '0 auto 1rem', color: 'var(--success)' }} />
          <h3 className="text-lg font-semibold">No Completed Queues</h3>
          <p className="text-muted mt-2">Completed queues will appear here.</p>
        </div>
      ) : (
        <div className="card p-0" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead style={{ backgroundColor: 'var(--neutral-bg)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Counter</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Served</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed Time</th>
                </tr>
              </thead>
              <tbody>
                {queues.map((queue) => (
                  <tr key={queue._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{queue.serviceName}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{queue.counterNumber}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--success)', fontWeight: 600 }}>{queue.totalServed}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {queue.completedAt ? new Date(queue.completedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorCompletedQueues;
