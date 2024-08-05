import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import classes from './Login.module.css';
import { login, logout } from "../../store/login"; // 비동기 액션을 import
import sampleImage from '../../assets/Login/Login_background_image.png';
import logoImage from '../../assets/Login/Logo_icon.png';
import idIcon from '../../assets/Login/Id_icon.png'
import passwordIcon from '../../assets/Login/Password_icon.png'
import loginIcon from '../../assets/Login/Login_icon.png'

function Login() {
  const dispatch = useDispatch();
  // admin Id, password 통합 state
  const [adminInfo, setAdminInfo] = useState({
    adminLoginId: '',
    adminLoginPw: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  const isSuccess = useSelector((state) => state.login.success);
  const error = useSelector((state) => state.login.error);

  const loginHandler = (event) => {
    event.preventDefault();
    dispatch(login(adminInfo));
  }

  useEffect(() => {
    if (isSuccess !== null) {
      if (!adminInfo.adminLoginId && !adminInfo.adminLoginPw) {
        setErrorMessage('아이디와 비밀번호를 입력해 주세요!');
        setErrorKey(prev => prev + 1);
      } else if (!adminInfo.adminLoginId) {
        setErrorMessage('아이디를 입력해 주세요!');
        setErrorKey(prev => prev + 1);
      } else if (!adminInfo.adminLoginPw) {
        setErrorMessage('비밀번호를 입력해 주세요!');
        setErrorKey(prev => prev + 1);
      } else if (isSuccess === false) {
        setErrorMessage('아이디 혹은 비밀번호가 틀렸습니다!');
        setErrorKey(prev => prev + 1);
      }
      dispatch(logout());
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setErrorKey(prev => prev + 1);
    }
  }, [error]);

  const handleAdminInfo = (event) => {
    const { id, value } = event.target;
    setAdminInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value
    }))
  }

  return (
    <div className={classes.loginContainer} style={{ backgroundImage: `url(${sampleImage})` }}>
      <div>
        <img className={classes.logoImage} src={logoImage} alt="Logo" />
      </div>
      <form onSubmit={loginHandler} className={classes.formContainer}>
        <div className={classes.formGroup}>
          <label htmlFor='adminLoginId' className={classes.labelText}>
            아이디
            <img src={idIcon} alt="id_icon" className={classes.labelIcon} />
          </label>
          <input 
            type='text' 
            id='adminLoginId' 
            placeholder="아 이 디" 
            className={classes.inputText} 
            value={adminInfo.adminLoginId} 
            onChange={handleAdminInfo} 
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor='adminLoginPw' className={classes.labelText}>
            비밀번호
            <img src={passwordIcon} alt="password_icon" className={classes.labelIcon} />
          </label>
          <input 
            type='password' 
            id='adminLoginPw' 
            placeholder="비 밀 번 호" 
            className={classes.inputText} 
            value={adminInfo.adminLoginPw} 
            onChange={handleAdminInfo} 
          />
        </div>
        <div key={errorKey} className={classes.formSubGroup}>
          {errorMessage && (
            <div className={classes.errorBox}>{errorMessage}</div>
          )}
          <div></div>
          <button type="submit" className={classes.loginButton}>
            로그인
            <img src={loginIcon} alt="login_icon" className={classes.loginIcon} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
