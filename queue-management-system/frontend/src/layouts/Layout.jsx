import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
