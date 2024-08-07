import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers } from '../../store/management';
import classes from './EduSsafyLogin.module.css';
import { useNavigate } from 'react-router-dom';


export default function Main() {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.management.data);
  const [memberId, setMemberId] = useState('');
  const [nfc, setNfc] = useState('');
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 로드 시 멤버 데이터 불러오기
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!memberId && !nfc) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    } else if (!memberId) {
      setErrorMessage('아이디를 입력해 주세요!');
      return;
    } else if (!nfc) {
      setErrorMessage('비밀번호를 입력해 주세요!');
      return;
    }

    // 입력된 memberId와 nfc로 멤버 데이터에서 찾기
    const member = members.find(
      (m) => m.memberId === parseInt(memberId) && m.nfc === nfc
    );

    if (member) {
      console.log('로그인 성공:', member);
      handleLoginClick();
      // 로그인 성공 처리, 예를 들어 유저 상태 저장, 리디렉션 등
    } else {
      setErrorMessage('ID 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handleLoginClick = () => {
    navigate('/EduSsafy');
  };

  return (
    <div className={`${classes['main-container']} ${classes['intro-visual-bg']}`}>
      {/* <div className={classes['rectangle']} /> */}
      <div className={classes['rectangle-1']}>
        <span className={classes['privacy-policy']}>
          개인정보처리방침
        </span>
        <span className={classes['copyright-samsung']}>
          Copyright@ SAMSUNG All Rights Reserved.
        </span>
      </div>
      {/* <div className={classes['intro-visual-bg']} /> */}
      <div className={classes['center']}>
        <form onSubmit={handleLogin}>
          <div className={classes['rectangle-2']}>
            <div className={classes['logo']} />
            <span className={classes['id']}>아이디</span>
            <input 
              type='text' 
              placeholder="ID" 
              className={classes['inputText']}
              id="memberId"
              value={memberId} 
              onChange={(e) => setMemberId(e.target.value)}
            />
            <span className={classes['password']}>비밀번호</span>
            <input 
              type='password' 
              placeholder="PASSWORD" 
              className={classes['inputText']} 
              id="nfc"
              value={nfc}
              onChange={(e) => setNfc(e.target.value)}
            />

            

            <button className={classes['rectangle-5']}>
              <span className={classes['login']}>로그인</span>
            </button>
            <span className={classes['password-recovery']}>비밀번호 찾기</span>
            <div className={classes['rectangle-6']} />

            {errorMessage && <div className={classes.errorBox}>{errorMessage}</div>}
            
            <span className={classes['id-save']}>아이디 저장</span>
          </div>
        </form>
        <span className={classes['samsung-sw-academy']}>
          SAMSUNG SW ACADEMY
          <br />
          FOR YOUTH
        </span>
        <span className={classes['ssafy-welcome']}>SSAFY에 오신것을 환영합니다.</span>
      </div>
    </div>
  );
}
