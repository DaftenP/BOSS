import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Statistics.module.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { parse, format, startOfWeek, startOfMonth, startOfYear, getDaysInMonth, isLeapYear } from 'date-fns';
import Modal from 'react-modal';

function Statistics() {
  const loglist = useSelector(state => state.loglist.data);

  // 날짜별 통계 State
  const [selectedDateXOption, setSelectedDateXOption] = useState('day')
  const [selectedDateYOption, setSelectedDateYOption] = useState('fail')
  const [selectedDate, setSelectedDate] = useState('')

  // 통합 통계 State
  const [selectedTotalXOption, setSelectedTotalXOption] = useState('day')
  const [selectedTotalYOption, setSelectedTotalYOption] = useState('fail')
  const [selectedTotalPopOption, setSelectedTotalPopOption] = useState('gate')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotalDate, setSelectedTotalDate] = useState('');
  
  // 통계 요약 State
  const [selectedSummaryOption, setSelectedSummaryOption] = useState('day')
  const [selectedSummaryDate, setSelectedSummaryDate] = useState('');
  const [statistics, setStatistics] = useState({ users: 0, issues: 0, logs: 0, averageIssues: 0 });

  // 날짜별 통계 handle
  const handleDateXOption = (event) => {
    setSelectedDateXOption(event.target.value)
    setSelectedDate('');
  }
  const handleDateYOption = (event) => {
    setSelectedDateYOption(event.target.value)
  }
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // 통합 통계 handle
  const handleTotalXOption = (event) => {
    setSelectedTotalXOption(event.target.value)
  }
  const handleTotalYOption = (event) => {
    setSelectedTotalYOption(event.target.value)
  }
  const handleTotalPopOption = (event) => {
    setSelectedTotalPopOption(event.target.value)
    setSelectedItems([]); // 선택 항목 초기화
  }
  const handleTotalDateChange = (event) => {
    setSelectedTotalDate(event.target.value);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleItemClick = (item) => {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };
  const handleConfirm = () => {
    closeModal();
  };

  const items = selectedTotalPopOption === 'gate'
  // 기기 리스트
  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  //부서 리스트
  : ["OO엔진 개발 및 설계", "OO기술 연구소", "OO제품 디자인팀", "OO마케팅", "OO인사팀"];


  // 통계 요약 handle
  const handleSummaryOption = (event) => {
    setSelectedSummaryOption(event.target.value)
  }
  const handleSummaryDateChange = (event) => {
    setSelectedSummaryDate(event.target.value);
  };

  // 첫 번째 그래프 그리는 로직
  useEffect(() => {
    setDefaultDate();
  }, [selectedDateXOption]);

  const setDefaultDate = () => {
    const today = new Date();
    if (selectedDateXOption === 'day') {
      setSelectedDate(format(today, 'yyyy-MM-dd'));
    } else if (selectedDateXOption === 'week') {
      setSelectedDate(format(startOfWeek(today), 'yyyy-MM-dd'));
    } else if (selectedDateXOption === 'month') {
      setSelectedDate(format(startOfMonth(today), 'yyyy-MM'));
    } else if (selectedDateXOption === 'year') {
      setSelectedDate(format(startOfYear(today), 'yyyy'));
    }
  };

  const generateHourlyLabels = () => {
    const labels = [];
    for (let hour = 9; hour < 21; hour++) {
      labels.push(`${hour}~${hour + 1}시`);
    }
    return labels;
  };

  const filterData = () => {
    const filteredLogs = loglist.filter(log => {
      // Y축 옵션에 따른 필터링
      if (selectedDateYOption === 'fail' && log.issue !== 'F') return false;
      if (selectedDateYOption === 'pass' && log.issue !== 'P') return false;

      // 날짜에 따른 필터링
      if (selectedDateXOption === 'day') {
        return log.date === selectedDate;
      } else if (selectedDateXOption === 'week') {
        const selectedDateObj = new Date(selectedDate);
        const logDateObj = new Date(log.date);
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedDateXOption === 'month') {
        return log.date.startsWith(selectedDate);
      } else if (selectedDateXOption === 'year') {
        return log.date.startsWith(selectedDate);
      }

      return false;
    });

    // 그룹화 로직
    const groupedData = {};

    filteredLogs.forEach(log => {
      let key;
      if (selectedDateXOption === 'day') {
        const hour = parse(log.time, 'HH:mm:ss', new Date()).getHours();
        key = `${hour}~${hour + 1}시`;
      } else if (selectedDateXOption === 'week' || selectedDateXOption === 'month') {
        key = log.date;
      } else if (selectedDateXOption === 'year') {
        key = log.date.split('-')[1] + '월';
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }

      groupedData[key]++;
    });

    let sortedLabels;

    if (selectedDateXOption === 'day') {
      sortedLabels = generateHourlyLabels();
      sortedLabels.forEach(label => {
        if (!groupedData[label]) {
          groupedData[label] = 0;
        }
      });
    } else {
      sortedLabels = Object.keys(groupedData).sort((a, b) => {
        if (selectedDateXOption === 'week' || selectedDateXOption === 'month') {
          return new Date(a) - new Date(b);
        } else if (selectedDateXOption === 'year') {
          return parseInt(a) - parseInt(b);
        }
        return 0;
      });
    }

    // 그래프 데이터 형식으로 변환
    return {
      labels: sortedLabels,
      datasets: [{
        label: selectedDateYOption === 'fail' ? '적발 횟수' : '통과 횟수',
        data: sortedLabels.map(label => groupedData[label]),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  const graphData = filterData();

  // 두 번째 그래프 그리는 로직
  useEffect(() => {
    setDefaultTotalDate();
  }, [selectedTotalXOption]);

  const generateTotalHourlyLabels = () => {
    const labels = [];
    for (let hour = 9; hour < 21; hour++) {
      labels.push(`${hour}~${hour + 1}시`);
    }
    return labels;
  };

  const setDefaultTotalDate = () => {
    const today = new Date();
    if (selectedTotalXOption === 'day') {
      setSelectedTotalDate(format(today, 'yyyy-MM-dd'));
    } else if (selectedTotalXOption === 'week') {
      setSelectedTotalDate(format(startOfWeek(today), 'yyyy-MM-dd'));
    } else if (selectedTotalXOption === 'month') {
      setSelectedTotalDate(format(startOfMonth(today), 'yyyy-MM'));
    } else if (selectedTotalXOption === 'year') {
      setSelectedTotalDate(format(startOfYear(today), 'yyyy'));
    }
  };

  const filterDataForTotal = (loglist, filterBy) => {
    const filteredLogs = loglist.filter(log => {
      // Y축 옵션에 따른 필터링
      if (selectedTotalYOption === 'fail' && log.issue !== 'F') return false;
      if (selectedTotalYOption === 'pass' && log.issue !== 'P') return false;

      // 모집단 필터링
      if (selectedTotalPopOption === 'gate' && log.gate !== filterBy) return false;
      if (selectedTotalPopOption === 'department' && log.department !== filterBy) return false;

      // 날짜에 따른 필터링
      if (selectedTotalXOption === 'day') {
        return log.date === selectedTotalDate;
      } else if (selectedTotalXOption === 'week') {
        const selectedDateObj = new Date(selectedTotalDate);
        const logDateObj = new Date(log.date);
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedTotalXOption === 'month') {
        return log.date.startsWith(selectedTotalDate);
      } else if (selectedTotalXOption === 'year') {
        return log.date.startsWith(selectedTotalDate);
      }

      return false;
    });

    // 그룹화 로직
    const groupedData = {};

    filteredLogs.forEach(log => {
      let key;
      if (selectedTotalXOption === 'day') {
        const hour = parseInt(log.time.split(':')[0], 10);
        key = `${hour}~${hour + 1}시`;
      } else if (selectedTotalXOption === 'week' || selectedTotalXOption === 'month') {
        key = log.date;
      } else if (selectedTotalXOption === 'year') {
        key = log.date.split('-')[1] + '월';
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }

      groupedData[key]++;
    });

    let sortedLabels;

    if (selectedTotalXOption === 'day') {
      sortedLabels = generateTotalHourlyLabels();
    } else if (selectedTotalXOption === 'week') {
      const startDate = new Date(selectedTotalDate);
      sortedLabels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return format(date, 'yyyy-MM-dd');
      });
    } else if (selectedTotalXOption === 'month') {
      const [year, month] = selectedTotalDate.split('-');
      const daysInMonth = new Date(year, month, 0).getDate();
      sortedLabels = Array.from({ length: daysInMonth }, (_, i) => `${selectedTotalDate}-${String(i + 1).padStart(2, '0')}`);
    } else if (selectedTotalXOption === 'year') {
      sortedLabels = Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, '0')}월`);
    }

    sortedLabels.forEach(label => {
      if (!groupedData[label]) {
        groupedData[label] = 0;
      }
    });

    // 그래프 데이터 형식으로 변환
    return {
      labels: sortedLabels,
      datasets: [{
        label: selectedTotalYOption === 'fail' ? '적발 횟수' : '통과 횟수',
        data: sortedLabels.map(label => groupedData[label]),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  // 세 번째 통계 내는 로직
  useEffect(() => {
    setDefaultSummaryDate();
  }, [selectedSummaryOption]);

  useEffect(() => {
    calculateStatistics();
  }, [selectedSummaryDate, selectedSummaryOption, loglist]);

  const setDefaultSummaryDate = () => {
    const today = new Date();
    if (selectedSummaryOption === 'day') {
      setSelectedSummaryDate(format(today, 'yyyy-MM-dd'));
    } else if (selectedSummaryOption === 'week') {
      setSelectedSummaryDate(format(startOfWeek(today), 'yyyy-MM-dd'));
    } else if (selectedSummaryOption === 'month') {
      setSelectedSummaryDate(format(startOfMonth(today), 'yyyy-MM'));
    } else if (selectedSummaryOption === 'year') {
      setSelectedSummaryDate(format(startOfYear(today), 'yyyy'));
    }
  };

  const calculateStatistics = () => {
    let filteredLogs = loglist.filter(log => {
      if (selectedSummaryOption === 'day') {
        return log.date === selectedSummaryDate;
      } else if (selectedSummaryOption === 'week') {
        const selectedDateObj = new Date(selectedSummaryDate);
        const logDateObj = new Date(log.date);
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedSummaryOption === 'month') {
        return log.date.startsWith(selectedSummaryDate);
      } else if (selectedSummaryOption === 'year') {
        return log.date.startsWith(selectedSummaryDate);
      }
      return false;
    });
  
    const uniqueUsers = new Set(filteredLogs.map(log => log.id)).size;
    const issues = filteredLogs.filter(log => log.issue === 'F').length;
    const logs = filteredLogs.length;
    const daysInPeriod = selectedSummaryOption === 'day'
      ? 1
      : selectedSummaryOption === 'week'
      ? 7
      : selectedSummaryOption === 'month'
      ? getDaysInMonth(new Date(selectedSummaryDate))
      : selectedSummaryOption === 'year'
      ? (isLeapYear(new Date(selectedSummaryDate)) ? 366 : 365)
      : 1;
    const averageIssues = issues / daysInPeriod;
  
    setStatistics({ users: uniqueUsers, issues, logs, averageIssues });
  };

  return (
    <div className={classes.statisticsContainer}>
      <div className={classes.dateStatisticsContainer}>
        <div className={classes.relativeBoxContainer}>
          <div className={classes.statisticsTitleBox}>날짜별 통계</div>
        </div>
        <div className={classes.statisticsContent}>
          <div className={classes.dataSelectContainer}>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - X축</div>
              <div className={classes.dataSelectBox}>
                <label>
                  <input
                    type="radio"
                    value="day"
                    checked={selectedDateXOption === 'day'}
                    onChange={handleDateXOption}
                  />
                  일
                </label>
                <label>
                  <input
                    type="radio"
                    value="week"
                    checked={selectedDateXOption === 'week'}
                    onChange={handleDateXOption}
                  />
                  주
                </label>
                <label>
                <input
                    type="radio"
                    value="month"
                    checked={selectedDateXOption === 'month'}
                    onChange={handleDateXOption}
                  />
                  월
                </label>
                <label>
                <input
                    type="radio"
                    value="year"
                    checked={selectedDateXOption === 'year'}
                    onChange={handleDateXOption}
                  />
                  년
                </label>
              </div>
              {(selectedDateXOption === 'day' || selectedDateXOption === 'week') && (
                <input type="date" value={selectedDate} onChange={handleDateChange} />
              )}
              {selectedDateXOption === 'month' && (
                <input type="month" value={selectedDate} onChange={handleDateChange} />
              )}
              {selectedDateXOption === 'year' && (
                <input type="number" value={selectedDate} onChange={handleDateChange} placeholder="년도 입력" />
              )}
            </div>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - Y축</div>
              <div className={classes.dataSelectBox}>
                <label>
                <input
                    type="radio"
                    value="fail"
                    checked={selectedDateYOption === 'fail'}
                    onChange={handleDateYOption}
                  />
                  적발 횟수
                </label>
                <label>
                <input
                    type="radio"
                    value="pass"
                    checked={selectedDateYOption === 'pass'}
                    onChange={handleDateYOption}
                  />
                  통과 횟수
                </label>
              </div>
            </div>
          </div>
          <div>
            {graphData && (
              <Line data={graphData} options={{ /* 그래프 옵션 설정 */ }} />
            )}
          </div>
        </div>
      </div>
      <div className={classes.dateStatisticsContainer}>
        <div className={classes.relativeBoxContainer}>
          <div className={classes.statisticsTitleBox}>통합 통계</div>
        </div>
        <div className={classes.statisticsContent}>
          <div className={classes.dataSelectContainer}>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - X축</div>
              <div className={classes.dataSelectBox}>
                <label>
                  <input
                    type="radio"
                    value="day"
                    checked={selectedTotalXOption === 'day'}
                    onChange={handleTotalXOption}
                  />
                  일
                </label>
                <label>
                  <input
                    type="radio"
                    value="week"
                    checked={selectedTotalXOption === 'week'}
                    onChange={handleTotalXOption}
                  />
                  주
                </label>
                <label>
                <input
                    type="radio"
                    value="month"
                    checked={selectedTotalXOption === 'month'}
                    onChange={handleTotalXOption}
                  />
                  월
                </label>
                <label>
                <input
                    type="radio"
                    value="year"
                    checked={selectedTotalXOption === 'year'}
                    onChange={handleTotalXOption}
                  />
                  년
                </label>
              </div>
              {(selectedTotalXOption === 'day' || selectedTotalXOption === 'week') && (
                <input type="date" value={selectedTotalDate} onChange={handleTotalDateChange} />
              )}
              {selectedTotalXOption === 'month' && (
                <input type="month" value={selectedTotalDate} onChange={handleTotalDateChange} />
              )}
              {selectedTotalXOption === 'year' && (
                <input type="number" value={selectedTotalDate} onChange={handleTotalDateChange} placeholder="년도 입력" />
              )}
            </div>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - Y축</div>
              <div className={classes.dataSelectBox}>
                <label>
                <input
                    type="radio"
                    value="fail"
                    checked={selectedTotalYOption === 'fail'}
                    onChange={handleTotalYOption}
                  />
                  적발 횟수
                </label>
                <label>
                <input
                    type="radio"
                    value="pass"
                    checked={selectedTotalYOption === 'pass'}
                    onChange={handleTotalYOption}
                  />
                  통과 횟수
                </label>
              </div>
            </div>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>모집단 선택 옵션</div>
              <div className={classes.dataSelectBox}>
                <label>
                  <input
                    type="radio"
                    value="gate"
                    checked={selectedTotalPopOption === 'gate'}
                    onChange={handleTotalPopOption}
                  />
                  기기별 보기
                </label>
                <label>
                  <input
                    type="radio"
                    value="department"
                    checked={selectedTotalPopOption === 'department'}
                    onChange={handleTotalPopOption}
                  />
                  부서별 보기
                </label>
                <button onClick={openModal}>
                  {selectedTotalPopOption === 'gate' ? '기기 선택하기' : '부서 선택하기'}
                </button>
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  contentLabel="Select Items Modal"
                >
                  <h2>{selectedTotalPopOption === 'gate' ? '기기 선택하기' : '부서 선택하기'}</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {items.map(item => (
                      <button
                        key={item}
                        onClick={() => handleItemClick(item)}
                        style={{
                          margin: '5px',
                          backgroundColor: selectedItems.includes(item) ? 'lightblue' : 'white'
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleConfirm}>확인</button>
                  <button onClick={closeModal}>취소하기</button>
                </Modal>
              </div>
            </div>
          </div>
          <div className={classes.graphContainer}>
            {selectedItems.map(item => {
              const data = filterDataForTotal(loglist, item);
              return (
                <div key={item}>
                  <h3>{item}</h3>
                  <Line data={data} options={{ /* 그래프 옵션 설정 */ }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={classes.dateStatisticsContainer}>
        <div className={classes.relativeBoxContainer}>
          <div className={classes.statisticsTitleBox}>통계 요약</div>
        </div>
        <div className={classes.statisticsContent}>
          <div className={classes.dataSelectContainer}>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션</div>
              <div className={classes.dataSelectBox}>
                <label>
                  <input
                    type="radio"
                    value="day"
                    checked={selectedSummaryOption === 'day'}
                    onChange={handleSummaryOption}
                  />
                  일
                </label>
                <label>
                  <input
                    type="radio"
                    value="week"
                    checked={selectedSummaryOption === 'week'}
                    onChange={handleSummaryOption}
                  />
                  주
                </label>
                <label>
                <input
                    type="radio"
                    value="month"
                    checked={selectedSummaryOption === 'month'}
                    onChange={handleSummaryOption}
                  />
                  월
                </label>
                <label>
                <input
                    type="radio"
                    value="year"
                    checked={selectedSummaryOption === 'year'}
                    onChange={handleSummaryOption}
                  />
                  년
                </label>
              </div>
            </div>
            {(selectedSummaryOption === 'day' || selectedSummaryOption === 'week') && (
              <input type="date" value={selectedSummaryDate} onChange={handleSummaryDateChange} />
            )}
            {selectedSummaryOption === 'month' && (
              <input type="month" value={selectedSummaryDate} onChange={handleSummaryDateChange} />
            )}
            {selectedSummaryOption === 'year' && (
              <input type="number" value={selectedSummaryDate} onChange={handleSummaryDateChange} placeholder="년도 입력" />
            )}
          </div>
          <div>
            <table className={classes.statisticsTable}>
              <thead>
                <tr>
                  <th>이용자 수</th>
                  <th>적발 횟수</th>
                  <th>로그 수</th>
                  <th>평균 적발률</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{statistics.users}</td>
                  <td>{statistics.issues}</td>
                  <td>{statistics.logs}</td>
                  <td>{statistics.averageIssues.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
