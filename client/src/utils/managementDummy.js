import { v4 as uuidv4 } from 'uuid';

export const generateManagementData = (count) => {
  const names = ["홍길동", "이몽룡", "성춘향", "변학도", "김삿갓", "임꺽정", "장보고", "유관순", "안중근", "윤봉길",
                 "박문수", "강감찬", "이순신", "최영", "이성계", "세종대왕", "신사임당", "김유신", "을지문덕", "정약용",
                 "이방원", "김홍도", "신윤복", "장영실", "허준", "정도전", "김종서", "김만중", "장희빈", "숙종", 
                 "영조", "정조", "광해군", "서경덕", "황진이", "최만리", "허균", "윤동주", "백범김구", "김좌진",
                 "안창호", "조봉암", "최규하", "서경덕", "이황", "이이", "안용복", "남이", "윤봉길", "유관순", 
                 "안중근", "한용운", "이승만", "김구", "윤동주", "안창호", "김좌진", "백범김구"];
  const departments = ["OO엔진 개발 및 설계", "OO기술 연구소", "OO제품 디자인팀", "OO마케팅", "OO인사팀"];
  const positions = ["사원", "대리", "과장", "차장", "부장"];
  const details = "aaa";

  const contactNumbers = new Set();
  while (contactNumbers.size < count) {
    const contact = `010-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
    contactNumbers.add(contact);
  }

  const nfcUids = new Set();
  while (nfcUids.size < count) {
    const nfcUid = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
    nfcUids.add(nfcUid);
  }

  const generateIssue = () => {
    const weights = [50, 30, 10, 5, 3, 1, 1];
    const sum = weights.reduce((a, b) => a + b, 0);
    const randomNum = Math.floor(Math.random() * sum);
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (randomNum < cumulative) {
        return i;
      }
    }
  };

  const data = [];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const contactNumber = Array.from(contactNumbers)[i];
    const nfcUid = Array.from(nfcUids)[i];
    const cumulativeIssue = generateIssue();

    data.push({
      id: uuidv4(),
      name,
      department,
      position,
      phoneNumber: contactNumber,
      nfcUid,
      issueCount: cumulativeIssue,
      detail: details
    });
  }

  return data;
};
