import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/login';
import classes from './Navbar.module.css';
import logoutIcon from '../../assets/Layout/Logout_icon.png';

function Navbar() {
  const dispatch = useDispatch();
  const adminName = useSelector((state) => state.login.adminName);
  const loginTime = useSelector((state) => state.login.loginTime);

  const [elapsedTime, setElapsedTime] = useState('');

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
  );
}

export default Navbar;
