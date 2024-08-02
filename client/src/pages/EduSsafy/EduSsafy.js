import React, { useState, useEffect } from 'react';
import classes from './EduSsafy.module.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import './EduSsafy.module.css';

export default function Main() {
  // 입실/퇴실 상태 관리
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  // 내 정보 항목 표시 상태 변수
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // 날짜, 시간 변수
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // 입실/퇴실 상태 변경 함수
  const toggleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const toggleCheckOut = () => {
    setIsCheckedOut(!isCheckedOut);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    navigate('/EduSsafyLogin');
  };

  // 체크아웃 처리 함수
  const handleCheckOut = () => {
    // 현재 시간을 기록합니다.
    if (!currentDateTime) {
      setCurrentDateTime(new Date());
    }
    // 체크아웃 동작을 호출합니다.
    toggleCheckOut();
  };
  

  useEffect(() => {
    // Google Fonts link 요소 생성
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // 컴포넌트 언마운트 시 link 요소 제거 (옵션)
    return () => {
      document.head.removeChild(link);

      clearInterval(timerId);
    };
  }, []);

  const dayOfWeek = [
    '일', '월', '화', '수', '목', '금', '토'
  ][currentDateTime.getDay()]; // 0: 일요일, 1: 월요일, ..., 6: 토요일

  const year = currentDateTime.getFullYear();
  const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(currentDateTime.getDate()).padStart(2, '0'); // 일

  
  
  // 현재 시간을 형식화하는 함수
  const getFormattedTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formattedTime = currentDateTime ? getFormattedTime(currentDateTime) : 'Click to Check Out';
  return (
    
    <div className={classes['main-container']}>
      <div className={classes['container']}>
      <div className={classes['flex-row']}>
        <div className={classes['rectangle']}>
          <span className={classes['job-ssafy']}>
            JOB
            <br />
            SSAFY
          </span>
          <div className={classes['line']} />
        </div>
        <div className={classes['rectangle-1']}>
          <span className={classes['ssafy-git']}>
            SSAFY
            <br />
            GIT
          </span>
          <div className={classes['line-2']} />
        </div>
        <div className={classes['rectangle-3']}>
          <span className={classes['meeting-ssafy']}>
            Meeting!
            <br />
            SSAFY
          </span>
          <div className={classes['line-4']} />
        </div>
        <div>
          <Link to="/main" className={classes['rectangle-5']}></Link>
        </div>
        <div className={classes['ellipse']} />
        
        <span className={classes['my-campus']}>마이캠퍼스</span>
        <span className={classes['classroom']}>강의실</span>
        <span className={classes['community']}>커뮤니티</span>
        <span className={classes['help-desk']}>HELP DESK</span>
        <span className={classes['mentoring-board']}>멘토링 게시판</span>
        <div className={classes['bell']}>
          <div className={classes['icon']} />
        </div>

        <div className={classes['navigate-container']}>
          <span className={classes['number']}>1158916</span>
          <span className={classes['kim-ji-hwan']}>김지환</span>
          <span className={classes['name']}>님</span>
          {/* 드롭다운을 여는 버튼 */}
          <div className={classes['navigate-next']} onClick={toggleDropdown} />
          {/* 드롭다운 메뉴 */}
          <div className={`${classes['dropdown-menu']} ${isDropdownOpen ? classes['is-show'] : classes['hidden']}`}>
            <div onClick={handleLogout}>로그아웃</div>
          </div>
          </div>
        

      </div>
      <div className={classes['flex-row-e']}>
        <div className={classes['rectangle-6']}>
          <div className={classes['flex-row-def']}>
            <span className={classes['check-status']}>출석체크 & 현황</span>
            <div className={classes['icon-7']} />
          </div>
          <div className={classes['flex-row-da']}>

            <div className={classes['regroup']}>
              {/* 입실/퇴실 버튼 */}
              <div
                className={isCheckedIn ? classes['rectangle-on'] : classes['rectangle-off']}
                onClick={toggleCheckIn}
              >
                {isCheckedIn ? (
                  <span className={classes['time']} onClick={handleCheckOut}>{formattedTime}</span>
                ) : (
                  <div className={classes['icon-in']} onClick={handleCheckOut}></div>
                )}
                
                <span className={isCheckedIn ? classes['check-on'] : classes['check-off']}
                  onClick={toggleCheckIn}>
                  {isCheckedIn ? '정상출석' : '입실하기'}
                </span>
              </div>
              
              <div
                className={isCheckedOut ? classes['rectangle-on'] : classes['rectangle-off']}
                onClick={toggleCheckOut}
              >
                {isCheckedOut ? (
                  <span className={classes['time']} onClick={isCheckedOut}>{formattedTime}</span>
                ) : (
                  <div className={classes['icon-out']} onClick={isCheckedOut}></div>
                )}

                <span className={isCheckedOut ? classes['check-on'] : classes['check-off']}
                  onClick={toggleCheckOut}>
                  {isCheckedOut ? '퇴실하기' : '퇴실하기'}
                </span>
              </div>
            </div>

            <span className={classes['date']}>{month}.{day}</span>
            <span className={classes['day']}>{dayOfWeek}요일</span>
          </div>
        </div>
        <div className={classes['rectangle-b']}>
          <div className={classes['flex-row-b']}>
            <span className={classes['mileage']}>마일리지</span>
            <span className={classes['m-amount']}>1,000,000 M</span>
          </div>
          <div className={classes['line-c']} />
          <div className={classes['flex-row-d']}>
            <span className={classes['level-exp']}>레벨&경험치</span>
            <div className={classes['exp']}>
              <span className={classes['exp-amount']}>2,959</span>
              <span className={classes['exp-e']}> </span>
              <span className={classes['exp-amount-f']}>EXP</span>
            </div>
          </div>
          <div className={classes['screenshot']} />
        </div>
        <div className={classes['rectangle-10']}>
          <div className={classes['flex-row-d-11']}>
            <div className={classes['line-12']} />
            <div className={classes['regroup-i']}>
              <span className={classes['span-dot']}>07.26</span>
              <div className={classes['icon-13']} />
            </div>
            <span className={classes['text-19']}>필독</span>
            <span className={classes['text-1a']}>09:00에 유튜브 라이브 방..</span>
            <div className={classes['line-14']} />
            <div className={classes['line-15']} />
          </div>
          <div className={classes['flex-row-16']}>
            <span className={classes['text-1b']}>알림</span>
            <span className={classes['span']}>163</span>
          </div>
          <div className={classes['flex-row-17']}>
            <span className={classes['text-1d']}>필독</span>
            <span className={classes['text-1e']}>09:00에 유튜브 라이브 방..</span>
            <div className={classes['regroup-i-18']}>
              <div className={classes['icon-19']} />
              <span className={classes['span-dot-1a']}>07.24</span>
            </div>
          </div>
          <div className={classes['flex-row-ae']}>
            <span className={classes['text-20']}>필독</span>
            <span className={classes['text-21']}>09:00에 유튜브 라이브 방..</span>
            <div className={classes['regroup-i-1b']}>
              <div className={classes['icon-1c']} />
              <span className={classes['span-dot-1d']}>07.23</span>
            </div>
          </div>
        </div>
      </div>
      <div className={classes['flex-row-1e']}>
        <div className={classes['rectangle-1f']} />
        <div className={classes['rectangle-20']}>
          <div className={classes['flex-row-c']}>
            <span className={classes['span-21']}>주차별 커리큘럼</span>
            <div className={classes['icon-22']} />
          </div>
          <div className={classes['flex-row-fa']}>
            <span className={classes['fulldate']}>{year}.{month}.{day}({dayOfWeek})</span>
            <div className={classes['clock']}>
              <div className={classes['icon-23']} />
            </div>
          </div>
          <div className={classes['flex-row-f']}>
            <div className={classes['line-24']} />
            <div className={classes['rectangle-25']}>
              <div className={classes['flex-column-ad']}>
                <div className={classes['common-project']}>
                  <span className={classes['common']}>공통</span>
                  <span className={classes['project']}> 프로젝트</span>
                </div>
                <span className={classes['morning-meeting']}>오전 미팅/ 스크럼</span>
                <span className={classes['instructor-bulgyeong']}>
                  담당 강사 / 부울경 201
                </span>
              </div>
              <span className={classes['project-26']}>프로젝트</span>
              <div className={classes['ellipse-27']} />
            </div>
            <span className={classes['ellipse-28']}>09:00~10:00</span>
            <div className={classes['flex-row-a']} />
          </div>
          <div className={classes['rectangle-29']}>
            <div className={classes['common-project-2a']}>
              <div className={classes['common-project-2b']}>
                <span className={classes['common-2c']}>공통</span>
                <span className={classes['project-2d']}> 프로젝트</span>
              </div>
              <span className={classes['project-2e']}>프로젝트</span>
              <div className={classes['ellipse-2f']} />
            </div>
            <div className={classes['ellipse-30']} />
            <span className={classes['time-slot']}>09:00~10:00</span>
          </div>
        </div>
        <div className={classes['rectangle-31']}>
          <div className={classes['flex-column']}>
            <span className={classes['quest']}>Quest</span>
            <span className={classes['evaluation']}>평가</span>
            <span className={classes['quest-evaluation']}>Quest/평가</span>
            <div className={classes['icon-32']} />
            <span className={classes['complete']}>완료</span>
            <span className={classes['python-track']}>
              240524_11기_Python 트랙_5회차_..
            </span>
            <span className={classes['complete-33']}>완료</span>
            <span className={classes['python-track-34']}>
              240513_11기_Python 트랙_10회차...
            </span>
            <div className={classes['slice']} />
            <span className={classes['quest-35']}>Quest</span>
            <span className={classes['python-track-36']}>
              240429_11기_Python 트랙_4회차_..
            </span>
          </div>
          <div className={classes['flex-column-37']}>
            <div className={classes['ellipse-38']} />
            <div className={classes['ellipse-39']} />
          </div>
        </div>
      </div>
      <div className={classes['line-3a']} />
    </div>
    </div>
  );
}
