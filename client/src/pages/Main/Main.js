import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchFilteredLogs } from '../../store/loglist';
import lightClasses from './Main.module.css';
import darkClasses from './MainDark.module.css';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ruleImage from '../../assets/Main/Rule_background_image.png';
import damageImage from '../../assets/Main/Damage_state.png';
import noAttachedImage from '../../assets/Main/No_attached_state.png';
import changeImage from '../../assets/Main/Change_state.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCogs, faExclamationTriangle, faPercentage } from '@fortawesome/free-solid-svg-icons';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getAccessToken } from '../../utils/token'
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

function Main() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
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

  const logs = useSelector((state) => state.loglist.data);

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDateString = getTodayDateString()

  useEffect(() => {
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
    };
    dispatch(fetchFilteredLogs(transformedFilters));
  }, [dispatch]);

  useEffect(() => {
    const setupSSEConnection = () => {
      const accessToken = getAccessToken(); // 로컬 스토리지에서 JWT 토큰을 가져옴

      if (!accessToken) {
        return;
      }

      // EventSourcePolyfill을 사용하여 JWT 토큰을 헤더에 포함
      const eventSource = new EventSourcePolyfill(
        `${process.env.REACT_APP_API_URL}/api/connect`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // JWT 토큰 추가
          },
        }
      );

      // 연결이 성공적으로 열렸을 때 호출
      // eventSource.onopen = () => {
      //   console.log('SSE connection opened successfully.');
      // };

      // 서버로부터 메시지가 수신될 때마다 호출
      eventSource.onmessage = (event) => {
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
        };

        // 로그 필터링 요청을 보냄
        dispatch(fetchFilteredLogs(transformedFilters));
      };

      // SSE 연결 오류 처리
      eventSource.onerror = (error) => {
        console.error('SSE error occurred:', error); // 오류 발생 시 로그 출력
        eventSource.close();
      };

      return eventSource;
    };

    // 첫 연결 설정
    let eventSource = setupSSEConnection();

    // 30초마다 SSE 연결 재설정
    const intervalId = setInterval(() => {
      if (eventSource) {
        eventSource.close(); // 기존 연결 닫기
      }
      eventSource = setupSSEConnection(); // 새로운 연결 설정
    }, 30000);

    // 컴포넌트가 언마운트될 때 연결 종료 및 타이머 해제
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(intervalId);
    };
  }, [dispatch]);

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const firstFilteredLogs = logs.filter((log) => log.time.split('T')[0] === todayString);

  const secondFilteredLogs = firstFilteredLogs
    .filter((log) => log.issue === 1)
    .map((log) => ({
      gateNumber: log.gateNumber,
      date: log.time.split('T')[0],
      time: log.time.split('T')[1],
      name: log.member.name,
      department: log.member.department.departmentName,
      position: log.member.position.positionName,
      entering: log.entering,
    }));

  // 시간 단위로 그룹화 (9시부터 21시까지)
  const startHour = 6;
  const endHour = 21;
  const groupedData = new Array(endHour - startHour + 1).fill(0);

  secondFilteredLogs.forEach((log) => {
    const hour = new Date(`${todayString}T${log.time}`).getHours();
    if (hour >= startHour && hour <= endHour) {
      groupedData[hour - startHour]++;
    }
  });

  // 차트 데이터를 준비
  const labels = [];
  for (let i = startHour; i <= endHour; i++) {
    labels.push(`${i} ~ ${i + 1} ${t('hour')}`);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: t('Detected People'),
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
          callback: function (value) {
            return value + t('people');
          },
          color: '#a8a8a8',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: isDarkMode ? '#bbb' : '#bbb',
        },
      },
      x: {
        ticks: {
          color: '#a8a8a8',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: isDarkMode ? '#bbb' : '#bbb',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#a8a8a8',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  const normalUsersCount = firstFilteredLogs.length - secondFilteredLogs.length;
  const badUsersCount = secondFilteredLogs.length;
  const errorPercent = secondFilteredLogs.length === 0 ? 0 : ((secondFilteredLogs.length / firstFilteredLogs.length) * 100).toFixed(1);

  // 도넛 차트를 위한 데이터 준비
  const doughnutData = {
    labels: [t('Normal Records'), t('Issues')],
    datasets: [
      {
        data: [normalUsersCount, badUsersCount],
        backgroundColor: ['rgba(176, 210, 250, 0.5)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['#7990FD', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  Chart.register(...registerables);
  Chart.register(ChartDataLabels);

  const optionsDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    scales: {},
    plugins: {
      legend: {
        labels: {
          color: '#a8a8a8',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      datalabels: {
        color: isDarkMode ? ('#fff') : ('#444444'),
        font: {
          size: 14,
          weight: 'bold',
        },
        display: function(context) {
          // 데이터 값이 0이면 레이블을 표시하지 않음
          return context.dataset.data[context.dataIndex] > 0;
        },
        formatter: function(value, context) {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: ${value}`;
        },    
      },
    },
  };

  const sliceLogs = secondFilteredLogs.reverse().slice(0, 14);

  return (
    <div>
      <div className={classes.mainContainer}>
        <div className={classes.todayIssueContainer}>
          <div className={classes.todayTitle}>{`${parseInt(todayDateString.split('-')[1], 10)} / ${parseInt(todayDateString.split('-')[2], 10)}`} {t('Issues Summary', "이슈 요약")}</div>
          <div className={classes.statisticsContainer}>
            <div className={`${classes.card} ${classes.topCard}`}>
              <FontAwesomeIcon icon={faCogs} className={classes.cardIcon} />
              <div className={classes.cardContent}>
                <div className={classes.cardTitle}>{t('Total Inspections Today')}</div>
                <div className={classes.cardValue}>{firstFilteredLogs.length} {t('times')}</div>
              </div>
            </div>
            <div className={`${classes.card} ${classes.bottomRightCard}`}>
              <FontAwesomeIcon icon={faExclamationTriangle} className={classes.cardIcon} />
              <div className={classes.cardContent}>
                <div className={classes.cardTitle}>{t('Issues Detected')}</div>
                <div className={classes.cardValue}>{secondFilteredLogs.length} {t('times')}</div>
              </div>
            </div>
            <div className={`${classes.card} ${classes.bottomLeftCard}`}>
              <FontAwesomeIcon icon={faPercentage} className={classes.cardIcon} />
              <div className={classes.cardContent}>
                <div className={classes.cardTitle}>{t('Issue Ratio')}</div>
                <div className={classes.cardValue}>{errorPercent} %</div>
              </div>
            </div>
          </div>
          <div className={classes.twoGraphContainer}>
            <div>
              <div className={classes.todayTitle} style={{ marginRight: '20px' }}>{`${parseInt(todayDateString.split('-')[1], 10)} / ${parseInt(todayDateString.split('-')[2], 10)}`} {t('Issue Ratio')}</div>
              <div className={classes.chartTitle}>
                <div className={classes.doughnutChartContainer}>
                  <Doughnut data={doughnutData} options={optionsDoughnut} />
                </div>
              </div>
            </div>
            <div>
              <div className={classes.todayTitle}>{`${parseInt(todayDateString.split('-')[1], 10)} / ${parseInt(todayDateString.split('-')[2], 10)}`} {t('Issue Overview')}</div>
              <div className={classes.lineChartContainer}>
                  <Line data={chartData} options={{ ...options, responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.issueLogContainer}>
          <div className={classes.totalIssueContainer}>
            <div className={classes.relativeBoxContainer}>
              <div className={classes.issueTitleBox}>{t('Real-Time Issue Detection')}</div>
            </div>
            <div className={classes.tableContainer}>
              <table className={classes.logTable}>
                <thead>
                  <tr>
                    <th>{t('Device')}</th>
                    <th>{t('Time')}</th>
                    <th>{t('Name')}</th>
                    <th>{t('Department')}</th>
                    <th>{t('Position')}</th>
                    <th>{t('Entry/Exit')}</th>
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
                      <td>{log.entering === 0 ? (<div className={classes.entryText}>{t('Entry', '출입')}</div>) : (<div className={classes.exitText}>{t('Exit', '퇴장')}</div>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.totalRuleContainer} style={{ backgroundImage: `url(${ruleImage})` }}>
        <div className={classes.relativeBoxContainer}>
          <div className={classes.ruleTitleBox}>{t('Issue Handling')}</div>
        </div>
        <div className={classes.threeRuleContainer}>
          <div className={classes.ruleContainer}>
            <div className={classes.ruleTitle}>{t('Sticker Damage')}</div>
            <div className={classes.ruleContent}>
              <div className={classes.imageContainer}>
                <img src={damageImage} alt={t('damage_image')} className={classes.guideImage} onClick={() => handleImageClick(damageImage)} />
                <div>{t('Example Photo')}</div>
              </div>
              <ul>
                <p>1. <span className={classes.warningFont}>{t('Separate the detected person')}</span> {t('from the queue')}</p>
                <p>2. {t('Determine if the reason for the damage is valid')}</p>
                <p>3. {t('Remove the damaged sticker')}, {t('Reattach a new sticker')}</p>
                <p>4. <span className={classes.warningFont}>{t('Report to a superior if there is an issue')}</span></p>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}>
            <div className={classes.ruleTitle}>{t('No Sticker Attached')}</div>
            <div className={classes.ruleContent}>
              <div className={classes.imageContainer}>
                <img src={noAttachedImage} alt={t('no_attached_image')} className={classes.guideImage} onClick={() => handleImageClick(noAttachedImage)} />
                <div>{t('Example Photo')}</div>
              </div>
              <ul>
                <p>1. <span className={classes.warningFont}>{t('Separate the detected person')}</span> {t('from the queue')}</p>
                <p>2. {t('Determine if the reason for no sticker is valid')}</p>
                <p>3. {t('Check previous records and reattach the sticker')}</p>
                <p>4. <span className={classes.warningFont}>{t('Report to a superior if there is an issue')}</span></p>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}>
            <div className={classes.ruleTitle}>{t('Phone Change')}</div>
            <div className={classes.ruleContent}>
              <div className={classes.imageContainer}>
                <img src={changeImage} alt={t('change_image')} className={classes.guideImage} onClick={() => handleImageClick(changeImage)} />
                <div>{t('Example Photo')}</div>
              </div>
              <ul>
                <p>1. <span className={classes.warningFont}>{t('Separate the detected person')}</span> {t('from the queue')}</p>
                <p>2. {t('Determine if the reason for phone change is valid')}</p>
                <p>3. <span className={classes.warningFont}>{t('Contact the security manager')}</span> {t('and explain the situation')}</p>
                <p>4. {t('Wait for the security manager to arrive')}</p>
              </ul>
            </div>
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
  );
}

export default Main;
