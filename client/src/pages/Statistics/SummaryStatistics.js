import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import lightClasses from './Statistics.module.css';
import darkClasses from './StatisticsDark.module.css';
import { parseISO, addDays, format, startOfWeek, startOfMonth, startOfYear, getDaysInMonth, isLeapYear } from 'date-fns';

function SummaryStatistics({ loglist }) {
  const { t } = useTranslation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)
  const classes = isDarkMode ? darkClasses : lightClasses;

  const [selectedSummaryOption, setSelectedSummaryOption] = useState('day');
  const [selectedSummaryDate, setSelectedSummaryDate] = useState('');
  const [statistics, setStatistics] = useState({ users: 0, issues: 0, logs: 0, averageIssues: 0 });

  useEffect(() => {
    setDefaultSummaryDate();
  }, [selectedSummaryOption]);

  useEffect(() => {
    calculateStatistics();
  }, [selectedSummaryDate, selectedSummaryOption, loglist]);

  const [selectedDateRange, setSelectedDateRange] = useState('');

  const setDefaultSummaryDate = () => {
    const today = new Date();
    if (selectedSummaryOption === 'day') {
      setSelectedSummaryDate(format(today, 'yyyy-MM-dd'));
      setSelectedDateRange(''); // 주가 아닌 경우 빈 범위로 설정
    } else if (selectedSummaryOption === 'week') {
      const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 }); // 일요일을 기준으로 한 주의 시작
      const endOfWeekDate = new Date(startOfWeekDate);
      endOfWeekDate.setDate(startOfWeekDate.getDate() + 6); // 7일 후의 날짜 계산
  
      setSelectedSummaryDate(format(startOfWeekDate, 'yyyy-MM-dd'));
      setSelectedDateRange(`${format(startOfWeekDate, 'yyyy-MM-dd')} ~ ${format(endOfWeekDate, 'yyyy-MM-dd')}`);
    } else if (selectedSummaryOption === 'month') {
      setSelectedSummaryDate(format(startOfMonth(today), 'yyyy-MM'));
      setSelectedDateRange(''); // 주가 아닌 경우 빈 범위로 설정
    } else if (selectedSummaryOption === 'year') {
      setSelectedSummaryDate(format(startOfYear(today), 'yyyy'));
      setSelectedDateRange(''); // 주가 아닌 경우 빈 범위로 설정
    }
  };

  const handleSummaryOption = (event) => {
    setSelectedSummaryOption(event.target.value);
  };

  const handleSummaryDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedSummaryDate(newDate);
  
    if (selectedSummaryOption === 'week') {
      const startOfSelectedWeek = format(parseISO(newDate), 'yyyy-MM-dd');
      const endOfSelectedWeek = format(addDays(parseISO(newDate), 6), 'yyyy-MM-dd');
      setSelectedDateRange(`${startOfSelectedWeek} ~ ${endOfSelectedWeek}`);
    } else {
      setSelectedDateRange('');
    }
  };

  const calculateStatistics = () => {
    let filteredLogs = loglist.filter(log => {
      const filteredLog = {
        gate: log.gateNumber,
        date: log.time.split('T')[0],
        time: log.time.split('T')[1],
        department: log.member.department.departmentName,
        issue: log.issue,
        memberId: log.member.memberId,
      }
      if (selectedSummaryOption === 'day') {
        return filteredLog.date === selectedSummaryDate;
      } else if (selectedSummaryOption === 'week') {
        const selectedDateObj = new Date(selectedSummaryDate);
        const logDateObj = new Date(filteredLog.date);
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedSummaryOption === 'month') {
        return filteredLog.date && selectedSummaryDate && filteredLog.date.startsWith(selectedSummaryDate);
      } else if (selectedSummaryOption === 'year') {
        return filteredLog.date && selectedSummaryDate && filteredLog.date.startsWith(selectedSummaryDate);
      }
      return false;
    });

    const uniqueUsers = new Set(filteredLogs.map(log => log.member.memberId)).size;
    const issues = filteredLogs.filter(log => log.issue === 1).length;
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
    <div className={classes.dateStatisticsContainer}>
      <div className={classes.relativeBoxContainer}>
        <div className={classes.statisticsTitleBox}>{t('Summary Statistics')}</div>
      </div>
      <div className={classes.statisticsContent}>
        <div className={classes.dataSelectContainer}>
          <div className={classes.axisSelectBox}>
            <div className={classes.axisSelectTitle}>{t('Selection Options')}</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="day"
                  checked={selectedSummaryOption === 'day'}
                  onChange={handleSummaryOption}
                />
                {t('Day')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="week"
                  checked={selectedSummaryOption === 'week'}
                  onChange={handleSummaryOption}
                />
                {t('Week')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="month"
                  checked={selectedSummaryOption === 'month'}
                  onChange={handleSummaryOption}
                />
                {t('Month')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="year"
                  checked={selectedSummaryOption === 'year'}
                  onChange={handleSummaryOption}
                />
                {t('Year')}
              </label>
            </div>
            <div className={classes.buttonContainer}>
              {selectedSummaryOption === 'year' &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedSummaryOption === 'year' || selectedSummaryOption === 'month' || selectedSummaryOption === 'week') &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedSummaryOption === 'year' || selectedSummaryOption === 'month') &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedSummaryOption === 'day' || selectedSummaryOption === 'week') && (
                <input
                  className={classes.inputText}
                  type="date"
                  value={selectedSummaryDate}
                  onChange={handleSummaryDateChange}
                />
              )}
              {selectedSummaryOption === 'week' && (
                <div className={classes.dateRangeText}>
                  {selectedDateRange}
                </div>
              )}
              {selectedSummaryOption === 'month' && (
                <input
                  className={classes.inputText}
                  type="month"
                  value={selectedSummaryDate}
                  onChange={handleSummaryDateChange}
                />
              )}
              {selectedSummaryOption === 'year' && (
                <input
                  className={`${classes.inputText} ${classes.yearInputText}`}
                  type="number"
                  value={selectedSummaryDate}
                  onChange={handleSummaryDateChange}
                  placeholder={t('Enter Year')}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          <div className={classes.summaryStatisticsContainer}>
            <div className={classes.statisticsCard}>
              <h3>{t('Number of Users')}</h3>
              <p className={classes.value}>{statistics.users} {t('people')}</p>
            </div>
            <div className={classes.statisticsCard}>
              <h3>{t('Number of Issues')}</h3>
              <p className={classes.value}>{statistics.issues} {t('times')}</p>
            </div>
            <div className={classes.statisticsCard}>
              <h3>{t('Number of Logs')}</h3>
              <p className={classes.value}>{statistics.logs} {t('logs')}</p>
            </div>
            <div className={classes.statisticsCard}>
              <h3>{t('Average detections')}</h3>
              <p className={classes.value}>{statistics.averageIssues.toFixed(1)} {t('Cnt', '개')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryStatistics;
