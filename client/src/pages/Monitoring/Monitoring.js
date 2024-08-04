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

  // console.log(previous_time, current_time);
  // console.log(currentPerson.time_lst[previous_time]);
  // console.log(currentPerson.time_lst[current_time]);

  return (
    <div>
      <div className={classes['main-container']}>
      <div className={classes['rectangle']}>
        <div className={classes['rectangle-info']}>
          <div className={classes['success-person']} />
          <span className={classes['person-info']}>
            이름 : {currentPerson.name}
            <br />
            부서 : {currentPerson.department}
            <br />
            직책 : {currentPerson.position}
          </span>
          <div className={classes['flex-row-daf']}>
            <span className={classes['security-issue']}>Security Issue</span>
            <span className={classes['total-count']}>총 {currentPerson.issuance_count}건</span>
          </div>
          <span className={classes['usb-detection']}>
          {currentPerson.security_issue.map((issue, index) => (
            <div key={index}>
              {issue}
              <br />
            </div>
          ))}
          </span>
        </div>
        
        <div className={classes['rectangle-live-video-front']}>
          <span className={classes['real-time-monitoring']}>실시간 모니터링</span>
          <div className={classes['conveyor-belt' ]}/>
          {/* <div className={classes['rectangle-4' ]}/> */}
        </div>
        <div className={classes['rectangle-live-video-back']}>
          <span className={classes['real-time-monitoring']}>실시간 모니터링</span>
          <div className={classes['conveyor-belt' ]}/>
          {/* <div className={classes['rectangle-4' ]}/> */}
        </div>
        <div className={classes['rectangle-prev-record']}>
          <div className={classes['phone-prev-front']} />
          <div className={classes['phone-prev-back']} />
          {/* <span className={classes['front-prev']}>앞면</span> */}
          {/* <span className={classes['back-prev']}>뒷면</span> */}
          <div className={classes['line-prev' ]}/>
          <span className={classes['date-time-prev']}>{currentPerson.time_lst[previous_time]}</span>
          
        </div>
        <div className={classes['rectangle-current-record']}>
          <div className={classes['phone-current-front']} />
          <div className={classes['phone-current-back']} />
          {/* <span className={classes['front-current']}>앞면</span> */}
          {/* <span className={classes['back-current']}>뒷면</span> */}
          <div className={classes['line-current' ]}/>
          <span className={classes['date-time-current']}>{currentPerson.time_lst[current_time]}</span>
        </div>
        </div>
      </div>
      {/* 로고 누르면 다음 사람으로 넘어가고 몇 번째 사람인지 표시 */}
      <MonitoringNavbar onNextPerson={handleNextPerson} currentIndex={currentIndex}/>
      
    </div>
  );
};

export default Monitoring;
