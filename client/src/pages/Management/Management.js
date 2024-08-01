import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classes from './Management.module.css';
import detailIcon from '../../assets/List/Detail_icon.png'
import { fetchMembers, memberRegistration } from '../../store/management';

function Management() {
  const [selectedOption, setSelectedOption] = useState('direct');
  const [visibleCount, setVisibleCount] = useState(20);
  const [filters, setFilters] = useState({
    memberName: '',
    id: '',
    department: '',
    position: '',
    nfc: '',
    issueMin: '',
    issueMax: '',
  });
  const [filterCriteria, setFilterCriteria] = useState({
    memberName: '',
    id: '',
    department: '',
    position: '',
    nfc: '',
    issueMin: '',
    issueMax: '',
  });

  const [submitMemberData, setSubmitMemberData] = useState({
    memberName: '',
    // department: '',
    // position: '',
    phoneNumber: '',
    nfc: '',
    issueCount: '',
    profileImage: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleDetailClick = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const logs = useSelector((state) => state.management.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMembers())
  }, [dispatch]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleFilterChange = (event) => {
    const { id, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setFilterCriteria(filters);
    setVisibleCount(20);
  };

  const handleSubmitChange = (event) => {
    const { name, value } = event.target
    setSubmitMemberData({
      ...submitMemberData, [name]: value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataToSubmit = {
      ...submitMemberData, profileImage: submitMemberData.profileImage || 'aaa.jpg'
    }
    console.log(dataToSubmit)
    dispatch(memberRegistration(dataToSubmit))
  }

  const filteredLogs = logs.filter((log) => {
    return (
      (filterCriteria.memberName === '' || log.memberName.includes(filterCriteria.memberName)) &&
      (filterCriteria.id === '' || log.id.includes(filterCriteria.id)) &&
      (filterCriteria.department === '' || log.department.includes(filterCriteria.department)) &&
      (filterCriteria.position === '' || log.position.includes(filterCriteria.position)) &&
      (filterCriteria.nfc === '' || log.nfcUid.includes(filterCriteria.nfc)) &&
      (filterCriteria.issueMin === '' || log.issueCount >= parseInt(filterCriteria.issueMin)) &&
      (filterCriteria.issueMax === '' || log.issueCount <= parseInt(filterCriteria.issueMax))
    );
  });

  const displayedLogs = filteredLogs.slice(0, visibleCount);

  return (
    <div className={classes.mainContainer}>
      <div className={`${classes.filteringContainer} ${classes.relativeBoxContainer}`}>
        <div className={classes.filteringBox}>
            F I L T E R I N G
        </div>
        <div className={classes.inputContainer}> 
          <form onSubmit={handleSearch}>
            <div>
              <label htmlFor="memberName" className={classes.labelText}>이름</label>
              <input className={classes.inputText} type="text" id="memberName" placeholder="이 름" value={filters.memberName} onChange={handleFilterChange} />
              <label htmlFor="department" className={classes.labelText}>부서</label>
              <input className={classes.inputText} type="text" id="department" placeholder="부 서" value={filters.department} onChange={handleFilterChange} />
              <label htmlFor="position" className={classes.labelText}>직책</label>
              <input className={classes.inputText} type="text" id="position" placeholder="직 책" value={filters.position} onChange={handleFilterChange} />
            </div>
            <div>
              <label htmlFor="nfc" className={classes.labelText}>NFC</label>
              <input className={classes.inputText} type="text" id="nfc" placeholder="N F C" value={filters.nfc} onChange={handleFilterChange} />
              <label htmlFor="issueMin" className={classes.labelText}>누적 이슈(이상)</label>
              <input className={classes.inputText} type="number" id="issueMin" placeholder="이 상" value={filters.issueMin} onChange={handleFilterChange} />
              <label htmlFor="issueMax" className={classes.labelText}>누적 이슈(이하)</label>
              <input className={classes.inputText} type="number" id="issueMax" placeholder="이 하" value={filters.issueMax} onChange={handleFilterChange} />
            </div>
            <button type="submit" className={classes.formButton}>검 색</button>
          </form>
        </div>
      </div>
      <div className={`${classes.registrationContainer} ${classes.relativeBoxContainer}`}>
        <div className={classes.filteringBox}>
          N E W
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.optionLabel}>등록 옵션</div>
          <div className={classes.optionContainer}>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                value="direct"
                checked={selectedOption === 'direct'}
                onChange={handleOptionChange}
                className={classes.radioInput}
              />
              직접 등록하기
            </label>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                value="batch"
                checked={selectedOption === 'batch'}
                onChange={handleOptionChange}
                className={classes.radioInput}
              />
              일괄 등록하기
            </label>
          </div>
          <form onSubmit={handleSubmit}>
            {selectedOption === 'direct' ?  (
              <div>
                <div>
                  <label htmlFor="new memberName" className={classes.labelText}>이름</label>
                  <input className={classes.inputText} name="memberName" type="text" id="new memberName" placeholder="이 름" onChange={handleSubmitChange} />
                  <label htmlFor="new department" className={classes.labelText}>부서</label>
                  <input className={classes.inputText} name="department" type="number" id="new department" placeholder="부 서" onChange={handleSubmitChange} />
                  <label htmlFor="new position" className={classes.labelText}>직책</label>
                  <input className={classes.inputText} name="position" type="number" id="new position" placeholder="직 책" onChange={handleSubmitChange} />
                  <label htmlFor="new phoneNumber" className={classes.labelText}>연락처</label>
                  <input className={classes.inputText} name="phoneNumber" type="number" id="new phoneNumber" placeholder="연 락 처" onChange={handleSubmitChange} />
                </div>
                <div>
                  <label htmlFor="new nfc" className={classes.labelText}>NFC</label>
                  <input className={classes.inputText} name="nfc" type="text" id="new nfc" placeholder="N F C" onChange={handleSubmitChange} />
                  <label htmlFor="new cumulative issue" className={classes.labelText}>누적 이슈</label>
                  <input className={classes.inputText} name="issueCount" type="number" id="new cumulative issue" placeholder="누 적 이 슈" onChange={handleSubmitChange} />
                  <label htmlFor="new profile" className={classes.labelText}>프로필 사진 파일을 선택해 주세요!</label>
                  <input type="file" id="new profile" name="profileImage" placeholder="프로필 사진" onChange={handleSubmitChange} />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="new file" className={classes.labelText}>일괄 등록을 위해 파일을 선택해 주세요!</label>
                <input type="file" id="new file" placeholder='일괄 등록 파일' />
              </div>
            )}
            <button type="submit" className={classes.formButton}>등 록</button>
          </form>
        </div>  
      </div>
      <div className={classes.listContainer}>
        <div className={classes.listTitle}>
          등록 인원 목록
        </div>
        <div className={classes.tableContainer}>
          <table className={classes.logTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>부서</th>
                <th>직책</th>
                <th>연락처</th>
                <th>NFC UID</th>
                <th>누적 이슈</th>
                <th>프로필 사진</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.id}</td>
                  <td>{log.memberName}</td>
                  <td>{log.department}</td>
                  <td>{log.position}</td>
                  <td>{log.phoneNumber}</td>
                  <td>{log.nfcUid}</td>
                  <td>{log.issueCount}</td>
                  <td>
                    <img src={detailIcon}
                    alt="detail_icon"
                    className={classes.listIcon}
                    onClick={() => handleDetailClick(log)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={classes.moreButtonContainer}>
        {visibleCount < filteredLogs.length && (
          <button onClick={handleLoadMore} className={classes.moreButton}>▼  더보기</button>
        )}
        </div>
      </div>
      {isModalOpen && <Modal log={selectedLog} onClose={handleCloseModal} />}
    </div>
  );
}

const Modal = ({ log, onClose }) => {
  if (!log) return null;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={classes.modal} onClick={handleBackgroundClick}>
      <div className={classes.modalContent}>
        <span className={classes.close} onClick={onClose}>&times;</span>
        <h2>{log.memberName}</h2>
        <p>부서: {log.department}</p>
        <p>직책: {log.position}</p>
        <p>자세히: {log.memberProfile}</p>
      </div>
    </div>
  );
};


export default Management;
