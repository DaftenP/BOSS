import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Modal from 'react-modal';
import classes from './Statistics.module.css';
import { format, startOfWeek, startOfMonth, startOfYear, isValid, parseISO } from 'date-fns';

function TotalStatistics({ loglist }) {
  const [selectedTotalXOption, setSelectedTotalXOption] = useState('day');
  const [selectedTotalYOption, setSelectedTotalYOption] = useState('fail');
  const [selectedTotalPopOption, setSelectedTotalPopOption] = useState('gate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotalDate, setSelectedTotalDate] = useState('');

  useEffect(() => {
    setDefaultTotalDate();
    if (selectedTotalPopOption === 'gate') {
      setSelectedItems([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 모든 기기 기본 선택
    } else if (selectedTotalPopOption === 'department') {
      setSelectedItems(["OO엔진 개발 및 설계", "OO기술 연구소", "OO제품 디자인팀", "OO마케팅", "OO인사팀"]); // 모든 부서 기본 선택
    }
  }, [selectedTotalXOption, selectedTotalPopOption]);

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

  const handleTotalXOption = (event) => {
    setSelectedTotalXOption(event.target.value);
  };

  const handleTotalYOption = (event) => {
    setSelectedTotalYOption(event.target.value);
  };

  const handleTotalPopOption = (event) => {
    setSelectedTotalPopOption(event.target.value);
    setSelectedItems([]);
  };

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
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    : ["OO엔진 개발 및 설계", "OO기술 연구소", "OO제품 디자인팀", "OO마케팅", "OO인사팀"];

  const generateTotalHourlyLabels = () => {
    const labels = [];
    for (let hour = 9; hour < 21; hour++) {
      labels.push(`${hour}~${hour + 1}시`);
    }
    return labels;
  };

  const generateTotalMonthlyLabels = () => {
    const labels = [];
    for (let month = 1; month <= 12; month++) {
      labels.push(`${String(month).padStart(2, '0')}월`);
    }
    return labels;
  };

  const generateTotalWeeklyLabels = (startDate) => {
    const labels = [];
    const start = parseISO(startDate);
    if (!isValid(start)) return []; // 유효하지 않은 날짜인 경우 빈 배열 반환
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      labels.push(format(date, 'yyyy-MM-dd'));
    }
    return labels;
  };

  const generateTotalDayLabels = (yearMonth) => {
    const [year, month] = yearMonth.split('-');
    const labels = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      labels.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    return labels;
  };

  const filterDataForTotal = (loglist, filterBy) => {
    const filteredLogs = loglist.filter(log => {
      if (selectedTotalYOption === 'fail' && log.issue !== 'F') return false;
      if (selectedTotalYOption === 'pass' && log.issue !== 'P') return false;
  
      if (selectedTotalPopOption === 'gate' && log.gate !== filterBy) return false;
      if (selectedTotalPopOption === 'department' && log.department !== filterBy) return false;
  
      if (selectedTotalXOption === 'day') {
        return log.date === selectedTotalDate;
      } else if (selectedTotalXOption === 'week') {
        const selectedDateObj = parseISO(selectedTotalDate);
        const logDateObj = parseISO(log.date);
        if (!isValid(selectedDateObj) || !isValid(logDateObj)) return false; // 유효하지 않은 날짜인 경우 false 반환
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedTotalXOption === 'month') {
        return log.date.startsWith(selectedTotalDate);
      } else if (selectedTotalXOption === 'year') {
        return log.date.startsWith(selectedTotalDate.split('-')[0]);
      }
  
      return false;
    });
  
    const groupedData = {};
    let sortedLabels = [];
  
    if (selectedTotalXOption === 'day') {
      sortedLabels = generateTotalHourlyLabels();
    } else if (selectedTotalXOption === 'week') {
      sortedLabels = generateTotalWeeklyLabels(selectedTotalDate);
    } else if (selectedTotalXOption === 'month') {
      sortedLabels = generateTotalDayLabels(selectedTotalDate);
    } else if (selectedTotalXOption === 'year') {
      sortedLabels = generateTotalMonthlyLabels();
    }
  
    sortedLabels.forEach(label => {
      groupedData[label] = 0;
    });
  
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
  
      if (groupedData[key] !== undefined) {
        groupedData[key]++;
      }
    });
  
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

  return (
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
              <input
                className={classes.inputText}
                type="date"
                value={selectedTotalDate}
                onChange={handleTotalDateChange}
              />
            )}
            {selectedTotalXOption === 'month' && (
              <input
                className={classes.inputText}
                type="month"
                value={selectedTotalDate}
                onChange={handleTotalDateChange}
              />
            )}
            {selectedTotalXOption === 'year' && (
              <input
                className={classes.inputText}
                type="number"
                value={selectedTotalDate.split('-')[0]}
                onChange={(e) => handleTotalDateChange({ target: { value: `${e.target.value}-01` } })}
                placeholder="년도 입력"
              />
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
  );
}

export default TotalStatistics;
