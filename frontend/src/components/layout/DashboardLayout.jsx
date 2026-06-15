import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100vw' }}>
      {/* Sidebar Latérale Fixe */}
      <Sidebar />

      {/* Zone principale à droite */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        {/* En-tête */}
        <Header />

        {/* Espace de contenu dynamique pour les sous-routes */}
        <main 
          style={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            padding: '2rem',
            backgroundColor: 'var(--light-color)' 
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
