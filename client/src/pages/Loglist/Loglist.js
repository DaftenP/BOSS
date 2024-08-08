import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLogs, updateLog, fetchFilteredLogs, loglistActions } from '../../store/loglist';
import { fetchDepartmentLists } from '../../store/department';
import { fetchPositionLists } from '../../store/position';
import lightClasses from './Loglist.module.css';
import darkClasses from './LoglistDark.module.css';
import pictureIcon from '../../assets/List/Picture_icon.png';
import editIcon from '../../assets/List/Edit_icon.png';
import checkIcon from '../../assets/List/Check_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ show, onClose, log, update }) => {
  const { t } = useTranslation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const [formData, setFormData] = useState({
    logId: 0,
    issue: 0,
    countOfSticker: 0,
  });

  useEffect(() => {
    if (log) {
      setFormData({
        logId: log.logId,
        issue: log.issue,
        countOfSticker: log.stickerCount,
      });
    }
  }, [log]);

  const dispatch = useDispatch();

  if (!show) {
    return null;
  }

  const handleModalInputChange = (event) => {
    const { name, value, type } = event.target;
    const processdValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFormData((processdFilters) => ({
      ...processdFilters,
      [name]: processdValue,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateLog(formData))
      .then((response) => {
        if (response.payload) {
          dispatch(loglistActions.updateLogInState(response.payload));
          onClose();
        }
      })
      .then(() => {
        window.location.href = '/loglist';
      });
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={classes.modalBackdrop} onClick={handleBackdropClick}>
      <div className={`${classes.modalContent} ${update ? '' : classes.imageContainer}`}>
        {update ? (
          <div className={classes.updateModalContainer}>
            <span className={classes.closeButton} onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <form className={classes.formContainer} onSubmit={handleSubmit}>
              <div className={classes.formGroup}>
                <label htmlFor="issue" className={classes.updateLabelText}>{t('Security Issue')}</label>
                <input
                  className={classes.updateInputText}
                  type="number"
                  name="issue"
                  placeholder={t('Security Issue')}
                  value={formData.issue}
                  onChange={handleModalInputChange}
                />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="countOfSticker" className={classes.updateLabelText}>{t('Number of Stickers Issued')}</label>
                <input
                  className={classes.updateInputText}
                  type="number"
                  name="countOfSticker"
                  placeholder={t('Number of Stickers Issued')}
                  value={formData.countOfSticker}
                  onChange={handleModalInputChange}
                />
              </div>
              <div className={classes.updateButtonContainer}>
                <button type="submit" className={classes.submitButton}>
                  <img src={checkIcon} alt="check_icon" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <span className={classes.closeButton} onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <div className={classes.deviceInfoBox}>{log.time.split('T')[0]} {log.time.split('T')[1]} {log.name}</div>
            <div className={classes.deviceImageBox}>
              <div className={classes.deviceImage}>
                <img src={log.deviceBackImage} alt={`${log.member.name}'s deviceBackImage`} className={classes.devieEachImage} />
              </div>
              <div className={classes.deviceImage}>
                <img src={log.deviceFrontImage} alt={`${log.member.name}'s deviceFrontImage`} className={classes.devieEachImage} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function LogTable() {
  const { t } = useTranslation();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;
  const logsData = useSelector((state) => state.loglist.data);
  const departmentLists = useSelector((state) => state.department.data)
  const positionLists = useSelector((state) => state.position.data)
  const [selectedSearchOption, setSelectedSearchOption] = useState('quick')

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDepartmentLists());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPositionLists());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  const handleSearchOptionChange = (event) => {
    setSelectedSearchOption(event.target.value)
  }

  const [visibleCount, setVisibleCount] = useState(20);
  const [update, setUpdate] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    departmentName: '',
    positionName: '',
    entering: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    issue: '',
    memberId: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    const processedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: processedValue,
    }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleFilter = (event) => {
    event.preventDefault();
    const filteredFilters = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [key, value === '' ? null : value])
    );

    const transformedFilters = {
      ...filteredFilters,
      startTime: filteredFilters.startTime && filteredFilters.startDate ? `${filteredFilters.startDate}T${filteredFilters.startTime}:00` : null,
      endTime: filteredFilters.endTime && filteredFilters.endDate ? `${filteredFilters.endDate}T${filteredFilters.endTime}:00` : null,
    };

    const finalFilters = {
      name: transformedFilters.name,
      departmentName: transformedFilters.departmentName,
      positionName: transformedFilters.positionName,
      entering: transformedFilters.entering,
      startTime: transformedFilters.startTime,
      endTime: transformedFilters.endTime,
      issue: transformedFilters.issue,
      memberId: transformedFilters.memberId,
    };

    setVisibleCount(20);
    dispatch(fetchFilteredLogs(finalFilters));
    setFilters({
      name: '',
      departmentName: '',
      positionName: '',
      entering: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      issue: '',
      memberId: '',
    });
  };

  const handleShowModal = (log) => {
    setUpdate(false);
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleUpdateModal = (log) => {
    setUpdate(true);
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  const displayedLogs = logsData.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(20);
  }, [logsData]);

  const totalLogsCount = logsData.length;

  return (
    <div className={classes.mainContainer}>
      <div className={`${classes.filteringContainer} ${classes.relativeBoxContainer}`}>
        {showModal && <div className={classes.modalBackdrop}></div>}
        <div className={classes.filteringBox}>
          {t('FILTERING')}
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.optionLabel}>{t('searchOptions', '검색 옵션')}</div>
            <div className={classes.optionContainer}>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                value="quick"
                checked={selectedSearchOption === 'quick'}
                onChange={handleSearchOptionChange}
                className={classes.radioInput}
              />
              {t('quickSearch', '간편 검색')}
            </label>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                value="advanced"
                checked={selectedSearchOption === 'advanced'}
                onChange={handleSearchOptionChange}
                className={classes.radioInput}
              />
              {t('advancedSearch', '상세 검색')}
            </label>
          </div>
          <form onSubmit={handleFilter} className={classes.relativeBoxContainer}>
            {selectedSearchOption === 'quick' ? (
              <table className={classes.filterTable}>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="name" className={classes.labelText}>{t('Name')}</label>
                      <input className={classes.inputText} type="text" name="name" placeholder={t('Name')} value={filters.name} onChange={handleInputChange} />
                    </td>
                    <td>
                      <label htmlFor="memberId" className={classes.labelText}>{t('Member ID')}</label>
                      <input className={classes.inputText} type="number" name="memberId" placeholder={t('Member ID')} value={filters.memberId} onChange={handleInputChange} />
                    </td>
                    <td className={classes.buttonCell}>
                      <br />
                      <button type="submit" className={classes.formButton}>{t('Search')}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className={classes.filterTable}>
                <tbody>
                  <tr>
                    <td className={classes.tdCell}>
                      <br />
                      <div>{t('Basic Info', '기본 정보')}</div>
                    </td>
                    <td>
                      <label htmlFor="name" className={classes.labelText}>{t('Name')}</label>
                      <input className={classes.inputText} type="text" name="name" placeholder={t('Name')} value={filters.name} onChange={handleInputChange} />
                    </td>
                    <td>
                      <label htmlFor="memberId" className={classes.labelText}>{t('Member ID')}</label>
                      <input className={classes.inputText} type="number" name="memberId" placeholder={t('Member ID')} value={filters.memberId} onChange={handleInputChange} />
                    </td>
                    <td className={`${classes.tdCell} ${classes.timeCell}`}>
                      <br />
                      <div>{t('Time Info', '시간 정보')}</div>
                    </td>
                    <td>
                      <label htmlFor="startDate" className={classes.labelText}>{t('Start Date')}</label>
                      <input className={`${classes.inputText} ${classes.specificInputText}`} type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} />
                    </td>
                    <td>
                      <label htmlFor="startTime" className={classes.labelText}>{t('Start Time')}</label>
                      <input className={`${classes.inputText} ${classes.specificInputText}`} type="time" name="startTime" value={filters.startTime} onChange={handleInputChange} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.tdCell}>
                      <br />
                      <div>{t('Job Info', '부서 정보')}</div>
                    </td>
                    <td>
                      <label htmlFor="departmentName" className={classes.labelText}>{t('Department')}</label>
                      <select className={classes.inputText} name="departmentName" value={filters.departmentName} onChange={handleInputChange}>
                        <option value="">{t('Select Department', '부서 선택')}</option>
                        {departmentLists.map((department) => (
                          <option key={department.departmentId} value={department.departmentName}>
                            {department.departmentName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <label htmlFor="positionName" className={classes.labelText}>{t('Position')}</label>
                      <select className={classes.inputText} name="positionName" value={filters.positionName} onChange={handleInputChange}>
                        <option value="">{t('Select Position', '직무 선택')}</option>
                        {positionLists.map((position) => (
                          <option key={position.positionId} value={position.positionName}>
                            {position.positionName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td></td>
                    <td>
                      <label htmlFor="endDate" className={classes.labelText}>{t('End Date')}</label>
                      <input className={`${classes.inputText} ${classes.specificInputText}`} type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} />
                    </td>
                    <td>
                      <label htmlFor="endTime" className={classes.labelText}>{t('End Time')}</label>
                      <input className={`${classes.inputText} ${classes.specificInputText}`} type="time" name="endTime" value={filters.endTime} onChange={handleInputChange} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.tdCell}>
                      <br />
                      <div>{t('Security Info', '보안 정보')}</div>
                    </td>
                    <td>
                      <label htmlFor="entering" className={classes.labelText}>{t('In/Out')}</label>
                      <input className={classes.inputText} type="number" name="entering" placeholder={t('In/Out')} value={filters.entering} onChange={handleInputChange} />
                    </td>
                    <td>
                      <label htmlFor="issue" className={classes.labelText}>{t('Security Issue')}</label>
                      <input className={classes.inputText} type="number" name="issue" placeholder={t('Security Issue')} value={filters.issue} onChange={handleInputChange} />
                    </td>
                    <td></td>
                    <td></td>
                    <td className={classes.buttonCell}>
                      <br />
                      <button type="submit" className={classes.formButton}>{t('Search')}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </form>
        </div>
      </div>
      <div className={classes.listContainer}>
        <div className={classes.listTitle}>
          {t('Total Issue Logs')}
        </div>
        <div className={classes.logCount}>
          {t('Total Issues Found')}: {totalLogsCount}
        </div>
        <table className={classes.logTable}>
          <thead>
            <tr>
              <th>{t('Device')}</th>
              <th>{t('Log ID')}</th>
              <th>{t('Member ID')}</th>
              <th>{t('Name')}</th>
              <th>{t('Department')}</th>
              <th>{t('Position')}</th>
              <th>{t('Date')}</th>
              <th>{t('Time')}</th>
              <th>{t('In/Out')}</th>
              <th>{t('Security Issue')}</th>
              <th>{t('Number of Stickers Issued')}</th>
              <th>{t('Details')}</th>
              <th>{t('Edit')}</th>
            </tr>
          </thead>
          <tbody>
            {displayedLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.gateNumber}</td>
                <td>{log.logId}</td>
                <td>{log.member.memberId}</td>
                <td>{log.member.name}</td>
                <td>{log.member.department.departmentName}</td>
                <td>{log.member.position.positionName}</td>
                <td>{log.time.split('T')[0]}</td>
                <td>{log.time.split('T')[1]}</td>
                <td>{log.entering === 0 ? (<div className={classes.entryText}>{t('Entry', '출입')}</div>) : (<div className={classes.exitText}>{t('Exit', '퇴장')}</div>)}</td>
                <td>{log.issue === 0 ? (<div className={classes.noIssue}>{t('Clear', '정상')}</div>) : (<div className={classes.issueDetected}>{t('Alert', '경고')}</div>)}</td>
                <td className={classes.countText}>{log.stickerCount}</td>
                <td>
                  <div onClick={() => handleShowModal(log)}>
                    <img className={classes.logIcon} src={pictureIcon} alt="picture_icon" />
                  </div>
                </td>
                <td>
                  <div onClick={() => handleUpdateModal(log)}>
                    <img className={classes.logIcon} src={editIcon} alt="edit_icon" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal show={showModal} onClose={handleCloseModal} log={selectedLog} update={update} />
        <div className={classes.moreButtonContainer}>
          {visibleCount < logsData.length && (
            <button onClick={handleLoadMore} className={classes.moreButton}>▼ {t('Load More')}</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogTable;
