import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLogs } from '../../store/loglist';
import classes from './Statistics.module.css';
import DateStatistics from './DataStatistics';
import TotalStatistics from './TotalStatistics';
import SummaryStatistics from './SummaryStatistics';

function Statistics() {
  const loglist = useSelector(state => state.loglist.data);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchLogs())
  }, [dispatch])
  
  return (
    <div className={classes.statisticsContainer}>
      <SummaryStatistics loglist={loglist} />
      <DateStatistics loglist={loglist} />
      <TotalStatistics loglist={loglist} />
    </div>
  );
}

export default Statistics;
