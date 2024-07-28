import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Main.module.css';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ruleImage from '../../assets/Main/Rule_background_image.png'

function Main() {
  const logs = useSelector((state) => state.loglist.data)

  const today = new Date('2024-07-20')
  const todayString = today.toISOString().split('T')[0];
  const firstFilteredLogs = logs.filter(log => log['날짜'] === todayString)

  const secondFilteredLogs = firstFilteredLogs.filter(log => log['보안 이슈'] === 'F'
  ).map(log => ({
    gate: log['기기'],
    time: log['시간'],
    name: log['이름'],
    department: log['부서'],
    position: log['직책'],
    entering: log['출/퇴'],
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
    cutout: '70%',
    scales: {
    }
  };
  
  // 20개의 데이터만 보여주는 코드
  const sliceLogs = secondFilteredLogs.slice(0, 20)

  return (
    <div className={classes.mainContainer}>
      <div className={classes.todayIssueContainer}>
        <div>
          <div className={classes.chartTitle}>
            금일 이슈 현황
            <div className={classes.chartContainer}>
              <Line data={chartData} options={options} />
            </div>
          </div>
          <div className={classes.chartTitle}>
            금일 이슈 인원 비율
          </div>
            <div className={classes.chartContainer}>
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
        <div className={classes.totalRuleContainer}>
          <div className={classes.relativeBoxContainer}>
            <div className={classes.issueTitleBox}>사고 시 조치 사항</div>
          </div>
          <div className={classes.firstRuleContainer}>
            <div className={classes.ruleTitle}>스티커 훼손</div>
            <div className={classes.ruleContent}>
              <ul>
                <li>1. 스티커 훼손 절차 1</li>
                <li>2. 스티커 훼손 절차 2</li>
                <li>3. 스티커 훼손 절차 3</li>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}>
            <div className={classes.ruleTitle}>스티커 미부착</div>
            <div className={classes.ruleContent}>
              <ul>
                <li>1. 스티커 없음 절차 1</li>
                <li>2. 스티커 없음 절차 2</li>
                <li>3. 스티커 없음 절차 3</li>
              </ul>
            </div>
          </div>
          <div className={classes.ruleContainer}  >
            <div className={classes.ruleTitle}>휴대폰 변경</div>
            <div className={classes.ruleContent}>
              <ul>
                <li>1. 휴대폰 변경 절차 1</li>
                <li>2. 휴대폰 변경 절차 2</li>
                <li>3. 휴대폰 변경 절차 3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main
  