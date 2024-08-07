import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toggleDarkMode } from '../../store/theme';
import { toggleEnglish } from '../../store/language';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import lightClasses from './Settings.module.css';
import darkClasses from './SettingsDark.module.css';

function Settings() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const classes = isDarkMode ? darkClasses : lightClasses;

  const isEnglish = useSelector((state) => state.language.isEnglish);
  const { i18n, t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSettings = () => {
    setIsOpen(!isOpen);
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleEnglishToggle = () => {
    const newLanguage = isEnglish ? 'ko' : 'en';
    i18n.changeLanguage(newLanguage);
    dispatch(toggleEnglish());
  };

  return (
    <div>
      <button className={classes.settingsButton} onClick={handleToggleSettings}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      <div className={`${classes.settingsPanel} ${isOpen ? classes.open : ''}`}>
        <div className={classes.subTitle}>화면</div>
        <span className={classes.settingTitle} onClick={handleDarkModeToggle}>
          {isDarkMode ? t('Light Mode') : t('Dark Mode')}
        </span>
        <div className={classes.subTitle}>언어</div>
        <span className={classes.settingTitle} onClick={handleEnglishToggle}>
          {isEnglish ? t('Korean') : t('English')}
        </span>
      </div>
    </div>
  );
}

export default Settings;
