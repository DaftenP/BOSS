import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import classes from './Sidebar.module.css';
import { navigationActions } from '../../store/navigation';
import logoImage from '../../assets/Layout/Logo_icon.png';
import mainIcon from '../../assets/Layout/Main_icon.png';
import loglistIcon from '../../assets/Layout/Loglist_icon.png';
import managementIcon from '../../assets/Layout/Management_icon.png';
import monitoringIcon from '../../assets/Layout/Monitoring_icon.png';
import statisticsIcon from '../../assets/Layout/Statistics_icon.png';

function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const activePage = useSelector((state) => state.navigation.activePage);

  useEffect(() => {
    const path = location.pathname.slice(1); // 현재 경로의 슬래시를 제거한 후 설정
    dispatch(navigationActions.setActivePage(path));
  }, [location, dispatch]);

  return (
    <div className={classes.sidebar}>
      <NavLink
        to="/main"
      >
        <img src={logoImage} alt="logo_image" className={classes.logoImage} />
      </NavLink>
      <ul>
        <li>
          <NavLink
            to="/main"
            className={activePage === 'main' ? classes.activeLink : undefined}
          >
            <img src={mainIcon} alt="main_icon" className={classes.labelIcon} />
            <span className={activePage === 'main' ? classes.activeText : undefined}>메인</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/loglist"
            className={activePage === 'loglist' ? classes.activeLink : undefined}
          >
            <img src={loglistIcon} alt="loglist_icon" className={classes.labelIcon} />
            <span className={activePage === 'loglist' ? classes.activeText : undefined}>조회</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/statistics"
            className={activePage === 'statistics' ? classes.activeLink : undefined}
          >
            <img src={statisticsIcon} alt="statistics_icon" className={classes.labelIcon} />
            <span className={activePage === 'statistics' ? classes.activeText : undefined}>통계</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/management"
            className={activePage === 'management' ? classes.activeLink : undefined}
          >
            <img src={managementIcon} alt="management_icon" className={classes.labelIcon} />
            <span className={activePage === 'management' ? classes.activeText : undefined}>관리</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/monitoring"
            className={activePage === 'monitoring' ? classes.activeLink : undefined}
          >
            <img src={monitoringIcon} alt="monitoring_icon" className={classes.labelIcon} />
            <span className={activePage === 'monitoring' ? classes.activeText : undefined}>실황</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/edussafylogin"
            className={activePage === 'edussafylogin' ? classes.activeLink : undefined}
          >
            {/* <img src={monitoringIcon} alt="monitoring_icon" className={classes.labelIcon} /> */}
            <span className={activePage === 'edussafylogin' ? classes.activeText : undefined}>에듀싸피</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
