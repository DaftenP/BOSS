import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Sidebar.module.css';
import logoImage from '../../assets/Layout/Logo_black.png'
import loglistIcon from '../../assets/Layout/Loglist_icon.png'
import mainIcon from '../../assets/Layout/Main_icon.png'
import managementIcon from '../../assets/Layout/Management_icon.png'
import monitoringIcon from '../../assets/Layout/Monitoring_icon.png'
import staticIcon from '../../assets/Layout/Static_icon.png'

function Sidebar() {
  return (
    <div className={classes.sidebar}>
    <img src={logoImage} alt="logo_image" className={classes.logoImage} />
      <ul>
        <li>
          <NavLink to="/main" activeClassName={classes.activeLink}>
            <img src={mainIcon} alt="main_icon" className={classes.labelIcon} />
            메인
          </NavLink>
        </li>
        <li>
          <NavLink to="/loglist" activeClassName={classes.activeLink}>
            <img src={loglistIcon} alt="loglist_icon" className={classes.labelIcon} />
            조회
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
