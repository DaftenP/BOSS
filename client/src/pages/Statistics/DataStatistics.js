import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import classes from './Statistics.module.css';
import { format, startOfWeek, startOfMonth, startOfYear, isValid, parseISO } from 'date-fns';

function DateStatistics({ loglist }) {
  const [selectedDateXOption, setSelectedDateXOption] = useState('day');
  const [selectedDateYOption, setSelectedDateYOption] = useState('fail');
  const [selectedDate, setSelectedDate] = useState('');

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

  const handleDateXOption = (event) => {
    setSelectedDateXOption(event.target.value);
    setSelectedDate('');
  };

  const handleDateYOption = (event) => {
    setSelectedDateYOption(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const generateHourlyLabels = () => {
    const labels = [];
    for (let hour = 9; hour < 21; hour++) {
      labels.push(`${hour}~${hour + 1}시`);
    }
    return labels;
  };

  const generateMonthlyLabels = () => {
    const labels = [];
    for (let month = 1; month <= 12; month++) {
      labels.push(`${String(month).padStart(2, '0')}월`);
    }
    return labels;
  };

  const generateWeeklyLabels = (startDate) => {
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

  const generateDayLabels = (yearMonth) => {
    const [year, month] = yearMonth.split('-');
    const labels = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      labels.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    return labels;
  };

  const filterData = () => {
    const filteredLogs = loglist.filter(log => {
      if (selectedDateYOption === 'fail' && log.issue !== 'F') return false;
      if (selectedDateYOption === 'pass' && log.issue !== 'P') return false;
  
      if (selectedDateXOption === 'day') {
        return log.date === selectedDate;
      } else if (selectedDateXOption === 'week') {
        const selectedDateObj = parseISO(selectedDate);
        const logDateObj = parseISO(log.date);
        if (!isValid(selectedDateObj) || !isValid(logDateObj)) return false; // 유효하지 않은 날짜인 경우 false 반환
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedDateXOption === 'month') {
        return log.date.startsWith(selectedDate);
      } else if (selectedDateXOption === 'year') {
        return log.date.startsWith(selectedDate.split('-')[0]);
      }
  
      return false;
    });
  
    const groupedData = {};
    let sortedLabels = [];
  
    if (selectedDateXOption === 'day') {
      sortedLabels = generateHourlyLabels();
    } else if (selectedDateXOption === 'week') {
      sortedLabels = generateWeeklyLabels(selectedDate);
    } else if (selectedDateXOption === 'month') {
      sortedLabels = generateDayLabels(selectedDate);
    } else if (selectedDateXOption === 'year') {
      sortedLabels = generateMonthlyLabels();
    }
  
    sortedLabels.forEach(label => {
      groupedData[label] = 0;
    });
  
    filteredLogs.forEach(log => {
      let key;
      if (selectedDateXOption === 'day') {
        const hour = parseInt(log.time.split(':')[0], 10);
        key = `${hour}~${hour + 1}시`;
      } else if (selectedDateXOption === 'week' || selectedDateXOption === 'month') {
        key = log.date;
      } else if (selectedDateXOption === 'year') {
        key = log.date.split('-')[1] + '월';
      }
  
      if (groupedData[key] !== undefined) {
        groupedData[key]++;
      }
    });
  
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

  return (
    <div className={classes.dateStatisticsContainer}>
      <div className={classes.relativeBoxContainer}>
        <div className={classes.statisticsTitleBox}>날짜별 통계</div>
      </div>
      <div className={classes.statisticsContent}>
        <div className={classes.dataSelectContainer}>
          <div className={classes.axisSelectBox}>
            <div className={classes.axisSelectTitle}>선택 옵션 - X축</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="day"
                  checked={selectedDateXOption === 'day'}
                  onChange={handleDateXOption}
                />
                일
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="week"
                  checked={selectedDateXOption === 'week'}
                  onChange={handleDateXOption}
                />
                주
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="month"
                  checked={selectedDateXOption === 'month'}
                  onChange={handleDateXOption}
                />
                월
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="year"
                  checked={selectedDateXOption === 'year'}
                  onChange={handleDateXOption}
                />
                년
              </label>
            </div>
            <div className={classes.buttonContainer}>
              {selectedDateXOption === 'year' &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedDateXOption === 'year' || selectedDateXOption === 'month' || selectedDateXOption === 'week') &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedDateXOption === 'year' || selectedDateXOption === 'month') &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedDateXOption === 'day' || selectedDateXOption === 'week') && (
                <input
                  className={classes.inputText}
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              )}
              {selectedDateXOption === 'month' && (
                <input
                  className={classes.inputText}
                  type="month"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              )}
              {selectedDateXOption === 'year' && (
                <input
                  className={`${classes.inputText} ${classes.yearInputText}`}
                  type="number"
                  value={selectedDate.split('-')[0]}
                  onChange={(e) => handleDateChange({ target: { value: `${e.target.value}-01` } })}
                  placeholder="년도 입력"
                />
              )}
            </div>
          </div>
          <div className={classes.axisSelectBox}>
            <div className={classes.axisSelectTitle}>선택 옵션 - Y축</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="fail"
                  checked={selectedDateYOption === 'fail'}
                  onChange={handleDateYOption}
                />
                적발 횟수
              </label>
              <label className={classes.labelBox}>
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
        <div className={classes.chartContainer}>
          {graphData && (
            <Line
              data={graphData}
              options={{}}
              className={classes.chartCanvas}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DateStatistics;
