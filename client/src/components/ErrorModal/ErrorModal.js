import React from 'react';
import classes from './ErrorModal.module.css';

const Modal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={classes['modal-overlay']}>
      <div className={classes['modal']}>
        <div className={classes['modal-content']}>
          <p className={classes['modal-text']}>{message}</p>
          <div className={classes['modal-button']} onClick={onClose}>확인</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
