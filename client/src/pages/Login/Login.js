import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import classes from './Login.module.css';
import { loginAction } from "../../store/login";
import sampleImage from '../../assets/Login/Login_background_image.png';
import logoImage from '../../assets/Login/Logo_icon.png';
import idIcon from '../../assets/Login/Id_icon.png'
import passwordIcon from '../../assets/Login/Password_icon.png'
import loginIcon from '../../assets/Login/Login_icon.png'

function Login() {
  const dispatch = useDispatch();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const isLogin = useSelector((state) => state.login.isLogin);

  const loginHandler = (event) => {
    event.preventDefault();
    dispatch(loginAction.login({ id, password }))
    if (isLogin) {
      event.preventDefault();
    } else {
      alert('로그인에 실패했습니다.')
    }
  }

  const handleId = (event) => {
    setId(event.target.value)
  }
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div className={classes.loginContainer} style={{ backgroundImage: `url(${sampleImage})` }}>
      <div>
        <img className={classes.logoImage} src={logoImage} alt="Logo" />
      </div>
      <form onSubmit={loginHandler} className={classes.formContainer}>
        <div className={classes.formGroup}>
          <label htmlFor='id' className={classes.labelText}>
            아이디
            <img src={idIcon} alt="id_icon" className={classes.labelIcon} />
          </label>
          <input 
            type='text' 
            id='id' 
            placeholder="아 이 디" 
            className={classes.inputText} 
            value={id} 
            onChange={handleId} 
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor='password' className={classes.labelText}>
            비밀번호
            <img src={passwordIcon} alt="password_icon" className={classes.labelIcon} />
          </label>
          <input 
            type='password' 
            id='password' 
            placeholder="비 밀 번 호" 
            className={classes.inputText} 
            value={password} 
            onChange={handlePassword} 
          />
        </div>
        <div className={classes.formSubGroup}>
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
