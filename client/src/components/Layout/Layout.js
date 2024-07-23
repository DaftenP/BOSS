import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
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
    </div>
  );
}

export default Layout;
