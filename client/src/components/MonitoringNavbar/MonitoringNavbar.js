import React from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './MonitoringNavbar.module.css';
import logoImage from '../../assets/Layout/Logo_icon.png';
import mainIcon from '../../assets/Layout/Main_icon.png';

function MonitoringNavbar({ onNextPerson, currentIndex }) {
  const navigate = useNavigate();

  const navigateToMain = () => {
    navigate('/main');
  };

  return (
    <div className={classes.monitoringNavbar}>
      <button onClick={navigateToMain} className={classes.navButton}>
        <img src={mainIcon} alt="main_icon" className={classes.mainIcon} />
      </button>
      <button onClick={onNextPerson} className={classes.nextPersonButton}>
        <img src={logoImage} alt="logo_icon" className={classes.logoIcon} />
      </button>
      <div className={classes.rightContent}>
        {/* 데이터 index */}
        {currentIndex + 1}번 
      </div>
    </div>
  );
}

export default MonitoringNavbar;
