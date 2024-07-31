import React, { useState } from 'react';
import classes from './Loglist.module.css';
import { useSelector } from 'react-redux';


const Modal = ({ show, onClose, log }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={classes.modalBackdrop}>
      <div className={classes.modalContent}>
        {/* 예시 이미지 두 개를 출력합니다. 실제 이미지 URL로 교체하세요. */}
        <p className={classes.modalContent}><strong>{log.date}  {log.time}  {log.name}</strong> </p>

        {/* <img src="https://via.placeholder.com/200" alt="Image 1" />
        <img src="https://via.placeholder.com/200" alt="Image 2" /> */}
        <div><button onClick={onClose}>닫기</button></div>

      </div>
    </div>
  );
};

function LogTable() {
  const logsData = useSelector(state => state.loglist.data); // 리덕스 store에 있는 데이터 접근
  const [visibleCount, setVisibleCount] = useState(20);
  const [filteredLogs, setFilteredLogs] = useState(logsData);

  const [filters, setFilters] = useState({
    name: '',
    id: '',
    department: '',
    position: '',
    entering: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    issue: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // useEffect(() => {
  //   setFilteredLogs(logsData); // 데이터가 변경될 때마다 filteredLogs를 업데이트
  // }, [logsData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };


  const handleFilter = (event) => {
    event.preventDefault();
    let tempLogs = logsData;
    setVisibleCount(20);

    if (filters.name) {
      tempLogs = tempLogs.filter(log => log.name.includes(filters.name));
    }
    if (filters.id) {
      tempLogs = tempLogs.filter(log => log.id.includes(filters.id));
    }
    if (filters.department) {
      tempLogs = tempLogs.filter(log => log.department.includes(filters.department));
    }
    if (filters.position) {
      tempLogs = tempLogs.filter(log => log.position.includes(filters.position));
    }
    if (filters.entering) {
      tempLogs = tempLogs.filter(log => log.entering.includes(filters.entering));
    }
    if (filters.startDate) {
      tempLogs = tempLogs.filter(log => new Date(log.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      tempLogs = tempLogs.filter(log => new Date(log.date) <= new Date(filters.endDate));
    }
    if (filters.startTime) {
      tempLogs = tempLogs.filter(log => log.time >= filters.startTime);
    }
    if (filters.endTime) {
      tempLogs = tempLogs.filter(log => log.time <= filters.endTime);
    }
    if (filters.issue) {
      tempLogs = tempLogs.filter(log => log.issue.includes(filters.issue));
    }

    setFilteredLogs(tempLogs);

    setFilters({
      name: '',
      id: '',
      department: '',
      position: '',
      entering: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      issue: ''
    });
  };

  const handleShowModal = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  const displayedLogs = filteredLogs.slice(0, visibleCount);
  const totalLogsCount = logsData.length;
  const filteredLogsCount = filteredLogs.length;

  return (
    <div className={classes.mainContainer}>
      <div className={`${classes.filteringContainer} ${classes.relativeBoxContainer}`}>
        {showModal && <div className={classes.modalBackdrop}></div>}
        <div className={classes.filteringBox}>
            F I L T E R I N G
        </div>
        <div className={classes.inputContainer}>
          <form onSubmit={handleFilter}>
            <div>
              <label htmlFor="name" className={classes.labelText}>이름</label>
              <input className={classes.inputText} type="text" name="name" placeholder="이름" value={filters.name} onChange={handleInputChange} />
              <label htmlFor="id" className={classes.labelText}>ID</label>
              <input className={classes.inputText} type="text" name="id" placeholder="ID" value={filters.id} onChange={handleInputChange} />
              <label htmlFor="id" className={classes.labelText}>부서</label>
              <input className={classes.inputText} type="text" name="department" placeholder="부서" value={filters.department} onChange={handleInputChange} />
              <label htmlFor="position" className={classes.labelText}>직책</label>
              <input className={classes.inputText} type="text" name="position" placeholder="직책" value={filters.position} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="name" className={classes.labelText}>출/퇴</label>
              <input className={classes.inputText} type="text" name="entering" placeholder="출/퇴" value={filters.entering} onChange={handleInputChange} />
              <label htmlFor="name" className={classes.labelText}>startDate</label>
              <input className={classes.inputText} type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} />
              <label htmlFor="name" className={classes.labelText}>endDate</label>
              <input className={classes.inputText} type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} />
              <label htmlFor="name" className={classes.labelText}>startTime</label>
              <input className={classes.inputText} type="time" name="startTime" value={filters.startTime} onChange={handleInputChange} />
              <label htmlFor="name" className={classes.labelText}>endTime</label>
              <input className={classes.inputText} type="time" name="endTime" value={filters.endTime} onChange={handleInputChange} />
              <label htmlFor="name" className={classes.labelText}>securityIssue</label>
              <input className={classes.inputText} type="text" name="issue" placeholder="보안 이슈" value={filters.issue} onChange={handleInputChange} />
            </div>
            <button type="submit" className={classes.formButton}>검색</button>
          </form>
        </div>
      </div>
      <div className={classes.listContainer}>
      <div className={classes.listTitle}>
          전체 이슈 로그
      </div>
      <div className={classes.logCount}>
          {filteredLogsCount} / {totalLogsCount}
      </div>

      <table className={classes.logTable}>
        <thead>
          <tr>
            <th>기기</th>
            <th>ID</th>
            <th>이름</th>
            <th>부서</th>
            <th>직책</th>
            <th>날짜</th>
            <th>시간</th>
            <th>출/퇴</th>
            <th>보안 이슈</th>
            <th>발급 개수</th>
            <th>자세히</th>
          </tr>
        </thead>
        <tbody>
          {displayedLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.gate}</td>
              <td>{log.id}</td>
              <td>{log.name}</td>
              <td>{log.department}</td>
              <td>{log.position}</td>
              <td>{log.date}</td>
              <td>{log.time}</td>
              <td>{log.entering}</td>
              <td>{log.issue}</td>
              <td>{log.sticker_number}</td>
              <td><button onClick={() => handleShowModal(log)}>자세히</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onClose={handleCloseModal} log={selectedLog} />
      <div className={classes.moreButtonContainer}>
        {visibleCount < filteredLogs.length && (
          <button onClick={handleLoadMore} className={classes.moreButton}>▼  더보기</button>
        )}
      </div>

    </div>
    </div>
  );
}

export default LogTable;