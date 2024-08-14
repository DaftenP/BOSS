import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import lightClasses from './Statistics.module.css';
import darkClasses from './StatisticsDark.module.css';
import { format, startOfWeek, startOfMonth, startOfYear, isValid, parseISO, addDays } from 'date-fns';

function DateStatistics({ loglist }) {
  const { t } = useTranslation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const [selectedDateXOption, setSelectedDateXOption] = useState('day');
  const [selectedDateYOption, setSelectedDateYOption] = useState('fail');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setDefaultDate();
  }, [selectedDateXOption]);

  const [selectedDateRange, setSelectedDateRange] = useState('');

  // 날짜 범위를 설정하는 함수
  const setDefaultDate = () => {
    const today = new Date();
    if (selectedDateXOption === 'day') {
      setSelectedDate(format(today, 'yyyy-MM-dd'));
      setSelectedDateRange('');
    } else if (selectedDateXOption === 'week') {
      const startOfSelectedWeek = format(startOfWeek(today), 'yyyy-MM-dd');
      const endOfSelectedWeek = format(addDays(startOfWeek(today), 6), 'yyyy-MM-dd');
      setSelectedDate(startOfSelectedWeek);
      setSelectedDateRange(`${startOfSelectedWeek} ~ ${endOfSelectedWeek}`);
    } else if (selectedDateXOption === 'month') {
      setSelectedDate(format(startOfMonth(today), 'yyyy-MM'));
      setSelectedDateRange(''); 
    } else if (selectedDateXOption === 'year') {
      setSelectedDate(format(startOfYear(today), 'yyyy'));
      setSelectedDateRange('');
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
    const newDate = event.target.value;
    setSelectedDate(newDate);

    if (selectedDateXOption === 'week') {
        const startOfSelectedWeek = format(parseISO(newDate), 'yyyy-MM-dd');
        const endOfSelectedWeek = format(addDays(parseISO(newDate), 6), 'yyyy-MM-dd');
        setSelectedDateRange(`${startOfSelectedWeek} ~ ${endOfSelectedWeek}`);
    } else {
        setSelectedDateRange('');
    }
  };

  const generateHourlyLabels = () => {
    const labels = [];
    for (let hour = 6; hour < 22; hour++) {
      labels.push(`${hour}~${hour + 1}${t('hour')}`);
    }
    return labels;
  };

  const generateMonthlyLabels = () => {
    const labels = [];
    for (let month = 1; month <= 12; month++) {
      labels.push(`${String(month).padStart(2, '0')}${t('month')}`);
    }
    return labels;
  };

  const generateWeeklyLabels = (startDate) => {
    const labels = [];
    const start = parseISO(startDate);
    if (!isValid(start)) return [];
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
      const filteredLog = {
        gateNumber: log.gateNumber,
        date: log.time.split('T')[0],
        time: log.time.split('T')[1],
        department: log.member.department.departmentName,
        issue: log.issue,
      };
      if (selectedDateYOption === 'fail' && filteredLog.issue !== 1) return false;
      if (selectedDateYOption === 'pass' && filteredLog.issue !== 0) return false;

      if (selectedDateXOption === 'day') {
        return filteredLog.date === selectedDate;
      } else if (selectedDateXOption === 'week') {
        const selectedDateObj = parseISO(selectedDate);
        const logDateObj = parseISO(filteredLog.date);
        if (!isValid(selectedDateObj) || !isValid(logDateObj)) return false;
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedDateXOption === 'month') {
        return filteredLog.date.startsWith(selectedDate);
      } else if (selectedDateXOption === 'year') {
        return filteredLog.date.startsWith(selectedDate.split('-')[0]);
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
      const filteredLog = {
        gateNumber: log.gateNumber,
        date: log.time.split('T')[0],
        time: log.time.split('T')[1],
        department: log.member.department.departmentName,
        issue: log.issue,
      };
      let key;
      if (selectedDateXOption === 'day') {
        const hour = parseInt(filteredLog.time.split(':')[0], 10);
        key = `${hour}~${hour + 1}${t('hour')}`;
      } else if (selectedDateXOption === 'week' || selectedDateXOption === 'month') {
        key = filteredLog.date;
      } else if (selectedDateXOption === 'year') {
        key = filteredLog.date.split('-')[1] + t('month');
      }

      if (groupedData[key] !== undefined) {
        groupedData[key]++;
      }
    });

    return {
      labels: sortedLabels,
      datasets: [{
        label: selectedDateYOption === 'fail' ? t('Detection Count') : t('Pass Count'),
        data: sortedLabels.map(label => groupedData[label]),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  const graphData = filterData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#bbb',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: isDarkMode ? '#bbb' : '#bbb',
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#bbb',
          font: {
            size: 14,
            weight: 'bold'
          },
          callback: function (value) {
            return value + t('people');
          }
        },
        grid: {
          color: isDarkMode ? '#bbb' : '#bbb',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#bbb',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      datalabels: {
        display: false,
      },
    }
  };

  return (
    <div className={classes.dateStatisticsContainer}>
      <div className={classes.relativeBoxContainer}>
        <div className={classes.statisticsTitleBox}>{t('Statistics by Date')}</div>
      </div>
      <div className={classes.statisticsContent}>
        <div className={classes.dataSelectContainer}>
          <div className={classes.axisSelectBox}>
            <div className={classes.axisSelectTitle}>{t('Selection Options - X Axis')}</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="day"
                  checked={selectedDateXOption === 'day'}
                  onChange={handleDateXOption}
                />
                {t('Day')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="week"
                  checked={selectedDateXOption === 'week'}
                  onChange={handleDateXOption}
                />
                {t('Week')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="month"
                  checked={selectedDateXOption === 'month'}
                  onChange={handleDateXOption}
                />
                {t('Month')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="year"
                  checked={selectedDateXOption === 'year'}
                  onChange={handleDateXOption}
                />
                {t('Year')}
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
              {selectedDateXOption === 'week' && (
                <div className={classes.dateRangeText}>
                  {selectedDateRange}
                </div>
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
                  placeholder={t('Enter Year')}
                />
              )}
            </div>
          </div>
          <div className={classes.axisSelectBox}>
            <div className={classes.axisSelectTitle}>{t('Selection Options - Y Axis')}</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="fail"
                  checked={selectedDateYOption === 'fail'}
                  onChange={handleDateYOption}
                />
                {t('Detection Count')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="pass"
                  checked={selectedDateYOption === 'pass'}
                  onChange={handleDateYOption}
                />
                {t('Pass Count')}
              </label>
            </div>
          </div>
        </div>
        <div className={classes.chartContainer}>
          {graphData && (
            <Line
              data={graphData}
              options={options}
              className={classes.chartCanvas}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DateStatistics;
