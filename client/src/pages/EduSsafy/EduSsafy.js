import React, { useState, useEffect } from 'react';
import classes from './EduSsafy.module.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchLogs } from '../../store/loglist'; // fetchLogs 액션 가져오기
import { useSelector, useDispatch } from 'react-redux';
// import './EduSsafy.module.css';

export default function Main() {
  // 입실/퇴실 상태 관리
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  // 내 정보 항목 표시 상태 변수
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 입실, 퇴실 시간 변수
  const [incheckTime, setIncheckTime] = useState('');
  const [outcheckTime, setOutcheckTime] = useState('');

  const navigate = useNavigate();

  // 날짜, 시간 변수
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const location = useLocation();
  const { member } = location.state || {}; // 전달된 사용자 정보
  // console.log('Location state:', location.state); // 추가된 로그
  const logsData = useSelector(state => state.loglist.data);
  
  const memberId = member?.memberId || '알 수 없음';
  const name = member?.name || '알 수 없음';

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

    // console.log(member);
  // 2023-01-23T12:00:00 => 12:00 형식으로 변환
  const formatTime = (datetime) => {
    const time = datetime.split('T')[1].split(':');
    return `${time[0]}:${time[1]}`;
  };

  // 오늘 날짜 구하기
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const checkIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setIncheckTime(String(checkInTime));
    }
    
  };
  // console.log(isCheckedIn);

  const getCheckInStatus = () => {
    if (!isCheckedIn) return '입실하기';
    
    const [hours, minutes] = incheckTime.split(':').map(Number);
    const checkInDate = new Date();
    checkInDate.setHours(hours, minutes, 0, 0);

    const nineAM = new Date();
    nineAM.setHours(9, 0, 0, 0);

    return checkInDate < nineAM ? '정상출석' : '지각';
  };

  useEffect(() => {
    const checkInAutomatically = () => {
      try {
        // 로그인된 계정 정보와 NFC 이름을 기준으로 로그 데이터 필터링
        const matchingLogs = logsData.filter(log => {
          const logTime = new Date(log.time);
          return log.member.memberId === member.memberId && 
                 log.nfcName === member.nfcName &&
                 log.entering === 0 && 
                 log.issue === 0 &&
                  isToday(logTime) && 
                 logTime.getHours() >= 6;
        });
  
        if (matchingLogs.length > 0) {
          // 가장 빠른 시각의 로그를 찾기 위해 정렬
          matchingLogs.sort((a, b) => new Date(a.time) - new Date(b.time));
          const earliestLog = matchingLogs[0];
  
          // 입실 체크 처리
          setIsCheckedIn(true);
          const formattedTime = formatTime(earliestLog.time);
          setIncheckTime(formattedTime);
        }
      } catch (error) {
        console.error('Error checking in automatically:', error);
      }
    };
    checkInAutomatically();
    // 주기적으로 로그 데이터를 확인하도록 폴링 설정
    const intervalId = setInterval(() => {
      dispatch(fetchLogs());
      checkInAutomatically();
    }, 3000); // 3초마다 실행
    
    return () => clearInterval(intervalId);
    
  }, [logsData, member, dispatch]);

  const checkOut = () => {
    const now = new Date();
    setIsCheckedOut(true);
    setOutcheckTime(now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    navigate('/EduSsafyLogin');
  };

  const handleToMain = () => {
    navigate('/Main');
  };


  useEffect(() => {
    // 로컬 스토리지에서 입실 체크 시간 가져오기
    // const storedIncheckTime = localStorage.getItem('incheckTime');
    // if (storedIncheckTime) {
    //   setIsCheckedIn(true);
    //   setIncheckTime(storedIncheckTime);
    // }

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


  const checkInTime = currentDateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // 이게 뭔가 문제가 있는거 같다.
  // useEffect(() => {
  //   setIncheckTime(String(checkInTime))
  // }, [isCheckedIn])


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
          <div className={classes['line-job-ssafy']} />
        </div>
        <div className={classes['rectangle-1']}>
          <span className={classes['ssafy-git']}>
            SSAFY
            <br />
            GIT
          </span>
          <div className={classes['line-ssafy-git']} />
        </div>
        <div className={classes['rectangle-3']}>
          <span className={classes['meeting-ssafy']}>
            Meeting!
            <br />
            SSAFY
          </span>
          <div className={classes['line-meeting-ssafy']} />
        </div>
        <div onClick={handleToMain} className={classes['ssafy-logo']} />

        <div className={classes['profile']} />
        
        <span className={classes['my-campus']}>마이캠퍼스</span>
        <span className={classes['classroom']}>강의실</span>
        <span className={classes['community']}>커뮤니티</span>
        <span className={classes['help-desk']}>HELP DESK</span>
        <span className={classes['mentoring-board']}>멘토링 게시판</span>
        <div className={classes['bell']}>
          <div className={classes['bell-icon']} />
        </div>

        <div className={classes['navigate-container']}>
          <span className={classes['number']}>{memberId}</span>
          <span className={classes['name']}>
            {name}
            <span style={{ color: 'black' }}>님</span>
          </span>


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
            <div className={classes['plus-icon-1']} />
          </div>
          <div className={classes['flex-row-da']}>

            <div className={classes['regroup']}>
              {/* 입실/퇴실 버튼 */}
              <div
                className={isCheckedIn ? classes['rectangle-on'] : classes['rectangle-off']}
                onClick={checkIn} // 이미 체크인 되어 있으면 클릭 비활성화
              >
                {isCheckedIn ? (
                  <span className={classes['time']} onClick={checkIn}>{incheckTime}</span>
                ) : (
                  <div className={classes['icon-in']} onClick={checkIn}></div>
                )}
                
                <span className={isCheckedIn ? classes['check-on'] : classes['check-off']}
                  onClick={checkIn}>
                  {getCheckInStatus()} {/* 출석 상태 표시 */}
                </span>
              </div>
              
              <div
                className={isCheckedOut ? classes['rectangle-on'] : classes['rectangle-off']}
                onClick={checkOut}
              >
                {isCheckedOut ? (
                  <span className={classes['time']} onClick={checkOut}>{outcheckTime}</span>
                ) : (
                  <div className={classes['logout-icon']} onClick={checkOut}></div>
                )}

                <span className={isCheckedOut ? classes['check-on'] : classes['check-off']}
                  onClick={checkOut}>
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
          <div className={classes['blue-line-row']} />
          <div className={classes['flex-row-d']}>
            <span className={classes['level-exp']}>레벨&경험치</span>
            <div className={classes['exp']}>
              <span className={classes['exp-amount']}>2,959</span>
              <span className={classes['exp-e']}> </span>
              <span className={classes['exp-amount-f']}>EXP</span>
            </div>
          </div>
          <div className={classes['tier-gauge']} />
        </div>
        <div className={classes['rectangle-10']}>
          <div className={classes['flex-row-d-11']}>
            <div className={classes['blue-line-column']} />
            <div className={classes['regroup-i']}>
              <span className={classes['span-dot']}>07.26</span>
              <div className={classes['mail-icon-1']} />
            </div>
            <span className={classes['text-19']}>필독</span>
            <span className={classes['text-1a']}>09:00에 유튜브 라이브 방..</span>
            <div className={classes['blue-line-row-1']} />
            <div className={classes['blue-line-row-2']} />
          </div>
          <div className={classes['flex-row-16']}>
            <span className={classes['text-1b']}>알림</span>
            <span className={classes['span']}>163</span>
          </div>
          <div className={classes['flex-row-17']}>
            <span className={classes['text-1d']}>필독</span>
            <span className={classes['text-1e']}>09:00에 유튜브 라이브 방..</span>
            <div className={classes['regroup-i-18']}>
              <div className={classes['mail-icon-2']} />
              <span className={classes['span-dot-1a']}>07.24</span>
            </div>
          </div>
          <div className={classes['flex-row-ae']}>
            <span className={classes['text-20']}>필독</span>
            <span className={classes['text-21']}>09:00에 유튜브 라이브 방..</span>
            <div className={classes['regroup-i-1b']}>
              <div className={classes['mail-icon-3']} />
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
            <div className={classes['plus-icon-2']} />
          </div>
          <div className={classes['flex-row-fa']}>
            <span className={classes['fulldate']}>{year}.{month}.{day}({dayOfWeek})</span>
            <div className={classes['clock']}>
              <div className={classes['clock-icon']} />
            </div>
          </div>
          <div className={classes['flex-row-f']}>
            <div className={classes['gray-line-icon']} />
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
              <div className={classes['pink-ellipse-icon-1']} />
            </div>
            <span className={classes['ellipse-28']}>09:00~10:00</span>
            <div className={classes['blue-ellipse-index-1']} />
          </div>
          <div className={classes['rectangle-29']}>
            <div className={classes['common-project-2a']}>
              <div className={classes['common-project-2b']}>
                <span className={classes['common-2c']}>공통</span>
                <span className={classes['project-2d']}> 프로젝트</span>
              </div>
              <span className={classes['project-2e']}>프로젝트</span>
              <div className={classes['pink-ellipse-icon-2']} />
            </div>
            <div className={classes['blue-ellipse-index-2']} />
            <span className={classes['time-slot']}>09:00~10:00</span>
          </div>
        </div>
        <div className={classes['rectangle-31']}>
          <div className={classes['flex-column']}>
            <span className={classes['quest']}>Quest</span>
            <span className={classes['evaluation']}>평가</span>
            <span className={classes['quest-evaluation']}>Quest/평가</span>
            <div className={classes['plus-icon-3']} />
            <span className={classes['complete']}>완료</span>
            <span className={classes['python-track']}>
              240524_11기_Python 트랙_5회차_..
            </span>
            <span className={classes['complete-33']}>완료</span>
            <span className={classes['python-track-34']}>
              240513_11기_Python 트랙_10회차...
            </span>
            <div className={classes['sliced-ellipse-icon']} />
            <span className={classes['quest-35']}>Quest</span>
            <span className={classes['python-track-36']}>
              240429_11기_Python 트랙_4회차_..
            </span>
          </div>
          <div className={classes['flex-column-37']}>
            <div className={classes['gray-ellipse-icon-ellipse-1']}/>
            <div className={classes['gray-ellipse-icon-ellipse-2']} />
          </div>
        </div>
      </div>
      <div className={classes['nav-line']} />
    </div>
    </div>
  );
}
