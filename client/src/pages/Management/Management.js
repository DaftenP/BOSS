import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import lightClasses from './Management.module.css';
import darkClasses from './ManagementDark.module.css';
import detailIcon from '../../assets/List/Detail_icon.png';
import detailIconDarkMode from '../../assets/List/Detail_icon_darkmode.png';
import normalProfile from '../../assets/List/Normal_profile_image.png';
import ascendingIcon  from '../../assets/List/Ascending_icon.png';
import ascendingIconDark  from '../../assets/List/Ascending_icon_darkmode.png';
import descendingIcon  from '../../assets/List/Descending_icon.png';
import descendingIconDark from '../../assets/List/Descending_icon_darkmode.png';


import { fetchMembers, memberRegistration, fetchFilteredMember } from '../../store/management';
import { fetchDepartmentLists } from '../../store/department';
import { fetchPositionLists } from '../../store/position';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Management() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const currentDetailIcon = isDarkMode ? detailIconDarkMode : detailIcon;

  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState('direct');
  const [selectedSearchOption, setSelectedSearchOption] = useState('quick')
  const [isDepartmentDirect, setIsDepartmentDirect] = useState(false)
  const [isPositionDirect, setIsPositionDirect] = useState(false)
  const [departmentDirect, setDepartmentDirect] = useState('')
  const [positionDirect, setPositionDirect] = useState('')
  const [visibleCount, setVisibleCount] = useState(20);
  const fileInputRef = useRef(null);
  const [filters, setFilters] = useState({
    name: '',
    departmentName: '',
    positionName: '',
    nfc: '',
    issue: '',
  });

  const [submitMemberData, setSubmitMemberData] = useState({
    name: '',
    departmentId: '',
    departmentName: '',
    positionId: '',
    positionName: '',
    phoneNumber: '',
    nfc: '',
    profileImage: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleDetailClick = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSearchOptionChange = (event) => {
    setSelectedSearchOption(event.target.value)
  }

  const logsData = useSelector((state) => state.management.data);
  const departmentLists = useSelector((state) => state.department.data)
  const positionLists = useSelector((state) => state.position.data)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDepartmentLists());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPositionLists());
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
    dispatch(fetchFilteredMember(filteredFilters));
    setFilters({
      name: '',
      departmentName: '',
      positionName: '',
      nfc: '',
      issue: '',
    });
  };

  const handleSubmitChange = (event) => {
    const { name, id, value, type, files } = event.target;
    if (type === 'file') {
      const file = files[0];
      setSubmitMemberData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      if (name === 'department') {
        if (id === 'departmentSelect') {
          if (value === 'direct') {
            setIsDepartmentDirect(true)
            setSubmitMemberData((prevState) => ({
              ...prevState,
              departmentId: -1,
              departmentName: t('Enter Department Directly', '부서 직접 입력하기'),
            }))
          } else {
            const selectedOption = event.target.options[event.target.selectedIndex].text
            setIsDepartmentDirect(false)
            setDepartmentDirect('')
            setSubmitMemberData((prevState) => ({
              ...prevState,
              departmentId: Number(value),
              departmentName: selectedOption,
            }))
          }
        }
      } else if (name === 'position') {
        if (id === 'positionSelect') {
          if (value === 'direct') {
            setIsPositionDirect(true)
            setSubmitMemberData((prevState) => ({
              ...prevState,
              positionId: -1,
              positionName: t('Enter Position Directly', '부서 직접 입력하기')
            }))
          } else {
            const selectedOption = event.target.options[event.target.selectedIndex].text;
            setIsPositionDirect(false)
            setPositionDirect('')
            setSubmitMemberData((prevState) => ({
              ...prevState,
              positionId: Number(value),
              positionName: selectedOption
            }))
          }
        }
      } else {
        const processedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
        setSubmitMemberData((prevState) => ({
          ...prevState,
          [name]: processedValue,
        }));
      }
    }
  };

  const handleDirectSubmitChange = (event) => {
    const { name, value } = event.target;
    if (name === 'department') {
      setDepartmentDirect(value)
      setSubmitMemberData((prevState) => ({
        ...prevState,
        departmentId: -1,
        departmentName: value,
      }))
    } else if (name === 'position') {
      setPositionDirect(value)
      setSubmitMemberData((prevState) => ({
        ...prevState,
        positionId: -1,
        positionName: value,
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitMemberData.profileImage && !['image/jpg', 'image/jpeg', 'image/png'].includes(submitMemberData.profileImage.type)) {
      Swal.fire({
        icon: 'error',
        title: `<strong>${t('invalidFormat', '유효하지 않은 형식입니다!')}</strong>`,
        html: `<b>${t('selectValidFile', 'JPG, JPEG, PNG')} ${t('file', '파일을 첨부해주세요!')}</b>`
      });
      return;
    }

    const formData = new FormData();

    if (submitMemberData.profileImage) {
      formData.append('profileImage', submitMemberData.profileImage);
    } else {
      const response = await fetch(normalProfile);
      const blob = await response.blob();
      const file = new File([blob], 'normal_profile_image.png', { type: 'image/png' });
      formData.append('profileImage', file);
    }

    const memberRegistDto = {
      phoneNumber: submitMemberData.phoneNumber,
      name: submitMemberData.name,
      nfc: submitMemberData.nfc,
      departmentId: submitMemberData.departmentId,
      departmentName: submitMemberData.departmentName,
      positionId: submitMemberData.positionId,
      positionName: submitMemberData.positionName,
      memberLoginId: 'ssafy',
      memberLoginPw: 'ssafy1234!',
    };

    formData.append('memberRegistDto', new Blob([JSON.stringify(memberRegistDto)], { type: 'application/json' }));

    try {
      await dispatch(memberRegistration(formData)).unwrap();

      setSubmitMemberData({
        name: '',
        departmentId: '',
        departmentName: '',
        positionId: '',
        positionName: '',
        phoneNumber: '',
        nfc: '',
        profileImage: null,
      });
      setDepartmentDirect('')
      setPositionDirect('')

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  // ascending: 오름차순(1, 2, 3...), descending: 내림차순(5, 4, 3...)
  const [sortConfig, setSortConfig] = useState({ key: 'memberId', direction: 'descending' })
  const sortedLogs = useMemo(() => {
    const sortableLogs = [...(logsData || [])]
    sortableLogs.sort((a, b) => {
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      return 0
    })
    return sortableLogs
  }, [logsData, sortConfig])

  // ascending일 때 누르면 descending으로, descending일 때 누르면 asending으로 변경, key는 그대로 
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction })
  }
  
  const displayedLogs = sortedLogs.slice(0, visibleCount);
  const totalLogsCount = logsData.length;

  return (
    <div className={classes.mainContainer}>
      <div className={`${classes.registrationContainer} ${classes.relativeBoxContainer}`}>
        <div className={classes.filteringBox}>
          {t('NEW', 'NEW')}
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.optionLabel}>{t('registrationOptions', '등록 옵션')}</div>
          <div className={classes.optionContainer}>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                value="direct"
                checked={selectedOption === 'direct'}
                onChange={handleOptionChange}
                className={classes.radioInput}
              />
              {t('directRegistration', '직접 등록하기')}
            </label>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                value="batch"
                checked={selectedOption === 'batch'}
                onChange={handleOptionChange}
                className={classes.radioInput}
              />
              {t('batchRegistration', '일괄 등록하기')}
            </label>
          </div>
          <form onSubmit={handleSubmit} className={classes.relativeBoxContainer}>
            {selectedOption === 'direct' ? (
              <table className={classes.filterTable}>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="new memberName" className={classes.labelText}>{t('Name', '이름')}</label>
                      <input className={classes.inputText} name="name" type="text" id="new memberName" value={submitMemberData.name} placeholder={t('Name', '이름')} onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new phoneNumber" className={classes.labelText}>{t('phoneNumber', '연락처')}</label>
                      <input className={classes.inputText} name="phoneNumber" type="number" id="new phoneNumber" value={submitMemberData.phoneNumber} placeholder={t('phoneNumber', '연락처')} onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new nfc" className={classes.labelText}>{t('NFC', 'NFC')}</label>
                      <input className={classes.inputText} name="nfc" type="text" id="new nfc" value={submitMemberData.nfc} placeholder={t('NFC', 'NFC')} onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new profile" className={classes.labelText}>{t('selectProfileImage', '프로필 사진 파일을 선택해 주세요!')}</label>
                      <input className={classes.hiddenFileInput} type="file" id="new profile" name="profileImage" placeholder={t('profileImage', '프로필 사진')} accept='.jpg, .jpeg, .png' onChange={handleSubmitChange} ref={fileInputRef} />
                      <button type="button" onClick={handleFileInputClick} className={classes.customFileInput}>
                        {t('selectFile', '파일 선택')}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="departmentSelect" className={classes.labelText}>{t('Department', '부서')}</label>
                      <select className={classes.inputText} name ="department" id="departmentSelect" value={submitMemberData.departmentId} onChange={handleSubmitChange}>
                        <option value="">
                          {isDepartmentDirect ? t('Enter Department Directly', '부서 직접 입력하기') : t('Select Department', '부서 선택')}
                        </option>
                        {departmentLists.map((department) => (
                          <option key={department.departmentId} value={department.departmentId}>
                            {department.departmentName}
                          </option>
                        ))}
                        <option value="direct">{t('Enter Department Directly', '부서 직접 입력하기')}</option>
                      </select>
                    </td>
                    <td>
                      <label htmlFor="departmentDirect" className={classes.labelText}>{t('Enter Department Directly', '부서 직접 입력하기')}</label>
                      <input className={`${classes.inputText} ${!isDepartmentDirect ? classes.disabledInput : ''}`} name="department" type="text" id="departmentDirect" placeholder={t('Department', '부서')} value={departmentDirect} onChange={handleDirectSubmitChange} disabled={!isDepartmentDirect}/>
                    </td>
                    <td>
                      <label htmlFor="positionSelect" className={classes.labelText}>{t('Position', '직책')}</label>
                      <select className={classes.inputText} name="position" id="positionSelect" value={submitMemberData.positionId} onChange={handleSubmitChange}>
                        <option value="">
                          {isDepartmentDirect ? t('Enter Position Directly', '부서 직접 입력하기') : t('Select Position', '직책 선택')}
                        </option>
                        {positionLists.map((position) => (
                          <option key={position.positionId} value={position.positionId}>
                            {position.positionName}
                          </option>
                        ))}
                        <option value="direct">{t('Enter Position Directly', '직책 직접 입력하기')}</option>
                      </select>
                    </td>
                    <td>
                      <label htmlFor="positionDirect" className={classes.labelText}>{t('Enter Position Directly', '직책 직접 입력하기')}</label>
                      <input className={`${classes.inputText} ${!isPositionDirect ? classes.disabledInput : ''}`} name="position" type="text" id="positionDirect" placeholder={t('Position', '직책')} value={positionDirect} onChange={handleDirectSubmitChange} disabled={!isPositionDirect}/>
                    </td>
                    <td className={classes.buttonCell}>
                      <br />
                      <button type="submit" className={classes.formButton}>{t('Register', '등 록')}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>
                <label htmlFor="new file" className={classes.labelText}>{t('selectBatchFile', '일괄 등록을 위해 파일을 선택해 주세요!')}</label>
                <input className={classes.hiddenFileInput} type="file" id="new file" placeholder={t('batchFile', '일괄 등록 파일')} />
                <button type="button" onClick={handleFileInputClick} className={classes.customFileInput}>
                  {t('selectFile', '파일 선택')}
                </button>
                <button type="submit" className={classes.formButton}>{t('Register', '등 록')}</button>
              </div>
            )}
          </form>
        </div>  
      </div>
      
      <div className={`${classes.filteringContainer} ${classes.relativeBoxContainer}`}>
        <div className={classes.filteringBox}>
          {t('FILTERING', 'FILTERING')}
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
          <form onSubmit={handleSearch} className={classes.relativeBoxContainer}>
            {selectedSearchOption === 'quick' ? (
              <table className={classes.filterTable}>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="name" className={classes.labelText}>{t('Name', '이름')}</label>
                      <input className={classes.inputText} type="text" id="name" placeholder={t('Name', '이름')} value={filters.name} onChange={handleFilterChange} />
                    </td>
                    <td className={classes.buttonCell}>
                      <br />
                      <button type="submit" className={classes.formButton}>{t('Search', '검 색')}</button>
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
                      <label htmlFor="name" className={classes.labelText}>{t('Name', '이름')}</label>
                      <input className={classes.inputText} type="text" id="name" placeholder={t('Name', '이름')} value={filters.name} onChange={handleFilterChange} />
                    </td>
                    <td>
                      <label htmlFor="nfc" className={classes.labelText}>{t('NFC', 'NFC')}</label>
                      <input className={classes.inputText} type="text" id="nfc" placeholder={t('NFC', 'NFC')} value={filters.nfc} onChange={handleFilterChange} />
                    </td>
                    <td>
                      <label htmlFor="issue" className={classes.labelText}>{t('Issues', '누적 이슈')}</label>
                      <input className={classes.inputText} type="number" id="issue" placeholder={t('Issues', '누적 이슈')} value={filters.issue} onChange={handleFilterChange} />
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.tdCell}>
                      <br />
                      <div>{t('Job Info', '직무 정보')}</div>
                    </td>
                    <td>
                      <label htmlFor="department" className={classes.labelText}>{t('Department', '부서')}</label>
                      <select className={classes.inputText} name="department" id="departmentName" value={filters.departmentName} onChange={handleFilterChange}>
                        <option value="">{t('Select Department', '부서 선택')}</option>
                        {departmentLists.map((department) => (
                          <option key={department.departmentId} value={department.departmentName}>
                            {department.departmentName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <label htmlFor="position" className={classes.labelText}>{t('Position', '직책')}</label>
                      <select className={classes.inputText} name='position' id='positionName' value={filters.positionName} onChange={handleFilterChange}>
                        <option value="">{t('Select Position', '직책 선택')}</option>
                        {positionLists.map((position) => (
                          <option key={position.positionId} value={position.positionName}>
                            {position.positionName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={classes.buttonCell}>
                      <br />
                      <button type="submit" className={classes.formButton}>{t('Search', '검 색')}</button>
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
          {t('registeredMembersList', '등록 인원 목록')}
        </div>
        <div className={classes.logCount}>
          {t('currentViewCount', '현재 조회 인원')} : {totalLogsCount}{t('people', '명')}
        </div>
        <div className={classes.tableContainer}>
          <table className={classes.logTable}>
            <thead>
              <tr>
                <th className={classes.relativeBoxContainer}>
                  {t('Member ID', '이용자 ID')}
                  <span
                    className={classes.sortIconWrapper}
                    data-direction={sortConfig.key === 'memberId' && sortConfig.direction === 'ascending' ? t('Sort: Ascending') : t('Sort: Descending')}
                    onClick={() => requestSort('memberId')}
                  >
                    {isDarkMode ? (
                      <span>
                        {sortConfig.key === 'memberId' && sortConfig.direction === 'ascending' ? (
                          <img className={classes.sortIcon} src={ascendingIconDark} art="ascending_icon_dark" />
                        ) : (
                          <img className={classes.sortIcon} src={descendingIconDark} art="dscending_icon_dark" />
                        )}
                      </span>
                      ) : (
                      <span>
                        {sortConfig.key === 'memberId' && sortConfig.direction === 'ascending' ? (
                          <img className={classes.sortIcon} src={ascendingIcon} art="ascending_icon" />
                        ) : (
                          <img className={classes.sortIcon} src={descendingIcon} art="dscending_icon" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
                <th>{t('Name', '이름')}</th>
                <th>{t('Department', '부서')}</th>
                <th>{t('Position', '직책')}</th>
                <th>{t('phoneNumber', '연락처')}</th>
                <th>NFC UID</th>
                <th className={classes.relativeBoxContainer}>
                  {t('Issues', '누적 이슈')}
                  <span
                    className={classes.sortIconWrapper}
                    data-direction={sortConfig.key === 'issueCount' && sortConfig.direction === 'ascending' ? t('Sort: Ascending') : t('Sort: Descending')}
                    onClick={() => requestSort('issueCount')}
                  >
                    {isDarkMode ? (
                      <span>
                        {sortConfig.key === 'issueCount' && sortConfig.direction === 'ascending' ? (
                          <img className={classes.sortIcon} src={ascendingIconDark} art="ascending_icon_dark" />
                        ) : (
                          <img className={classes.sortIcon} src={descendingIconDark} art="dscending_icon_dark" />
                        )}
                      </span>
                      ) : (
                      <span>
                        {sortConfig.key === 'issueCount' && sortConfig.direction === 'ascending' ? (
                          <img className={classes.sortIcon} src={ascendingIcon} art="ascending_icon" />
                        ) : (
                          <img className={classes.sortIcon} src={descendingIcon} art="dscending_icon" />
                        )}
                      </span>
                      )}
                    </span>
                </th>
                <th>{t('profileImage', '프로필 사진')}</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.memberId}</td>
                  <td>{log.name}</td>
                  <td>{log.department.departmentName}</td>
                  <td>{log.position.positionName}</td>
                  <td>{log.phoneNumber}</td>
                  <td>{log.nfc}</td>
                  <td>
                    {log.issueCount === 0 ? (
                      <div className={classes.noIssue}>{log.issueCount}</div>
                    ) : (
                    <div className={classes.issueDetected}>{log.issueCount}</div>
                    )}
                  </td>
                  <td>
                    <img src={currentDetailIcon}
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
            <button onClick={handleLoadMore} className={classes.moreButton}>{t('Load More', '더보기')}</button>
          )}
        </div>
      </div>
      {isModalOpen && <Modal log={selectedLog} onClose={handleCloseModal} />}
    </div>
  );
}

const Modal = ({ log, onClose }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const { t } = useTranslation();

  if (!log) return null;

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={classes.modal} onClick={handleBackgroundClick}>
      <div className={classes.modalContent}>
        <span className={classes.close} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
        <div className={classes.profileSection}>
          <img src={log.profileImage} alt={`${log.name}'s profile`} className={classes.profileImage} />
        </div>
        <div className={classes.detailBox}>
          <div className={classes.subInfo}>{t('Name', '이름')}</div>
          <div className={classes.name}>{log.name}</div>
          <div className={classes.subInfo}>{t('Department & Position', '부서 & 직책')}</div>
          <div className={classes.department}>{log.department.departmentName} | {log.position.positionName}</div>
          <div className={classes.subInfo}>{t('phoneNumber', '전화번호')}</div>
          <div className={classes.phoneNumber}>{log.phoneNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default Management;
