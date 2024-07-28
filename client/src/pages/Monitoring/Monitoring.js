import React, { useState } from 'react';
import MonitoringNavbar from '../../components/MonitoringNavbar/MonitoringNavbar';
import classes from './Monitoring.module.css';
import { selectMonitoringData } from '../../store/monitoring';
import { useSelector } from 'react-redux';

const Monitoring = () => {
  const monitoringData = useSelector(selectMonitoringData);
  const [currentIndex, setCurrentIndex] = useState(0); // 초기 인덱스 설정

  const currentPerson = monitoringData[currentIndex];
  const previous_time = currentPerson.time_lst.length - 2;
  const current_time = currentPerson.time_lst.length - 1;

  const handleNextPerson = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % monitoringData.length); // 다음 사람으로 이동, 마지막 사람 이후엔 처음으로 돌아감
  };

  return (
    <div>
      <div className={classes['main-container']}>
        <div className={classes['galaxy-s']}>
          <span className={classes['front-face']}>앞면</span>
          <span className={classes['back-face']}>뒷면</span>
        </div>
        <div className={classes['rectangle']}>
          <div className={classes['rectangle-1']}>
            <div className={classes['success-person']}></div>
            <span className={classes['name-info']}>
              이름: {currentPerson.name}<br /><br />
              부서: {currentPerson.department}<br /><br />
              직책: {currentPerson.position}<br /><br />
            </span>
          </div>
          <div className={classes['rectangle-2']}>
            <div className={classes['line']}></div>
            <div className={classes['line-3']}></div>
            <span className={classes['timestamp']}>{currentPerson.time_lst[previous_time]}</span>
          </div>
          <div className={classes['rectangle-4']}>
            <span className={classes['real-time-monitoring']}>실시간 모니터링</span>
            <div className={classes['conveyor-belt']}>
              <div className={classes['rectangle-5']}></div>
            </div>
          </div>
          <div className={classes['rectangle-6']}>
            <div className={classes['galaxy-s-7']}>
              <div className={classes['flex-row-db']}>
                <div className={classes['line-8']}></div>
                <span className={classes['back-side']}>뒷면</span>
                <span className={classes['front-face-9']}>앞면</span>
              </div>
              <div className={classes['line-a']}></div>
            </div>
            <span className={classes['time-stamp']}>{currentPerson.time_lst[current_time]}</span>
          </div>
          <div className={classes['rectangle-b']}>
            <div className={classes['flex-row']}>
              <span className={classes['security-issue']}>Security Issue</span>
              <span className={classes['total-count']}>총 {currentPerson.issuance_count}건</span>
            </div>
            <span className={classes['device-usb-detected']}>
              {currentPerson.security_issue}
            </span>
          </div>
        </div>
      </div>
      {/* 로고 누르면 다음 사람으로 넘어가고 몇 번째 사람인지 표시 */}
      <MonitoringNavbar onNextPerson={handleNextPerson} currentIndex={currentIndex}/>
      
    </div>
  );
};

export default Monitoring;
