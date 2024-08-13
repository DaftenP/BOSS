import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import lightClasses from './Statistics.module.css';
import darkClasses from './StatisticsDark.module.css';
import { format, startOfWeek, startOfMonth, startOfYear, isValid, parseISO, addDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function TotalStatistics({ loglist }) {
  const { t } = useTranslation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const [selectedTotalXOption, setSelectedTotalXOption] = useState('day');
  const [selectedTotalYOption, setSelectedTotalYOption] = useState('fail');
  const [selectedTotalPopOption, setSelectedTotalPopOption] = useState('gate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotalDate, setSelectedTotalDate] = useState('');

  useEffect(() => {
    setDefaultTotalDate();

    const gates = [];
    const departments = new Set();

    loglist.forEach(log => {
      const gateLabel = `Gate ${log.gateNumber}`
      if (!gates.includes(gateLabel)) {
        gates.push(gateLabel);
      }
      departments.add(log.member.department.departmentName);
    });

    if (selectedTotalPopOption === 'gate') {
      setSelectedItems(gates);
    } else if (selectedTotalPopOption === 'department') {
      setSelectedItems(Array.from(departments));
    }
  }, [loglist, selectedTotalXOption, selectedTotalPopOption]);

  const [selectedDateRange, setSelectedDateRange] = useState('');

  const setDefaultTotalDate = () => {
    const today = new Date();
    if (selectedTotalXOption === 'day') {
      setSelectedTotalDate(format(today, 'yyyy-MM-dd'));
      setSelectedDateRange('');
    } else if (selectedTotalXOption === 'week') {
      const startOfSelectedWeek = format(startOfWeek(today), 'yyyy-MM-dd');
      const endOfSelectedWeek = format(addDays(startOfWeek(today), 6), 'yyyy-MM-dd');
      setSelectedTotalDate(startOfSelectedWeek);
      setSelectedDateRange(`${startOfSelectedWeek} ~ ${endOfSelectedWeek}`);
    } else if (selectedTotalXOption === 'month') {
      setSelectedTotalDate(format(startOfMonth(today), 'yyyy-MM'));
      setSelectedDateRange('');
    } else if (selectedTotalXOption === 'year') {
      setSelectedTotalDate(format(startOfYear(today), 'yyyy'));
      setSelectedDateRange('');
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
    const newDate = event.target.value;
    setSelectedTotalDate(newDate);

    if (selectedTotalXOption === 'week') {
        const startOfSelectedWeek = format(parseISO(newDate), 'yyyy-MM-dd');
        const endOfSelectedWeek = format(addDays(parseISO(newDate), 6), 'yyyy-MM-dd');
        setSelectedDateRange(`${startOfSelectedWeek} ~ ${endOfSelectedWeek}`);
    } else {
        setSelectedDateRange('');
    }
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

  const handleSelectAll = () => {
    setSelectedItems(items);
  };
  
  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const gates = [];
  const departments = new Set();

  loglist.forEach(log => {
    if (!gates.includes(`Gate ${log.gateNumber}`)) {
      gates.push(`Gate ${log.gateNumber}`);
    }
    departments.add(log.member.department.departmentName);
  });

  const items = selectedTotalPopOption === 'gate'
    ? gates
    : Array.from(departments);

  const generateTotalHourlyLabels = () => {
    const labels = [];
    for (let hour = 6; hour < 22; hour++) {
      labels.push(`${hour}~${hour + 1}${t('hour')}`);
    }
    return labels;
  };

  const generateTotalMonthlyLabels = () => {
    const labels = [];
    for (let month = 1; month <= 12; month++) {
      labels.push(`${String(month).padStart(2, '0')}${t('month')}`);
    }
    return labels;
  };

  const generateTotalWeeklyLabels = (startDate) => {
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
      const gateNumber = `Gate ${log.gateNumber}`
      const filteredLog = {
        gate: gateNumber,
        date: log.time.split('T')[0],
        time: log.time.split('T')[1],
        department: log.member.department.departmentName,
        issue: log.issue,
      };
      if (selectedTotalPopOption === 'gate' && filteredLog.gate !== filterBy) return false;
      if (selectedTotalYOption === 'pass' && filteredLog.issue !== 0) return false;
  
      if (selectedTotalPopOption === 'gate' && filteredLog.gate !== filterBy) return false;
      if (selectedTotalPopOption === 'department' && filteredLog.department !== filterBy) return false;
  
      if (selectedTotalXOption === 'day') {
        return filteredLog.date === selectedTotalDate;
      } else if (selectedTotalXOption === 'week') {
        const selectedDateObj = parseISO(selectedTotalDate);
        const logDateObj = parseISO(filteredLog.date);
        if (!isValid(selectedDateObj) || !isValid(logDateObj)) return false;
        const diffDays = (logDateObj - selectedDateObj) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays < 7;
      } else if (selectedTotalXOption === 'month') {
        return filteredLog.date.startsWith(selectedTotalDate);
      } else if (selectedTotalXOption === 'year') {
        return filteredLog.date.startsWith(selectedTotalDate.split('-')[0]);
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
      const filteredLog = {
        gate: log.gateNumber,
        date: log.time.split('T')[0],
        time: log.time.split('T')[1],
        department: log.member.department.departmentName,
        issue: log.issue,
      };
      let key;
      if (selectedTotalXOption === 'day') {
        const hour = parseInt(filteredLog.time.split(':')[0], 10);
        key = `${hour}~${hour + 1}${t('hour')}`;
      } else if (selectedTotalXOption === 'week' || selectedTotalXOption === 'month') {
        key = filteredLog.date;
      } else if (selectedTotalXOption === 'year') {
        key = filteredLog.date.split('-')[1] + t('month');
      }
  
      if (groupedData[key] !== undefined) {
        groupedData[key]++;
      }
    });
  
    return {
      labels: sortedLabels,
      datasets: [{
        label: selectedTotalYOption === 'fail' ? t('Detection Count') : t('Pass Count'),
        data: sortedLabels.map(label => groupedData[label]),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  const options = {
    responsive: true,
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
          color: '#bbb',
          font: {
            size: 14,
            weight: 'bold'
          },
          callback: function(value) {
            return value + t('people');
          }
        },
        grid: {
          color: isDarkMode ? '#bbb' : '#bbb',
        },
      },
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
    },
  };  

  return (
    <div className={classes.dateStatisticsContainer}>
      <div className={classes.relativeBoxContainer}>
        <div className={classes.statisticsTitleBox}>{t('Total Statistics')}</div>
      </div>
      <div className={classes.totalStatisticsContent}>
        <div className={classes.totalDataSelectContainer}>
          <div className={classes.totalAxisSelectBox}>
            <div className={classes.totalAxisSelectTitle}>{t('Selection Options - X Axis')}</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="day"
                  checked={selectedTotalXOption === 'day'}
                  onChange={handleTotalXOption}
                />
                {t('Day')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="week"
                  checked={selectedTotalXOption === 'week'}
                  onChange={handleTotalXOption}
                />
                {t('Week')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="month"
                  checked={selectedTotalXOption === 'month'}
                  onChange={handleTotalXOption}
                />
                {t('Month')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="year"
                  checked={selectedTotalXOption === 'year'}
                  onChange={handleTotalXOption}
                />
                {t('Year')}
              </label>
            </div>
            <div className={classes.buttonContainer}>
              {selectedTotalXOption === 'year' &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedTotalXOption === 'year' || selectedTotalXOption === 'month' || selectedTotalXOption === 'week') &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedTotalXOption === 'year' || selectedTotalXOption === 'month') &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              {(selectedTotalXOption === 'day' || selectedTotalXOption === 'week') && (
                <input
                  className={`${classes.inputText} ${classes.specificInputText}`}
                  type="date"
                  value={selectedTotalDate}
                  onChange={handleTotalDateChange}
                />
              )}
              {selectedTotalXOption === 'week' && (
                <div className={classes.totalRangeText}>
                  {selectedDateRange}
                </div>
              )}
              {selectedTotalXOption === 'month' && (
                <input
                  className={`${classes.inputText} ${classes.specificInputText}`}
                  type="month"
                  value={selectedTotalDate}
                  onChange={handleTotalDateChange}
                />
              )}
              {selectedTotalXOption === 'year' && (
                <input
                  className={`${classes.inputText} ${classes.specificInputText} ${classes.yearInputText}`}
                  type="number"
                  value={selectedTotalDate.split('-')[0]}
                  onChange={(e) => handleTotalDateChange({ target: { value: `${e.target.value}-01` } })}
                  placeholder={t('Enter Year')}
                />
              )}
            </div>
          </div>
          <div className={classes.totalAxisSelectBox}>
            <div className={classes.totalAxisSelectTitle}>{t('Selection Options - Y Axis')}</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="fail"
                  checked={selectedTotalYOption === 'fail'}
                  onChange={handleTotalYOption}
                />
                {t('Detection Count')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="pass"
                  checked={selectedTotalYOption === 'pass'}
                  onChange={handleTotalYOption}
                />
                {t('Pass Count')}
              </label>
            </div>
          </div>
          <div className={classes.totalAxisSelectBox}>
            <div className={classes.totalAxisSelectTitle}>{t('Population Selection Options')}</div>
            <div className={classes.dataSelectBox}>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="gate"
                  checked={selectedTotalPopOption === 'gate'}
                  onChange={handleTotalPopOption}
                />
                {t('View by Gate')}
              </label>
              <label className={classes.labelBox}>
                <input
                  type="radio"
                  value="department"
                  checked={selectedTotalPopOption === 'department'}
                  onChange={handleTotalPopOption}
                />
                {t('View by Department')}
              </label>
            </div>
            <div className={classes.buttonContainer}>
              {selectedTotalPopOption === 'department' &&
                <div className={classes.emptySpace}>EMPTY</div>
              }
              <button className={classes.buttonBox} onClick={openModal}>
                {selectedTotalPopOption === 'gate' ? t('Select Gate') : t('Select Department')}
              </button>
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Select Items Modal"
              className={classes.modal}
              overlayClassName={classes.overlay}
            >
              <div className={classes.modalTopContainer}>
                <div className={classes.title}>
                  {selectedTotalPopOption === 'gate' ? (
                    <div>{t('Select Gate')}</div>
                  ) : (
                    <div>{t('Select Department')}</div>
                  )}
                </div>
                <div className={classes.selectButtonsContainer}>
                  {selectedItems.length === items.length ? (
                    <button onClick={handleDeselectAll} className={classes.deselectAllButton}>{t('Deselect All')}</button>
                  ) : selectedItems.length === 0 ? (
                    <button onClick={handleSelectAll} className={classes.selectAllButton}>{t('Select All')}</button>
                  ) : (
                    <>
                      <button onClick={handleSelectAll} className={classes.selectAllButton}>{t('Select All')}</button>
                      <button onClick={handleDeselectAll} className={classes.deselectAllButton}>{t('Deselect All')}</button>
                    </>
                  )}
                </div>
              </div>
              <table className={classes.itemsTable}>
                <tbody>
                  {items.reduce((rows, item, index) => {
                    const itemsPerRow = selectedTotalPopOption === 'gate' ? 4 : 2;
                    if (index % itemsPerRow === 0) {
                      rows.push([]);
                    }
                    rows[rows.length - 1].push(item);
                    return rows;
                  }, []).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((item, colIndex) => (
                        <React.Fragment key={colIndex}>
                          <td key={`checkbox-${colIndex}`} className={classes.checkCell}>
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item)}
                              onChange={() => handleItemClick(item)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td
                            key={`name-${colIndex}`}
                            className={`${selectedItems.includes(item) ? classes.selectedRow : ''} ${classes.clickableCell} ${classes.nameCell}`}
                            onClick={() => handleItemClick(item)}
                          >
                            {item}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className={classes.closeButton} onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
              <div className={classes.modalButtonContainer}>
                <button onClick={handleConfirm} className={classes.confirmButton}>{t('Confirm')}</button>
              </div>
            </Modal>
          </div>
        </div>
        <div className={classes.graphContainer}>
          {selectedItems.map(item => {
            const data = filterDataForTotal(loglist, item);
            return (
              <div key={item} className={classes.graphBox}>
                <div className={classes.graphTitle}>
                  {item}
                </div>
                <Line data={data} options={options} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TotalStatistics;
