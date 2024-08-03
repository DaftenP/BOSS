import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  times: faTimes,
};

const Icon = ({ icon, ...props }) => {
  const selectedIcon = iconMap[icon] || faTimes;
  return <FontAwesomeIcon icon={selectedIcon} {...props} />;
};

export default Icon;
