import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, User, AlertCircle } from 'lucide-react';
import queueService from '../services/queueService';
import { useToast } from '../context/ToastContext';

const UserQueueDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  
  const [queue, setQueue] = useState(null);
  const [myToken, setMyToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
        const storedTokens = JSON.parse(localStorage.getItem('queueTokens') || '{}');
        if (storedTokens[id]) await fetchTokenStatus(storedTokens[id]);
        else await fetchQueue();
    };
    fetchInitialData();

    const interval = setInterval(() => {
      const currentTokens = JSON.parse(localStorage.getItem('queueTokens') || '{}');
      if (currentTokens[id]) fetchTokenStatus(currentTokens[id]);
      else fetchQueue();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const fetchQueue = async () => {
    try {
      const data = await queueService.getQueue(id);
      setQueue(data.data);
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  const fetchTokenStatus = async (tokenId) => {
    try {
      const data = await queueService.getTokenStatus(id, tokenId);
      setMyToken(data.data);
      setQueue(data.data.queue);
      if (data.data.status === 'SERVED' || data.data.status === 'LEFT') clearTokenFromStorage();
    } catch (error) {
      clearTokenFromStorage();
      fetchQueue();
    } finally { setLoading(false); }
  };

  const clearTokenFromStorage = () => {
    const tokens = JSON.parse(localStorage.getItem('queueTokens') || '{}');
    delete tokens[id];
    localStorage.setItem('queueTokens', JSON.stringify(tokens));
    setMyToken(null);
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const data = await queueService.joinQueue(id);
      const tokens = JSON.parse(localStorage.getItem('queueTokens') || '{}');
      tokens[id] = data.data.tokenId;
      localStorage.setItem('queueTokens', JSON.stringify(tokens));
      showToast(`Successfully joined! Your token is ${data.data.token}`);
      fetchTokenStatus(data.data.tokenId);
    } catch (error) { showToast(error.response?.data?.message || 'Failed to join queue', 'error'); } 
    finally { setJoining(false); }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this queue?')) return;
    setLeaving(true);
    try {
      const tokens = JSON.parse(localStorage.getItem('queueTokens') || '{}');
      const tokenId = tokens[id];
      if (tokenId) {
        await queueService.leaveQueue(id, tokenId);
        clearTokenFromStorage();
        showToast('You have left the queue');
        fetchQueue();
      }
    } catch (error) { showToast(error.response?.data?.message || 'Failed to leave queue', 'error'); } 
    finally { setLeaving(false); }
  };

  if (loading && !queue) return <div className="text-center mt-8 text-muted">Loading queue details...</div>;
  if (!queue) return <div className="text-center mt-8 font-semibold" style={{ color: 'var(--danger)' }}>Queue not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" className="inline-flex items-center gap-2 text-muted mb-6 transition-colors" style={{ textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
        <ArrowLeft size={16} /> Back to Queues
      </Link>
      <div className="card">
        <div className="flex justify-between items-start mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontSize: '1.5rem' }}>{queue.serviceName}</h1>
            <div className="text-muted font-medium">Counter {queue.counterNumber}</div>
          </div>
          <span className={`badge badge-${queue.status.toLowerCase()} text-sm`}>{queue.status}</span>
        </div>
        {myToken ? (
          <div className="text-center py-4">
            <h2 className="text-muted font-semibold mb-2" style={{ letterSpacing: '0.05em', fontSize: '0.875rem' }}>YOUR TOKEN</h2>
            <div className="font-bold mb-8" style={{ fontSize: '3.5rem', color: 'var(--primary)', lineHeight: 1 }}>{myToken.token}</div>
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
               <div className="p-4" style={{ backgroundColor: 'var(--neutral-bg)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center gap-2 text-muted mb-2"><User size={16} /><span className="font-medium text-sm uppercase">Now Serving</span></div>
                <div className="text-xl font-bold">{queue.currentToken || 'None'}</div>
              </div>
              <div className="p-4" style={{ backgroundColor: 'var(--neutral-bg)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center gap-2 text-muted mb-2"><Users size={16} /><span className="font-medium text-sm uppercase">People Ahead</span></div>
                <div className="text-xl font-bold">{myToken.peopleAhead}</div>
              </div>
              <div className="p-4" style={{ backgroundColor: 'var(--neutral-bg)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center gap-2 text-muted mb-2"><Clock size={16} /><span className="font-medium text-sm uppercase">Est. Wait</span></div>
                <div className="text-xl font-bold">~{myToken.estimatedWait} min</div>
              </div>
            </div>
            {myToken.status === 'WAITING' ? (
               <button onClick={handleLeave} disabled={leaving} className="btn btn-outline font-semibold" style={{ width: '100%', padding: '0.875rem', color: 'var(--danger)', borderColor: '#fca5a5' }}>{leaving ? 'Leaving...' : 'Leave Queue'}</button>
            ) : (
              <div className="p-4 font-semibold" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-md)' }}>Your token has been called or processed!</div>
            )}
          </div>
        ) : (
          <div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-5" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-sm font-semibold text-muted mb-1 uppercase" style={{ letterSpacing: '0.05em' }}>Currently Serving</div>
                <div className="text-3xl font-bold text-primary">{queue.currentToken || 'None'}</div>
              </div>
              <div className="p-5" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-sm font-semibold text-muted mb-1 uppercase" style={{ letterSpacing: '0.05em' }}>Waiting Users</div>
                <div className="text-3xl font-bold">{queue.currentlyWaiting} <span className="text-lg font-normal text-muted">/ {queue.maxCapacity}</span></div>
              </div>
            </div>
            {queue.status === 'ACTIVE' ? (
              queue.currentlyWaiting >= queue.maxCapacity ? (
                <div className="p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}><AlertCircle size={20} /><span className="font-medium">Queue is currently full.</span></div>
              ) : (
                <button onClick={handleJoin} disabled={joining} className="btn btn-primary font-semibold" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}>{joining ? 'Joining...' : 'Join Queue'}</button>
              )
            ) : queue.status === 'PAUSED' ? (
              <div className="p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: 'var(--radius-md)' }}><AlertCircle size={20} /><span className="font-medium">Queue is paused. New users cannot join right now.</span></div>
            ) : (
              <div className="p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--neutral-bg)', color: 'var(--neutral)', borderRadius: 'var(--radius-md)' }}><AlertCircle size={20} /><span className="font-medium">This queue is {queue.status.toLowerCase()}.</span></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default UserQueueDetail;
