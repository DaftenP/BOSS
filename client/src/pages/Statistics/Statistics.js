import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Statistics.module.css';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

function Statistics() {
  return (
    <div className={classes.statisticsContainer}>
      <div className={classes.dateStatisticsContainer}>
        <div className={classes.relativeBoxContainer}>
          <div className={classes.statisticsTitleBox}>날짜별 통계</div>
        </div>
        <div className={classes.statisticsContent}>
          <div className={classes.dataSelectContainer}>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - X축</div>
              <div className={classes.dataSelectBox}>
                <div>일</div>
                <div>월</div>
                <div>주</div>
                <div>년</div>
              </div>
            </div>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - Y축</div>
              <div className={classes.dataSelectBox}>
                <div>적발 횟수</div>
                <div>통과 횟수</div>
              </div>
            </div>
          </div>
          <div>
            그래프 삽입 예정
          </div>
        </div>
      </div>
      <div className={classes.dateStatisticsContainer}>
        <div className={classes.relativeBoxContainer}>
          <div className={classes.statisticsTitleBox}>통합 통계</div>
        </div>
        <div className={classes.statisticsContent}>
          <div className={classes.dataSelectContainer}>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - X축</div>
              <div className={classes.dataSelectBox}>
                <div>일</div>
                <div>월</div>
                <div>주</div>
                <div>년</div>
              </div>
            </div>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - Y축</div>
              <div className={classes.dataSelectBox}>
                <div>적발 횟수</div>
                <div>통과 횟수</div>
              </div>
            </div>
          </div>
          <div>
            그래프 삽입 예정
          </div>
        </div>
      </div>
      <div className={classes.dateStatisticsContainer}>
        <div className={classes.relativeBoxContainer}>
          <div className={classes.statisticsTitleBox}>통계 요약</div>
        </div>
        <div className={classes.statisticsContent}>
          <div className={classes.dataSelectContainer}>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - X축</div>
              <div className={classes.dataSelectBox}>
                <div>일</div>
                <div>월</div>
                <div>주</div>
                <div>년</div>
              </div>
            </div>
            <div className={classes.axisSelectBox}>
              <div className={classes.axisSelectTitle}>선택 옵션 - Y축</div>
              <div className={classes.dataSelectBox}>
                <div>적발 횟수</div>
                <div>통과 횟수</div>
              </div>
            </div>
          </div>
          <div>
            그래프 삽입 예정
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
