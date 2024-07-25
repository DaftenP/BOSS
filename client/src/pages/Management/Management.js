import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Management.module.css';

function Management() {
  const [selectedOption, setSelectedOption] = useState('direct');
  const [visibleCount, setVisibleCount] = useState(20);
  const [filters, setFilters] = useState({
    name: '',
    id: '',
    department: '',
    position: '',
    nfc: '',
    issueMin: '',
    issueMax: '',
  });
  const [filterCriteria, setFilterCriteria] = useState({
    name: '',
    id: '',
    department: '',
    position: '',
    nfc: '',
    issueMin: '',
    issueMax: '',
  });

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const logs = useSelector((state) => state.management.data);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilterCriteria(filters);
    setVisibleCount(20); // 검색 시 초기 표시 개수를 20으로 설정
  };

  const filteredLogs = logs.filter((log) => {
    return (
      (filterCriteria.name === '' || log.name.includes(filterCriteria.name)) &&
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
      <div className={classes.filteringContainer}>
        <div className={classes.filteringBoxContainer}>
          <div className={classes.filteringBox}>
            F I L T E R I N G
          </div>
        </div>
        <div className={classes.inputContainer}> 
          <form onSubmit={handleSearch}>
            <div>
              <label htmlFor="name" className={classes.labelText}>이름</label>
              <input className={classes.inputText} type="text" id="name" placeholder="이 름" value={filters.name} onChange={handleFilterChange} />
              <label htmlFor="id" className={classes.labelText}>ID</label>
              <input className={classes.inputText} type="text" id="id" placeholder="I  D" value={filters.id} onChange={handleFilterChange} />
              <label htmlFor="department" className={classes.labelText}>부서</label>
              <input className={classes.inputText} type="text" id="department" placeholder="부 서" value={filters.department} onChange={handleFilterChange} />
              <label htmlFor="position" className={classes.labelText}>직책</label>
              <input className={classes.inputText} type="text" id="position" placeholder="직 책" value={filters.position} onChange={handleFilterChange} />
            </div>
            <div>
              <label htmlFor="nfc" className={classes.labelText}>NFC</label>
              <input className={classes.inputText} type="text" id="nfc" placeholder="N F C" value={filters.nfc} onChange={handleFilterChange} />
              <label htmlFor="issueMin" className={classes.labelText}>누적 이슈 (이상)</label>
              <input className={classes.inputText} type="number" id="issueMin" placeholder="이 상" value={filters.issueMin} onChange={handleFilterChange} />
              <label htmlFor="issueMax" className={classes.labelText}>누적 이슈 (이하)</label>
              <input className={classes.inputText} type="number" id="issueMax" placeholder="이 하" value={filters.issueMax} onChange={handleFilterChange} />
            </div>
            <div>
              <button type="submit">검색</button>
            </div>
          </form>
        </div>
      </div>
      <div className={classes.registrationContainer}>
        <div className={classes.filteringBoxContainer}>
          <div className={classes.filteringBox}>
            N E W
          </div>
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
              <span className={classes.radioCustom}></span>
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
              <span className={classes.radioCustom}></span>
              일괄 등록하기
            </label>
          </div>
          <form action="">
            {selectedOption === 'direct' ?  (
              <div>
                <div>
                  <label htmlFor="new name" className={classes.labelText}>이름</label>
                  <input className={classes.inputText} type="text" id="new name" placeholder="이 름" />
                  <label htmlFor="new id" className={classes.labelText}>ID</label>
                  <input className={classes.inputText} type="text" id="new id" placeholder="I  D" />
                  <label htmlFor="new department" className={classes.labelText}>부서</label>
                  <input className={classes.inputText} type="text" id="new department" placeholder="부 서" />
                  <label htmlFor="new position" className={classes.labelText}>직책</label>
                  <input className={classes.inputText} type="text" id="new position" placeholder="직 책" />
                  <label htmlFor="new phone number" className={classes.labelText}>연락처</label>
                  <input className={classes.inputText} type="number" id="new phone number" placeholder="연 락 처" />
                </div>
                <div>
                  <label htmlFor="new nfc" className={classes.labelText}>NFC</label>
                  <input className={classes.inputText} type="text" id="new nfc" placeholder="N F C" />
                  <label htmlFor="new cumulative issue" className={classes.labelText}>누적 이슈</label>
                  <input className={classes.inputText} type="number" id="new cumulative issue" placeholder="누 적 이 슈" />
                  <label htmlFor="new profile" className={classes.labelText}>프로필 사진</label>
                  <input className={classes.inputText} type="file" id="new profile" placeholder="프로필 사진" />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="new file" className={classes.labelText}>일괄 등록 파일</label>
                <input className={classes.inputText} type="file" id="new file" placeholder='일괄 등록 파일' />
              </div>
            )}
            <div>
              <button>등 록</button>
            </div>
          </form>
        </div>  
      </div>
      <div className={classes.listContainer}>
        <div className={classes.listTitle}>
          등록 인원 목록
        </div>
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
              <th>자세히</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {displayedLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.id}</td>
                <td>{log.name}</td>
                <td>{log.department}</td>
                <td>{log.position}</td>
                <td>{log.phoneNumber}</td>
                <td>{log.nfcUid}</td>
                <td>{log.issueCount}</td>
                <td><button>자세히</button></td>
                <td><button>삭제</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleCount < filteredLogs.length && (
          <button onClick={handleLoadMore}>더 보기</button>
        )}
      </div>
    </div>
  );
}

export default Management;
