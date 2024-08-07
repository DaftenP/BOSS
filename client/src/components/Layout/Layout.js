import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import Settings from '../Settings/Settings'
import classes from './Layout.module.css';

function Layout({ children }) {
  return (
    <div className={classes.layout}>
      <Sidebar />
      <div className={classes.mainArea}>
        <Navbar />
        <main className={classes.mainContent}>
          {children}
        </main>
      </div>
      <Settings />
    </div>
  );
}

export default Layout;
