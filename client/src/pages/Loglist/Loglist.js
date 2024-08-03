import React, { useState, useEffect } from 'react';
import classes from './Loglist.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLogs, updateLog, fetchFilteredLogs } from '../../store/loglist';
import pictureIcon from '../../assets/List/Picture_icon.png'
import editIcon from '../../assets/List/Edit_icon.png'
import checkIcon from '../../assets/List/Check_icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
 

const Modal = ({ show, onClose, log, update }) => {
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
        countOfSticker: log.stickerCount
      })
    }
  }, [log])

  const dispatch = useDispatch();

  if (!show) {
    return null;
  }
  const handleModalInputChange = (event) => {
    const { name, value, type } = event.target
    const processdValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFormData((processdFilters) => ({
      ...processdFilters,
      [name]: processdValue,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateLog(formData)).then(() => {
      dispatch(fetchLogs());
      onClose();
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
                <label htmlFor="issue" className={classes.labelText}>보안 이슈</label>
                <input
                  className={classes.updateInputText}
                  type="number"
                  name="issue"
                  placeholder="보안 이슈"
                  value={formData.issue}
                  onChange={handleModalInputChange}
                />
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="countOfSticker" className={classes.labelText}>발급 개수</label>
                <input
                  className={classes.updateInputText}
                  type="number"
                  name="countOfSticker"
                  placeholder="발급 개수"
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
              <div className={classes.deviceImage}>{log.deviceBackImage}</div>
              <div className={classes.deviceImage}>{log.deviceFrontImage}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function LogTable() {
  const logsData = useSelector(state => state.loglist.data); // 리덕스 store에 있는 데이터 접근
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLogs())
  }, [dispatch]);

  const [visibleCount, setVisibleCount] = useState(20);
  const [update, setUpdate] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    position: '',
    entering: '',
    // startDate: '',
    // endDate: '',
    // startTime: '',
    // endTime: '',
    time: '',
    issue: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    const processedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: processedValue
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
    setVisibleCount(20);
    dispatch(fetchFilteredLogs(filteredFilters));
    setFilters({
      name: '',
      department: '',
      position: '',
      entering: '',
      // startDate: '',
      // endDate: '',
      // startTime: '',
      // endTime: '',
      time: '',
      issue: '',
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
  }

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
          F I L T E R I N G
        </div>
        <div className={classes.inputContainer}>
          <form onSubmit={handleFilter} className={classes.relativeBoxContainer}>
            <table className={classes.filterTable}>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="name" className={classes.labelText}>이름</label>
                    <input className={classes.inputText} type="text" name="name" placeholder="이름" value={filters.name} onChange={handleInputChange} />
                  </td>
                  <td>
                    <label htmlFor="department" className={classes.labelText}>부서</label>
                    <input className={classes.inputText} type="text" name="department" placeholder="부서" value={filters.department} onChange={handleInputChange} />
                  </td>
                  <td>
                    <label htmlFor="position" className={classes.labelText}>직책</label>
                    <input className={classes.inputText} type="text" name="position" placeholder="직책" value={filters.position} onChange={handleInputChange} />
                  </td>
                  <td>
                    <label htmlFor="entering" className={classes.labelText}>출/퇴</label>
                    <input className={classes.inputText} type="number" name="entering" placeholder="출/퇴" value={filters.entering} onChange={handleInputChange} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="startDate" className={classes.labelText}>시작 날짜</label>
                    <input className={`${classes.inputText} ${classes.specificInputText}`} type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} />
                  </td>
                  <td>
                    <label htmlFor="endDate" className={classes.labelText}>종료 날짜</label>
                    <input className={`${classes.inputText} ${classes.specificInputText}`} type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} />
                  </td>
                  <td>
                    <label htmlFor="startTime" className={classes.labelText}>시작 시간</label>
                    <input className={`${classes.inputText} ${classes.specificInputText}`} type="time" name="startTime" value={filters.startTime} onChange={handleInputChange} />
                  </td>
                  <td>
                    <label htmlFor="endTime" className={classes.labelText}>종료 시간</label>
                    <input className={`${classes.inputText} ${classes.specificInputText}`} type="time" name="endTime" value={filters.endTime} onChange={handleInputChange} />
                  </td>
                </tr>
                <tr>
                  <td colSpan="1">
                    <label htmlFor="issue" className={classes.labelText}>보안 이슈</label>
                    <input className={classes.inputText} type="number" name="issue" placeholder="보안 이슈" value={filters.issue} onChange={handleInputChange} />
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" className={classes.formButton}>검색</button>
          </form>
        </div>
      </div>
      <div className={classes.listContainer}>
        <div className={classes.listTitle}>
          전체 이슈 로그
        </div>
        <div className={classes.logCount}>
          {totalLogsCount}
        </div>

        <table className={classes.logTable}>
          <thead>
            <tr>
              <th>기기</th>
              <th>로그 ID</th>
              <th>이름</th>
              <th>부서</th>
              <th>직책</th>
              <th>날짜</th>
              <th>시간</th>
              <th>출/퇴</th>
              <th>보안 이슈</th>
              <th>발급 개수</th>
              <th>자세히</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {displayedLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.gateNumber}</td>
                <td>{log.logId}</td>
                <td>{log.name}</td>
                <td>{log.department}</td>
                <td>{log.position}</td>
                <td>{log.time.split('T')[0]}</td>
                <td>{log.time.split('T')[1]}</td>
                <td>{log.entering}</td>
                <td>{log.issue}</td>
                <td>{log.stickerCount}</td>
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
            <button onClick={handleLoadMore} className={classes.moreButton}>▼ 더보기</button>
          )}
        </div>

      </div>
    </div>
  );
}

export default LogTable;
