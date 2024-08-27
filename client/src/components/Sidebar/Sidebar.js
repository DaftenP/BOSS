import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classes from './Sidebar.module.css';
import { navigationActions } from '../../store/navigation';
import logoImage from '../../assets/Layout/Logo_icon.png';
import mainIcon from '../../assets/Layout/Main_icon.png';
import loglistIcon from '../../assets/Layout/Loglist_icon.png';
import managementIcon from '../../assets/Layout/Management_icon.png';
import statisticsIcon from '../../assets/Layout/Statistics_icon.png';

function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const activePage = useSelector((state) => state.navigation.activePage);

  useEffect(() => {
    const path = location.pathname.slice(1); // 현재 경로의 슬래시를 제거한 후 설정
    dispatch(navigationActions.setActivePage(path));
  }, [location, dispatch]);

  return (
    <div className={classes.sidebar}>
      <NavLink to="/main">
        <img src={logoImage} alt="logo_image" className={classes.logoImage} />
      </NavLink>
      <div className={classes.linkContainer}>
        <div className={`${activePage === 'main' ? classes.activeText : undefined} ${classes.normalLink}`}>
          <NavLink to="/main" className={classes.navLink}>
            <img src={mainIcon} alt="main_icon" className={classes.labelIcon} />
            <span>
              {t('Main', '메인')}
            </span>
          </NavLink>
        </div>
        <div className={`${activePage === 'loglist' ? classes.activeText : undefined} ${classes.normalLink}`}>
          <NavLink to="/loglist" className={classes.navLink}>
            <img src={loglistIcon} alt="loglist_icon" className={classes.labelIcon} />
            <span>
              {t('Log List', '조회')}
            </span>
          </NavLink>
        </div>
        <div className={`${activePage === 'statistics' ? classes.activeText : undefined} ${classes.normalLink}`}>
          <NavLink to="/statistics" className={classes.navLink}>
            <img src={statisticsIcon} alt="statistics_icon" className={classes.labelIcon} />
            <span>
              {t('Statistics', '통계')}
            </span>
          </NavLink>
        </div>
        <div className={`${activePage === 'management' ? classes.activeText : undefined} ${classes.normalLink}`}>
          <NavLink to="/management" className={classes.navLink}>
            <img src={managementIcon} alt="management_icon" className={classes.labelIcon} />
            <span>
              {t('Management', '관리')}
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
