import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classes from './Management.module.css';
import detailIcon from '../../assets/List/Detail_icon.png'
import { fetchMembers, memberRegistration, fetchFilteredMember } from '../../store/management';

function Management() {
  const [selectedOption, setSelectedOption] = useState('direct');
  const [visibleCount, setVisibleCount] = useState(20);
  const [filters, setFilters] = useState({
    memberName: '',
    department: '',
    position: '',
    nfc: '',
    issueCount: '',
  });

  const [submitMemberData, setSubmitMemberData] = useState({
    name: '',
    department: '',
    position: '',
    phoneNumber: '',
    nfc: '',
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

  const logsData = useSelector((state) => state.management.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMembers())
  }, [dispatch]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleFilterChange = (event) => {
    const { id, value, type } = event.target;
    const processedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: processedValue,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const filteredFilters = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [key, value === '' ? null : value])
    );
    setVisibleCount(20);
    dispatch(fetchFilteredMember(filteredFilters))
    setFilters({
      memberName: '',
      id: '',
      department: '',
      position: '',
      nfc: '',
      issueCount: '',
    })
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
    dispatch(memberRegistration(dataToSubmit))
  }

  const displayedLogs = logsData.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(20);
  }, [logsData]);

  return (
    <div className={classes.mainContainer}>
      <div className={`${classes.filteringContainer} ${classes.relativeBoxContainer}`}>
        <div className={classes.filteringBox}>
            F I L T E R I N G
        </div>
        <div className={classes.inputContainer}> 
          <form onSubmit={handleSearch} className={classes.relativeBoxContainer}>
            <table className={classes.filterTable}>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="memberName" className={classes.labelText}>이름</label>
                    <input className={classes.inputText} type="text" id="memberName" placeholder="이 름" value={filters.memberName} onChange={handleFilterChange} />
                  </td>
                  <td>
                    <label htmlFor="department" className={classes.labelText}>부서</label>
                    <input className={classes.inputText} type="text" id="department" placeholder="부 서" value={filters.department} onChange={handleFilterChange} />
                  </td>
                  <td>
                    <label htmlFor="position" className={classes.labelText}>직책</label>
                    <input className={classes.inputText} type="text" id="position" placeholder="직 책" value={filters.position} onChange={handleFilterChange} />
                  </td>
                  <td>
                    <label htmlFor="nfc" className={classes.labelText}>NFC</label>
                    <input className={classes.inputText} type="text" id="nfc" placeholder="N F C" value={filters.nfc} onChange={handleFilterChange} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="issueCount" className={classes.labelText}>누적 이슈</label>
                    <input className={classes.inputText} type="number" id="issueCount" placeholder="누 적 이 슈" value={filters.issueCount} onChange={handleFilterChange} />
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className={classes.submitButtonCell}>
                    <button type="submit" className={classes.formButton}>검 색</button>
                  </td>
                </tr>
              </tbody>
            </table>
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
          <form onSubmit={handleSubmit} className={classes.relativeBoxContainer}>
            {selectedOption === 'direct' ?  (
              <table className={classes.filterTable}>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="new memberName" className={classes.labelText}>이름</label>
                      <input className={classes.inputText} name="name" type="text" id="new memberName" placeholder="이 름" onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new department" className={classes.labelText}>부서</label>
                      <input className={classes.inputText} name="department" type="text" id="new department" placeholder="부 서" onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new position" className={classes.labelText}>직책</label>
                      <input className={classes.inputText} name="position" type="text" id="new position" placeholder="직 책" onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new phoneNumber" className={classes.labelText}>연락처</label>
                      <input className={classes.inputText} name="phoneNumber" type="number" id="new phoneNumber" placeholder="연 락 처" onChange={handleSubmitChange} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="new nfc" className={classes.labelText}>NFC</label>
                      <input className={classes.inputText} name="nfc" type="text" id="new nfc" placeholder="N F C" onChange={handleSubmitChange} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <label htmlFor="new profile" className={classes.labelText}>프로필 사진 파일을 선택해 주세요!</label>
                      <input type="file" id="new profile" name="profileImage" placeholder="프로필 사진" onChange={handleSubmitChange} />
                    </td>
                  </tr>
                </tbody>
              </table>
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
                  <td>{log.departmentName}</td>
                  <td>{log.positionName}</td>
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
        {visibleCount < logsData.length && (
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
        <p>부서: {log.departmentName}</p>
        <p>직책: {log.positionName}</p>
        <p>자세히: {log.memberProfile}</p>
      </div>
    </div>
  );
};


export default Management;
