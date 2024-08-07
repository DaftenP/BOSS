import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../store/login";
import { fetchAdminLogs } from "../../store/admin";
import { useTranslation } from 'react-i18next';
import lightClasses from './Navbar.module.css';
import darkClasses from './NavbarDark.module.css';
import logoutIcon from '../../assets/Layout/Logout_icon.png';

function Navbar() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const { t } = useTranslation();

  const adminName = useSelector((state) => state.login.adminName);
  const loginTime = useSelector((state) => state.login.loginTime);
  const logs = useSelector((state) => state.admin.data);

  const [elapsedTime, setElapsedTime] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  const handleToggleLogs = () => {
    setShowLogs((prevShowLogs) => {
      if (!prevShowLogs) {
        dispatch(fetchAdminLogs())
      }
      return !prevShowLogs;
    })
  };

  useEffect(() => {
  }, [adminName]);

  useEffect(() => {
    if (loginTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const startTime = new Date(loginTime);
        const difference = now - startTime;

        const minutes = Math.floor(difference / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);

        setElapsedTime(`${minutes}분 ${seconds}초`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loginTime]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div className={classes.navbar}>
      <div className={classes.navbarContainer}>
        <span className={classes.adminName}>
          {adminName ? `${t('Admin')}: ${adminName}` : t('Anonymous Admin')}
        </span>
        <span className={classes.loginTime}>
          {loginTime ? `${t('Login Time')}: ${new Date(loginTime).toLocaleTimeString()} (${elapsedTime} ${t('Elapsed Time')})` : ''}
        </span>
        <button onClick={logoutHandler} className={classes.logoutButton}>
          {t('Logout')}
          <img src={logoutIcon} alt="logout_icon" className={classes.labelIcon} />
        </button>
      </div>
      <span className={classes.loginTimeButton} onClick={handleToggleLogs}>
        {t('Login Records')}
      </span>
      <div className={`${classes.logsDropdown} ${showLogs ? classes.open : ''}`}>
        <table>
          <thead>
            <tr>
              <th>{t('Date')}</th>
              <th>{t('Time')}</th>
              <th>{t('Name')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className={classes.cell}>{log.date}</td>
                <td className={classes.cell}>{log.time}</td>
                <td className={classes.cell}>{log.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Navbar;
