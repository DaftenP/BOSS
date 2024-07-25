import React, { useState } from 'react';
import classes from './Loglist.module.css';

const logsData = [
  // This data should be replaced with your actual log data
  {'device': 2, 'id': '성춘향4871', 'name': '성춘향', 'department': 'OO마케팅', 'position': '대리', 'date': '2024-07-01', 'time': '15:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 5, 'id': '이성계9950', 'name': '이성계', 'department': 'OO마케팅', 'position': '부장', 'date': '2024-07-02', 'time': '10:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '유관순7735', 'name': '유관순', 'department': 'OO제품 디자인팀', 'position': '차장', 'date': '2024-07-03', 'time': '18:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '이순신5798', 'name': '이순신', 'department': 'OO마케팅', 'position': '과장', 'date': '2024-07-03', 'time': '21:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 1, 'id': '장보고5664', 'name': '장보고', 'department': 'OO기술 연구소', 'position': '차장', 'date': '2024-07-01', 'time': '11:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 7, 'id': '이몽룡2684', 'name': '이몽룡', 'department': 'OO제품 디자인팀', 'position': '대리', 'date': '2024-07-01', 'time': '17:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 1, 'id': '홍길동3176', 'name': '홍길동', 'department': 'OO마케팅', 'position': '과장', 'date': '2024-07-02', 'time': '16:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 4, 'id': '유관순8359', 'name': '유관순', 'department': 'OO마케팅', 'position': '사원', 'date': '2024-07-02', 'time': '18:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 4, 'id': '정약용8681', 'name': '정약용', 'department': 'OO기술 연구소', 'position': '대리', 'date': '2024-07-02', 'time': '10:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 1, 'id': '이성계1599', 'name': '이성계', 'department': 'OO마케팅', 'position': '부장', 'date': '2024-07-02', 'time': '16:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '변학도3866', 'name': '변학도', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-03', 'time': '18:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 8, 'id': '유관순1245', 'name': '유관순', 'department': 'OO인사팀', 'position': '부장', 'date': '2024-07-03', 'time': '14:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 9, 'id': '강감찬3384', 'name': '강감찬', 'department': 'OO인사팀', 'position': '부장', 'date': '2024-07-02', 'time': '16:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 2, 'id': '최영5522', 'name': '최영', 'department': 'OO기술 연구소', 'position': '사원', 'date': '2024-07-03', 'time': '15:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '성춘향2333', 'name': '성춘향', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-02', 'time': '15:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 8, 'id': '유관순9024', 'name': '유관순', 'department': 'OO엔진 개발 및 설계', 'position': '사원', 'date': '2024-07-02', 'time': '15:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 4, 'id': '세종대왕3686', 'name': '세종대왕', 'department': 'OO인사팀', 'position': '과장', 'date': '2024-07-01', 'time': '18:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 3, 'id': '이성계2389', 'name': '이성계', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-01', 'time': '17:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 4, 'id': '이성계7680', 'name': '이성계', 'department': 'OO제품 디자인팀', 'position': '대리', 'date': '2024-07-01', 'time': '18:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 10, 'id': '홍길동3938', 'name': '홍길동', 'department': 'OO기술 연구소', 'position': '차장', 'date': '2024-07-03', 'time': '19:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 10, 'id': '홍길동8477', 'name': '홍길동', 'department': 'OO기술 연구소', 'position': '과장', 'date': '2024-07-03', 'time': '16:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 10, 'id': '김삿갓4229', 'name': '김삿갓', 'department': 'OO제품 디자인팀', 'position': '차장', 'date': '2024-07-02', 'time': '19:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '이순신4912', 'name': '이순신', 'department': 'OO마케팅', 'position': '대리', 'date': '2024-07-03', 'time': '19:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 5, 'id': '임꺽정2951', 'name': '임꺽정', 'department': 'OO기술 연구소', 'position': '대리', 'date': '2024-07-03', 'time': '20:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 9, 'id': '세종대왕6801', 'name': '세종대왕', 'department': 'OO제품 디자인팀', 'position': '차장', 'date': '2024-07-02', 'time': '18:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '안중근9007', 'name': '안중근', 'department': 'OO기술 연구소', 'position': '차장', 'date': '2024-07-02', 'time': '13:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 5, 'id': '홍길동3899', 'name': '홍길동', 'department': 'OO엔진 개발 및 설계', 'position': '과장', 'date': '2024-07-01', 'time': '16:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 4, 'id': '장보고7447', 'name': '장보고', 'department': 'OO제품 디자인팀', 'position': '부장', 'date': '2024-07-03', 'time': '14:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 2, 'id': '변학도7047', 'name': '변학도', 'department': 'OO제품 디자인팀', 'position': '부장', 'date': '2024-07-03', 'time': '16:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 5, 'id': '박문수4865', 'name': '박문수', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-02', 'time': '14:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 7, 'id': '강감찬7953', 'name': '강감찬', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-03', 'time': '14:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 1, 'id': '홍길동6888', 'name': '홍길동', 'department': 'OO기술 연구소', 'position': '부장', 'date': '2024-07-01', 'time': '16:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '유관순1162', 'name': '유관순', 'department': 'OO제품 디자인팀', 'position': '대리', 'date': '2024-07-03', 'time': '11:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 6, 'id': '을지문덕8465', 'name': '을지문덕', 'department': 'OO마케팅', 'position': '사원', 'date': '2024-07-02', 'time': '12:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 4, 'id': '김유신6019', 'name': '김유신', 'department': 'OO엔진 개발 및 설계', 'position': '사원', 'date': '2024-07-02', 'time': '21:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 6, 'id': '강감찬9918', 'name': '강감찬', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-02', 'time': '13:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 4, 'id': '정약용6652', 'name': '정약용', 'department': 'OO기술 연구소', 'position': '사원', 'date': '2024-07-01', 'time': '11:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 6, 'id': '박문수2254', 'name': '박문수', 'department': 'OO기술 연구소', 'position': '과장', 'date': '2024-07-01', 'time': '13:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 5, 'id': '박문수2939', 'name': '박문수', 'department': 'OO기술 연구소', 'position': '부장', 'date': '2024-07-03', 'time': '11:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 9, 'id': '유관순9535', 'name': '유관순', 'department': 'OO엔진 개발 및 설계', 'position': '차장', 'date': '2024-07-02', 'time': '15:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '정약용9430', 'name': '정약용', 'department': 'OO마케팅', 'position': '과장', 'date': '2024-07-01', 'time': '09:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 4, 'id': '신사임당2573', 'name': '신사임당', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-01', 'time': '13:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 10, 'id': '윤봉길9458', 'name': '윤봉길', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-02', 'time': '09:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 8, 'id': '장보고1426', 'name': '장보고', 'department': 'OO기술 연구소', 'position': '대리', 'date': '2024-07-01', 'time': '17:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 6, 'id': '성춘향2661', 'name': '성춘향', 'department': 'OO인사팀', 'position': '대리', 'date': '2024-07-01', 'time': '14:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '박문수7099', 'name': '박문수', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-02', 'time': '19:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 5, 'id': '유관순6970', 'name': '유관순', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-01', 'time': '10:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '세종대왕5309', 'name': '세종대왕', 'department': 'OO마케팅', 'position': '사원', 'date': '2024-07-03', 'time': '19:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 1, 'id': '성춘향4517', 'name': '성춘향', 'department': 'OO기술 연구소', 'position': '부장', 'date': '2024-07-02', 'time': '17:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 9, 'id': '안중근7166', 'name': '안중근', 'department': 'OO인사팀', 'position': '대리', 'date': '2024-07-02', 'time': '09:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 4, 'id': '을지문덕4616', 'name': '을지문덕', 'department': 'OO제품 디자인팀', 'position': '차장', 'date': '2024-07-01', 'time': '11:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '김삿갓6544', 'name': '김삿갓', 'department': 'OO제품 디자인팀', 'position': '대리', 'date': '2024-07-03', 'time': '14:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 5, 'id': '정약용9939', 'name': '정약용', 'department': 'OO기술 연구소', 'position': '사원', 'date': '2024-07-03', 'time': '12:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '장보고7713', 'name': '장보고', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-02', 'time': '17:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 9, 'id': '세종대왕4237', 'name': '세종대왕', 'department': 'OO엔진 개발 및 설계', 'position': '사원', 'date': '2024-07-02', 'time': '15:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 8, 'id': '성춘향1975', 'name': '성춘향', 'department': 'OO기술 연구소', 'position': '차장', 'date': '2024-07-01', 'time': '16:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 7, 'id': '홍길동5384', 'name': '홍길동', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-03', 'time': '16:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 1, 'id': '홍길동7990', 'name': '홍길동', 'department': 'OO마케팅', 'position': '대리', 'date': '2024-07-02', 'time': '18:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 3, 'id': '김유신7265', 'name': '김유신', 'department': 'OO마케팅', 'position': '과장', 'date': '2024-07-03', 'time': '20:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 9, 'id': '이몽룡7725', 'name': '이몽룡', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-03', 'time': '15:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '이몽룡1266', 'name': '이몽룡', 'department': 'OO엔진 개발 및 설계', 'position': '과장', 'date': '2024-07-03', 'time': '11:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 9, 'id': '홍길동1229', 'name': '홍길동', 'department': 'OO엔진 개발 및 설계', 'position': '과장', 'date': '2024-07-01', 'time': '19:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 2, 'id': '이몽룡7474', 'name': '이몽룡', 'department': 'OO인사팀', 'position': '부장', 'date': '2024-07-01', 'time': '15:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 10, 'id': '이몽룡5730', 'name': '이몽룡', 'department': 'OO엔진 개발 및 설계', 'position': '사원', 'date': '2024-07-03', 'time': '14:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 4, 'id': '김유신5038', 'name': '김유신', 'department': 'OO엔진 개발 및 설계', 'position': '과장', 'date': '2024-07-02', 'time': '10:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 7, 'id': '김유신2180', 'name': '김유신', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-03', 'time': '14:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 5, 'id': '김유신4999', 'name': '김유신', 'department': 'OO기술 연구소', 'position': '과장', 'date': '2024-07-01', 'time': '16:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 3, 'id': '세종대왕4361', 'name': '세종대왕', 'department': 'OO제품 디자인팀', 'position': '과장', 'date': '2024-07-02', 'time': '21:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 7, 'id': '유관순8945', 'name': '유관순', 'department': 'OO마케팅', 'position': '과장', 'date': '2024-07-01', 'time': '17:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 3, 'id': '김유신6916', 'name': '김유신', 'department': 'OO기술 연구소', 'position': '과장', 'date': '2024-07-01', 'time': '10:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 4, 'id': '유관순3502', 'name': '유관순', 'department': 'OO엔진 개발 및 설계', 'position': '차장', 'date': '2024-07-03', 'time': '17:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 6, 'id': '홍길동9113', 'name': '홍길동', 'department': 'OO인사팀', 'position': '사원', 'date': '2024-07-01', 'time': '19:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 1, 'id': '장보고9830', 'name': '장보고', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-02', 'time': '14:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 3, 'id': '임꺽정7228', 'name': '임꺽정', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-03', 'time': '21:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 6, 'id': '변학도8435', 'name': '변학도', 'department': 'OO기술 연구소', 'position': '차장', 'date': '2024-07-03', 'time': '20:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 7, 'id': '윤봉길8477', 'name': '윤봉길', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-02', 'time': '11:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 6, 'id': '김삿갓8056', 'name': '김삿갓', 'department': 'OO마케팅', 'position': '대리', 'date': '2024-07-02', 'time': '10:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '박문수8109', 'name': '박문수', 'department': 'OO마케팅', 'position': '과장', 'date': '2024-07-02', 'time': '12:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 6, 'id': '성춘향3475', 'name': '성춘향', 'department': 'OO엔진 개발 및 설계', 'position': '대리', 'date': '2024-07-02', 'time': '15:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 3, 'id': '안중근7979', 'name': '안중근', 'department': 'OO마케팅', 'position': '차장', 'date': '2024-07-01', 'time': '09:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '성춘향3794', 'name': '성춘향', 'department': 'OO엔진 개발 및 설계', 'position': '과장', 'date': '2024-07-03', 'time': '17:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 5, 'id': '장보고1115', 'name': '장보고', 'department': 'OO엔진 개발 및 설계', 'position': '대리', 'date': '2024-07-03', 'time': '21:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 8, 'id': '이성계8073', 'name': '이성계', 'department': 'OO기술 연구소', 'position': '부장', 'date': '2024-07-02', 'time': '12:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 1, 'id': '성춘향1726', 'name': '성춘향', 'department': 'OO엔진 개발 및 설계', 'position': '대리', 'date': '2024-07-02', 'time': '13:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 2, 'id': '이순신5336', 'name': '이순신', 'department': 'OO엔진 개발 및 설계', 'position': '대리', 'date': '2024-07-03', 'time': '09:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 3, 'id': '김삿갓8747', 'name': '김삿갓', 'department': 'OO제품 디자인팀', 'position': '대리', 'date': '2024-07-02', 'time': '12:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 7, 'id': '변학도5623', 'name': '변학도', 'department': 'OO제품 디자인팀', 'position': '사원', 'date': '2024-07-03', 'time': '12:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 1, 'id': '세종대왕8465', 'name': '세종대왕', 'department': 'OO인사팀', 'position': '과장', 'date': '2024-07-02', 'time': '17:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 7, 'id': '윤봉길9375', 'name': '윤봉길', 'department': 'OO엔진 개발 및 설계', 'position': '차장', 'date': '2024-07-01', 'time': '10:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 4, 'id': '윤봉길7047', 'name': '윤봉길', 'department': 'OO엔진 개발 및 설계', 'position': '부장', 'date': '2024-07-01', 'time': '10:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 4, 'id': '을지문덕7597', 'name': '을지문덕', 'department': 'OO엔진 개발 및 설계', 'position': '대리', 'date': '2024-07-02', 'time': '14:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 9, 'id': '임꺽정2865', 'name': '임꺽정', 'department': 'OO엔진 개발 및 설계', 'position': '과장', 'date': '2024-07-02', 'time': '20:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 2},
  {'device': 10, 'id': '세종대왕3678', 'name': '세종대왕', 'department': 'OO기술 연구소', 'position': '부장', 'date': '2024-07-01', 'time': '09:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 10, 'id': '세종대왕3646', 'name': '세종대왕', 'department': 'OO엔진 개발 및 설계', 'position': '대리', 'date': '2024-07-01', 'time': '19:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 1},
  {'device': 7, 'id': '김삿갓4322', 'name': '김삿갓', 'department': 'OO제품 디자인팀', 'position': '부장', 'date': '2024-07-03', 'time': '13:00:00', 'status': '출', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 10, 'id': '강감찬7856', 'name': '강감찬', 'department': 'OO엔진 개발 및 설계', 'position': '차장', 'date': '2024-07-02', 'time': '18:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 4, 'id': '임꺽정8335', 'name': '임꺽정', 'department': 'OO엔진 개발 및 설계', 'position': '차장', 'date': '2024-07-02', 'time': '17:00:00', 'status': '퇴', 'securityIssue': 'F', 'issueCount': 3},
  {'device': 6, 'id': '홍길동3031', 'name': '홍길동', 'department': 'OO기술 연구소', 'position': '차장', 'date': '2024-07-01', 'time': '18:00:00', 'status': '퇴', 'securityIssue': 'P', 'issueCount': 0},
  {'device': 8, 'id': '성춘향9660', 'name': '성춘향', 'department': 'OO엔진 개발 및 설계', 'position': '대리', 'date': '2024-07-01', 'time': '14:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 4},
  {'device': 3, 'id': '김유신9687', 'name': '김유신', 'department': 'OO기술 연구소', 'position': '대리', 'date': '2024-07-03', 'time': '18:00:00', 'status': '출', 'securityIssue': 'F', 'issueCount': 3},
    // Add more log data here
];

const Modal = ({ show, onClose, log }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={classes.modalBackdrop}>
      <div className={classes.modalContent}>
        {/* 예시 이미지 두 개를 출력합니다. 실제 이미지 URL로 교체하세요. */}
        <p className={classes.modalContent}><strong>{log.date}  {log.time}  {log.name}</strong> </p>

        <img src="https://via.placeholder.com/200" alt="Image 1" />
        <img src="https://via.placeholder.com/200" alt="Image 2" />
        <div><button onClick={onClose}>닫기</button></div>

        
      </div>
    </div>
  );
};

function LogTable() {
  const [filteredLogs, setFilteredLogs] = useState(logsData);
  const [filters, setFilters] = useState({
    name: '',
    id: '',
    department: '',
    position: '',
    status: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    securityIssue: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleFilter = (event) => {
    let tempLogs = logsData;

    event.preventDefault();
    if (filters.name) {
      tempLogs = tempLogs.filter(log => log.name.includes(filters.name));
    }
    if (filters.id) {
      tempLogs = tempLogs.filter(log => log.id.includes(filters.id));
    }
    if (filters.department) {
      tempLogs = tempLogs.filter(log => log.department.includes(filters.department));
    }
    if (filters.position) {
      tempLogs = tempLogs.filter(log => log.position.includes(filters.position));
    }
    if (filters.status) {
      tempLogs = tempLogs.filter(log => log.status.includes(filters.status));
    }
    if (filters.startDate) {
      tempLogs = tempLogs.filter(log => new Date(log.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      tempLogs = tempLogs.filter(log => new Date(log.date) <= new Date(filters.endDate));
    }
    if (filters.startTime) {
      tempLogs = tempLogs.filter(log => log.time >= filters.startTime);
    }
    if (filters.endTime) {
      tempLogs = tempLogs.filter(log => log.time <= filters.endTime);
    }
    if (filters.securityIssue) {
      tempLogs = tempLogs.filter(log => log.securityIssue.includes(filters.securityIssue));
    }

    setFilteredLogs(tempLogs);

    setFilters({
      name: '',
      id: '',
      department: '',
      position: '',
      status: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      securityIssue: ''
    });
  };

  const handleShowModal = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  return (
    <div className={classes.logTableContainer}>
      {showModal && <div className={classes.modalBackdrop}></div>}
      <div className={classes.filterContainer}>
        <form onSubmit={handleFilter}>
          <input type="text" name="name" placeholder="이름" value={filters.name} onChange={handleInputChange} />
          <input type="text" name="id" placeholder="ID" value={filters.id} onChange={handleInputChange} />
          <input type="text" name="department" placeholder="부서" value={filters.department} onChange={handleInputChange} />
          <input type="text" name="position" placeholder="직책" value={filters.position} onChange={handleInputChange} />
          <input type="text" name="status" placeholder="출/퇴" value={filters.status} onChange={handleInputChange} />
          <input type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} />
          <input type="time" name="startTime" value={filters.startTime} onChange={handleInputChange} />
          <input type="time" name="endTime" value={filters.endTime} onChange={handleInputChange} />
          <input type="text" name="securityIssue" placeholder="보안 이슈" value={filters.securityIssue} onChange={handleInputChange} />
          <button type="submit">검색</button>
        </form>
      </div>
      <table className={classes.logTable}>
        <thead>
          <tr>
            <th>기기</th>
            <th>ID</th>
            <th>이름</th>
            <th>부서</th>
            <th>직책</th>
            <th>날짜</th>
            <th>시간</th>
            <th>출/퇴</th>
            <th>보안 이슈</th>
            <th>발급 개수</th>
            <th>자세히</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.device}</td>
              <td>{log.id}</td>
              <td>{log.name}</td>
              <td>{log.department}</td>
              <td>{log.position}</td>
              <td>{log.date}</td>
              <td>{log.time}</td>
              <td>{log.status}</td>
              <td>{log.securityIssue}</td>
              <td>{log.issueCount}</td>
              <td><button onClick={() => handleShowModal(log)}>자세히</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onClose={handleCloseModal} log={selectedLog} />
    </div>
  );
}

export default LogTable;