import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import { ToastProvider } from './context/ToastContext';

import HomePage from './pages/HomePage';
import UserQueueDetail from './pages/UserQueueDetail';
import OperatorDashboard from './pages/OperatorDashboard';
import OperatorQueueDetail from './pages/OperatorQueueDetail';
import OperatorCompletedQueues from './pages/OperatorCompletedQueues';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="queues/:id" element={<UserQueueDetail />} />
            <Route path="operator" element={<OperatorDashboard />} />
            <Route path="operator/queues/:id" element={<OperatorQueueDetail />} />
            <Route path="operator/completed" element={<OperatorCompletedQueues />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
