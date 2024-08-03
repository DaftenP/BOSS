import React from 'react';
import { useSelector } from 'react-redux';
import classes from './Main.module.css';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ruleImage from '../../assets/Main/Rule_background_image.png'
import normalImage from '../../assets/Main/Normal_state.png'
import damageImage from '../../assets/Main/Damage_state.png'
import noAttachedImage from '../../assets/Main/No_attached_state.png'
import changeImage from '../../assets/Main/Change_state.png'

function Main() {
  const logs = useSelector((state) => state.loglist.data)

  const today = new Date()
  const todayString = today.toISOString().split('T')[0];
  const firstFilteredLogs = logs.filter(log => log['date'] === todayString)

  const secondFilteredLogs = firstFilteredLogs.filter(log => log['issue'] === 'F'
  ).map(log => ({
    gate: log['gate'],
    date: log['time'].split('T')[0],
    time: log['time'].split('T')[1],
    name: log['name'],
    department: log['department'],
    position: log['position'],
    entering: log['entering'],
  }))

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
        borderColor: '#7990FD',
        backgroundColor: 'rgba(176, 210, 250, 0.5)',
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
          }
        }
      }
    }
  };

  const normalUsersCount = firstFilteredLogs.length - secondFilteredLogs.length;
  const badUsersCount = secondFilteredLogs.length;
  const errorPercent = (secondFilteredLogs.length / firstFilteredLogs.length * 100).toFixed(2)

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
    scales: {}
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
          <div>
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
                    <td>{log.gate}</td>
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
            <div className={classes.issueTitleBox}>사고 시 조치 사항</div>
          </div>
          <div className={classes.firstRuleContainer}>
            <div className={classes.ruleTitle}>스티커 훼손</div>
            <div className={classes.ruleContent}>
              <img src={damageImage} alt="damage_image" className={classes.guideImage} />
              <ul>
                <p>1. 적발된 인원을 대기열에서 분리</p>
                <p>2. 훼손 사유가 정당한지 판단</p>
                <p>3. 훼손된 스티커를 제거 후 새 스티커를 재부착</p>
                <p>4. 문제가 있다면 상급자에게 보고</p>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}>
            <div className={classes.ruleTitle}>스티커 미부착</div>
            <div className={classes.ruleContent}>
              <img src={noAttachedImage} alt="no_attached_image" className={classes.guideImage} />
              <ul>
                <p>1. 적발된 인원을 대기열에서 분리</p>
                <p>2. 미부착 사유가 정당한지 판단</p>
                <p>3. 이전 기록을 조회 후 스티커를 재부착</p>
                <p>4. 문제가 있다면 상급자에게 보고</p>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}  >
            <div className={classes.ruleTitle}>휴대폰 변경</div>
            <div className={classes.ruleContent}>
              <img src={changeImage} alt="change_image" className={classes.guideImage} />
              <ul>
                <p>1. 적발된 인원을 대기열에서 분리</p>
                <p>2. 휴대폰 변경 사유가 정당한지 판단</p>
                <p>3. 보안 관리자에게 연락하여 상황을 설명</p>
                <p>4. 보안 관리자가 도착할 때까지 대기</p>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main
  