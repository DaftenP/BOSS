import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/login';
import classes from './Navbar.module.css';
import logoutIcon from '../../assets/Layout/Logout_icon.png';


function Navbar() {
  const dispatch = useDispatch();
  const adminName = useSelector((state) => state.login.adminName);
  const loginTime = useSelector((state) => state.login.loginTime);
  const logs = useSelector((state) => state.admin.data);

  const [elapsedTime, setElapsedTime] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  const handleToggleLogs = () => {
    setShowLogs((prevShowLogs) => !prevShowLogs);
  };

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
    dispatch(loginAction.logout());
  };

  return (
    <div className={classes.navbar}>
      <div className={classes.navbarContainer}>
        <span className={classes.adminName}>
          {adminName ? `관리자: ${adminName}` : '로그인하지 않음'}
        </span>
        <span className={classes.loginTime}>
          {loginTime ? `로그인 시간: ${new Date(loginTime).toLocaleTimeString()} (${elapsedTime} 접속 중)` : ''}
        </span>
        <button onClick={logoutHandler} className={classes.logoutButton}>
          로그아웃
          <img src={logoutIcon} alt="logout_icon" className={classes.labelIcon} />
        </button>
      </div>
      <span className={classes.loginTimeButton} onClick={handleToggleLogs}>
        접속기록
      </span>
      <div className={`${classes.logsDropdown} ${showLogs ? classes.open : ''}`}>
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>시간</th>
              <th>이름</th>
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