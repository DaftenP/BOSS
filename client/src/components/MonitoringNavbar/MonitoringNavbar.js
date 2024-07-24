import React from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './MonitoringNavbar.module.css';
import logoImage from '../../assets/Layout/Logo_icon.png';
import mainIcon from '../../assets/Layout/Main_icon.png';

function MonitoringNavbar() {
  const navigate = useNavigate();

  const navigateToMain = () => {
    navigate('/main');
  };

  return (
    <div className={classes.monitoringNavbar}>
      <button onClick={navigateToMain} className={classes.navButton}>
        <img src={mainIcon} alt="main_icon" className={classes.mainIcon} />
      </button>
      <img src={logoImage} alt="logo_icon" className={classes.logoIcon} />
      <div className={classes.rightContent}>
        3번
      </div>
    </div>
  );
}

export default MonitoringNavbar;
