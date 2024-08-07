import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilteredLogs } from '../../store/loglist';
import lightClasses from './Main.module.css';
import darkClasses from './MainDark.module.css';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ruleImage from '../../assets/Main/Rule_background_image.png'
import damageImage from '../../assets/Main/Damage_state.png'
import noAttachedImage from '../../assets/Main/No_attached_state.png'
import changeImage from '../../assets/Main/Change_state.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCogs, faExclamationTriangle, faPercentage } from '@fortawesome/free-solid-svg-icons';

function Main() {
  const dispatch = useDispatch()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const classes = isDarkMode ? darkClasses : lightClasses;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleImageClick = (src) => {
    setModalImage(src);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const logs = useSelector((state) => state.loglist.data)
  useEffect(() => {
    const getTodayDateString = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayDateString = getTodayDateString();
    const startTime = `${todayDateString}T00:00:01`;
    const endTime = `${todayDateString}T23:59:59`;
    const transformedFilters = {
      name: null,
      departmentName: null,
      positionName: null,
      entering: null,
      startTime: startTime,
      endTime: endTime,
      issue: null,
    }
    dispatch(fetchFilteredLogs(transformedFilters))
  }, [dispatch])

  const today = new Date()
  const todayString = today.toISOString().split('T')[0];
  const firstFilteredLogs = logs.filter(log => log.time.split('T')[0] === todayString)

  const secondFilteredLogs = firstFilteredLogs
  .filter(log => log.issue === 1)
  .map(log => ({
    gateNumber: log.gateNumber,
    date: log.time.split('T')[0],
    time: log.time.split('T')[1],
    name: log.member.name,
    department: log.member.department.departmentName,
    position: log.member.position.positionName,
    entering: log.entering,
  }));

  // 시간 단위로 그룹화 (9시부터 21시까지)
  const startHour = 9;
  const endHour = 21;
  const groupedData = new Array(endHour - startHour + 1).fill(0);

  secondFilteredLogs.forEach(log => {
    const hour = new Date(`${todayString}T${log.time}`).getHours();
    if (hour >= startHour && hour <= endHour) {
      groupedData[hour - startHour]++;
    }
  });

  // 차트 데이터를 준비
  const labels = [];
  for (let i = startHour; i <= endHour; i++) {
    labels.push(`${i} ~ ${i + 1} 시`);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: '적발 인원',
        data: groupedData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value + ' 명';
          },
          color: '#a8a8a8',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: '#555555'
        }
      },
      x: {
        ticks: {
          color: '#a8a8a8',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: '#555555'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#a8a8a8',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
    }
  };

  const normalUsersCount = firstFilteredLogs.length - secondFilteredLogs.length;
  const badUsersCount = secondFilteredLogs.length;
  const errorPercent = secondFilteredLogs.length === 0 ? 0 : (secondFilteredLogs.length / firstFilteredLogs.length * 100).toFixed(2)

  // 도넛 차트를 위한 데이터 준비
  const doughnutData = {
    labels: ['정상 기록', '문제 발생'],
    datasets: [
      {
        data: [normalUsersCount, badUsersCount],
        backgroundColor: ['rgba(176, 210, 250, 0.5)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['#7990FD', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // 도넛 차트 옵션 설정
  const optionsDounut = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    scales: {},
    plugins: {
      legend: {
        labels: {
          color: '#a8a8a8', // 범례 글자색
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
    }
  };
  
  // 20개의 데이터만 보여주는 코드
  const sliceLogs = secondFilteredLogs.slice(0, 15)

  return (
    <div className={classes.mainContainer}>
      <div className={classes.todayIssueContainer}>
        <div>
          <div className={classes.chartTitle}>
            금일 이슈 현황
            <div className={classes.lineChartContainer}>
              <Line data={chartData} options={options} />
            </div>
          </div>
          <div className={classes.doughnutChartTitle}>
            금일 이슈 인원 비율
          </div>
          <div className={classes.doughnutChartContainer}>
            <Doughnut data={doughnutData} options={optionsDounut} />
          </div>
          {/* <div>
            <table className={classes.logTable}>
              <thead>
                <tr>
                  <th>금일 기기 횟수</th>
                  <th>금일 보안 이슈 발생 횟수</th>
                  <th>금일 보안 이슈 비율</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{firstFilteredLogs.length} 회</td>
                  <td>{secondFilteredLogs.length} 회</td>
                  <td>{errorPercent} %</td>
                </tr>
              </tbody>
            </table>
          </div> */}

          <div className={classes.statisticsContainer}>
            <div className={`${classes.card} ${classes.topCard}`}>
              <FontAwesomeIcon icon={faCogs} className={classes.cardIcon} />
              <div className={classes.cardContent}>
                <div className={classes.cardTitle}>금일 검사 횟수</div>
                <div className={classes.cardValue}>{firstFilteredLogs.length} 회</div>
              </div>
            </div>
            <div className={`${classes.card} ${classes.bottomRightCard}`}>
              <FontAwesomeIcon icon={faExclamationTriangle} className={classes.cardIcon} />
              <div className={classes.cardContent}>
                <div className={classes.cardTitle}>이슈 발생 횟수</div>
                <div className={classes.cardValue}>{secondFilteredLogs.length} 회</div>
              </div>
            </div>
            <div className={`${classes.card} ${classes.bottomLeftCard}`}>
              <FontAwesomeIcon icon={faPercentage} className={classes.cardIcon} />
              <div className={classes.cardContent}>
                <div className={classes.cardTitle}>금일 이슈 비율</div>
                <div className={classes.cardValue}>{errorPercent} %</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className={classes.issueLogContainer}>
        <div className={classes.totalIssueContainer}>
          <div className={classes.relativeBoxContainer}>
            <div className={classes.issueTitleBox}>
              실시간 적발 상황
            </div>
          </div>
          <div className={classes.tableContainer}>
            <table className={classes.logTable}>
              <thead>
                <tr>
                  <th>기기</th>
                  <th>시간</th>
                  <th>이름</th>
                  <th>부서</th>
                  <th>직책</th>
                  <th>출/퇴</th>
                </tr>
              </thead>
              <tbody>
                {sliceLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.gateNumber}</td>
                    <td>{log.time}</td>
                    <td>{log.name}</td>
                    <td>{log.department}</td>
                    <td>{log.position}</td>
                    <td>{log.entering}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={classes.totalRuleContainer} style={{ backgroundImage: `url(${ruleImage})` }}>
          <div className={classes.relativeBoxContainer}>
            <div className={classes.ruleTitleBox}>이슈 조치 사항</div>
          </div>
          <div className={classes.firstRuleContainer}>
            <div className={classes.ruleTitle}>스티커 훼손</div>
            <div className={classes.ruleContent}>
              <div className={classes.imageContainer}>
                <img src={damageImage} alt="damage_image" className={classes.guideImage} onClick={() => handleImageClick(damageImage)} />
                <div>예시 사진</div>
              </div>
              <ul>
                <p>1. <span className={classes.warningFont}>적발된 인원</span>을 <span className={classes.highlight}>대기열에서 분리</span></p>
                <p>2. <span className={classes.highlight}>훼손 사유</span>가 정당한지 판단</p>
                <p>3. <span className={classes.highlight}>훼손된 스티커</span> 제거</p>
                <p>4. <span className={classes.highlight}>새로운 스티커</span> 재부착</p>
                <p>5. <span className={classes.warningFont}>문제가 있다면 상급자에게 보고</span></p>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}>
            <div className={classes.ruleTitle}>스티커 미부착</div>
            <div className={classes.ruleContent}>

              <div className={classes.imageContainer}>
                <img src={noAttachedImage} alt="no_attached_image" className={classes.guideImage} onClick={() => handleImageClick(noAttachedImage)} />
                <div>예시 사진</div>
              </div>
              <ul>
                <p>1. <span className={classes.warningFont}>적발된 인원</span>을 <span className={classes.highlight}>대기열에서 분리</span></p>
                <p>2. <span className={classes.highlight}>미부착 사유</span>가 정당한지 판단</p>
                <p>3. <span className={classes.highlight}>이전 기록</span>을 조회 후 <span className={classes.warningFont}>스티커를 재부착</span></p>
                <p>4. <span className={classes.warningFont}>문제가 있다면</span> <span className={classes.warningFont}>상급자에게 보고</span></p>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}  >
            <div className={classes.ruleTitle}>휴대폰 변경</div>
            <div className={classes.ruleContent}>
              <div className={classes.imageContainer}>
                <img src={changeImage} alt="change_image" className={classes.guideImage} onClick={() => handleImageClick(changeImage)} />
                <div>예시 사진</div>
              </div>
              <ul>
                <p>1. <span className={classes.warningFont}>적발된 인원</span>을 <span className={classes.highlight}>대기열에서 분리</span></p>
                <p>2. <span className={classes.highlight}>휴대폰 변경 사유</span>가 정당한지 판단</p>
                <p>3. <span className={classes.warningFont}>보안 관리자에게 연락</span>하여 상황을 설명</p>
                <p>4. <span className={classes.highlight}>보안 관리자가 도착할 때까지 대기</span></p>
              </ul>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className={`${classes.imageModal} ${isModalOpen ? classes.imageModalOpen : ''}`} onClick={handleCloseModal}>
            <div className={classes.imageModalContentContainer}>
              <span className={classes.imageModalClose} onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
              <img className={classes.imageModalContent} src={modalImage} alt="modal_image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main
  