import React from 'react';
import { useSelector } from 'react-redux';
import classes from './Statistics.module.css';
import DateStatistics from './DataStatistics';
import TotalStatistics from './TotalStatistics';
import SummaryStatistics from './SummaryStatistics';

function Statistics() {
  const loglist = useSelector(state => state.loglist.data);

  return (
    <div className={classes.statisticsContainer}>
      <DateStatistics loglist={loglist} />
      <TotalStatistics loglist={loglist} />
      <SummaryStatistics loglist={loglist} />
    </div>
  );
}

export default Statistics;
