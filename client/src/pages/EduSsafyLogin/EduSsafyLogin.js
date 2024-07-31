import React from 'react';
import classes from './EduSsafyLogin.module.css';
import { useNavigate } from 'react-router-dom';


export default function Main() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/EduSsafy');
  };

  return (
    <div className={classes['main-container']}>
      <div className={classes['rectangle']} />
      <div className={classes['rectangle-1']}>
        <span className={classes['privacy-policy']}>
          개인정보처리방침
        </span>
        <span className={classes['copyright-samsung']}>
          Copyright@ SAMSUNG All Rights Reserved.
        </span>
      </div>
      <div className={classes['intro-visual-bg']} />
      <div className={classes['rectangle-2']}>
        <div className={classes['logo']} />
        <span className={classes['id']}>아이디</span>
        <div className={classes['rectangle-3']} />
        <span className={classes['password']}>비밀번호</span>
        <div className={classes['rectangle-4']} />

        <button className={classes['rectangle-5']} onClick={handleLoginClick}>
          <span className={classes['login']}>로그인</span>
        </button>
        <span className={classes['password-recovery']}>비밀번호 찾기</span>
        <div className={classes['rectangle-6']} />
        <span className={classes['id-save']}>아이디 저장</span>
      </div>
      <span className={classes['samsung-sw-academy']}>
        SAMSUNG SW ACADEMY
        <br />
        FOR YOUTH
      </span>
      <span className={classes['ssafy-welcome']}>SSAFY에 오신것을 환영합니다.</span>
    </div>
  );
}
