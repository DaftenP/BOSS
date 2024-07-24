import React from 'react';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/login'; // 로그아웃 액션을 가져옵니다.
import classes from './Navbar.module.css';
import logoutIcon from '../../assets/Layout/Logout_icon.png'

function Navbar() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(loginAction.logout());
  };

  return (
    <div className={classes.navbar}>
      <span className={classes.adminName}>관리자 이름</span>
      <button onClick={logoutHandler} className={classes.logoutButton}>
        로그아웃
        <img src={logoutIcon} alt="logout_icon" className={classes.labelIcon} />
      </button>
    </div>
  );
}

export default Navbar;
