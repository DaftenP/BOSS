import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import lightClasses from './Management.module.css';
import darkClasses from './ManagementDark.module.css';
import detailIcon from '../../assets/List/Detail_icon.png';
import normalProfile from '../../assets/List/Normal_profile_image.png';
import { fetchMembers, memberRegistration, fetchFilteredMember } from '../../store/management';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Management() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState('direct');
  const [visibleCount, setVisibleCount] = useState(20);
  const fileInputRef = useRef(null);
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    position: '',
    nfc: '',
    issue: '',
  });

  const [submitMemberData, setSubmitMemberData] = useState({
    name: '',
    departmentId: '',
    positionId: '',
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

  const logsData = useSelector((state) => state.management.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMembers());
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
      department: '',
      position: '',
      nfc: '',
      issue: '',
    });
  };

  const handleSubmitChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      const file = files[0];
      setSubmitMemberData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      const processedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
      setSubmitMemberData((prevState) => ({
        ...prevState,
        [name]: processedValue,
      }));
    }
  };

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
      positionId: submitMemberData.positionId,
      memberLoginId: 'aa',
      memberLoginPw: '11',
    };

    formData.append('memberRegistDto', new Blob([JSON.stringify(memberRegistDto)], { type: 'application/json' }));

    try {
      await dispatch(memberRegistration(formData)).unwrap();

      setSubmitMemberData({
        name: '',
        departmentId: '',
        positionId: '',
        phoneNumber: '',
        nfc: '',
        profileImage: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const displayedLogs = logsData.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(20);
  }, [logsData]);

  const totalLogsCount = logsData.length;

  return (
    <div className={classes.mainContainer}>
      <div className={`${classes.filteringContainer} ${classes.relativeBoxContainer}`}>
        <div className={classes.filteringBox}>
          {t('FILTERING', 'FILTERING')}
        </div>
        <div className={classes.inputContainer}> 
          <form onSubmit={handleSearch} className={classes.relativeBoxContainer}>
            <table className={classes.filterTable}>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="name" className={classes.labelText}>{t('Name', '이름')}</label>
                    <input className={classes.inputText} type="text" id="name" placeholder={t('Name', '이름')} value={filters.name} onChange={handleFilterChange} />
                  </td>
                  <td>
                    <label htmlFor="department" className={classes.labelText}>{t('Department', '부서')}</label>
                    <input className={classes.inputText} type="text" id="department" placeholder={t('Department', '부서')} value={filters.department} onChange={handleFilterChange} />
                  </td>
                  <td>
                    <label htmlFor="position" className={classes.labelText}>{t('Position', '직책')}</label>
                    <input className={classes.inputText} type="text" id="position" placeholder={t('Position', '직책')} value={filters.position} onChange={handleFilterChange} />
                  </td>
                  <td>
                    <label htmlFor="nfc" className={classes.labelText}>{t('NFC', 'NFC')}</label>
                    <input className={classes.inputText} type="text" id="nfc" placeholder={t('NFC', 'NFC')} value={filters.nfc} onChange={handleFilterChange} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="issue" className={classes.labelText}>{t('Issues', '누적 이슈')}</label>
                    <input className={classes.inputText} type="number" id="issue" placeholder={t('Issues', '누적 이슈')} value={filters.issue} onChange={handleFilterChange} />
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className={classes.submitButtonCell}>
                    <button type="submit" className={classes.formButton}>{t('Search', '검 색')}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
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
                      <label htmlFor="new department" className={classes.labelText}>{t('Department', '부서')}</label>
                      <input className={classes.inputText} name="departmentId" type="number" id="new department" value={submitMemberData.departmentId} placeholder={t('Department', '부서')} onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new position" className={classes.labelText}>{t('Position', '직책')}</label>
                      <input className={classes.inputText} name="positionId" type="number" id="new position" value={submitMemberData.positionId} placeholder={t('Position', '직책')} onChange={handleSubmitChange} />
                    </td>
                    <td>
                      <label htmlFor="new phoneNumber" className={classes.labelText}>{t('phoneNumber', '연락처')}</label>
                      <input className={classes.inputText} name="phoneNumber" type="number" id="new phoneNumber" value={submitMemberData.phoneNumber} placeholder={t('phoneNumber', '연락처')} onChange={handleSubmitChange} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="new nfc" className={classes.labelText}>{t('NFC', 'NFC')}</label>
                      <input className={classes.inputText} name="nfc" type="text" id="new nfc" value={submitMemberData.nfc} placeholder={t('NFC', 'NFC')} onChange={handleSubmitChange} />
                    </td>
                    <td colSpan="4">
                      <label htmlFor="new profile" className={classes.labelText}>{t('selectProfileImage', '프로필 사진 파일을 선택해 주세요!')}</label>
                      <input type="file" id="new profile" name="profileImage" placeholder={t('profileImage', '프로필 사진')} accept='.jpg, .jpeg, .png' onChange={handleSubmitChange} ref={fileInputRef} />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>
                <label htmlFor="new file" className={classes.labelText}>{t('selectBatchFile', '일괄 등록을 위해 파일을 선택해 주세요!')}</label>
                <input type="file" id="new file" placeholder={t('batchFile', '일괄 등록 파일')} />
              </div>
            )}
            <button type="submit" className={classes.formButton}>{t('Register', '등 록')}</button>
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
                <th>ID</th>
                <th>{t('Name', '이름')}</th>
                <th>{t('Department', '부서')}</th>
                <th>{t('Position', '직책')}</th>
                <th>{t('phoneNumber', '연락처')}</th>
                <th>NFC UID</th>
                <th>{t('Issues', '누적 이슈')}</th>
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
