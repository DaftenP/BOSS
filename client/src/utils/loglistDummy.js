import { v4 as uuidv4 } from 'uuid';

export const loglistDummy = (count) => {
  const devices = Array.from({ length: 10 }, (_, i) => i + 1);
  const names = ["홍길동", "이몽룡", "성춘향", "변학도", "김삿갓", "임꺽정", "장보고", "유관순", "안중근", "윤봉길",
                 "박문수", "강감찬", "이순신", "최영", "이성계", "세종대왕", "신사임당", "김유신", "을지문덕", "정약용"];
  const departments = ["OO엔진 개발 및 설계", "OO기술 연구소", "OO제품 디자인팀", "OO마케팅", "OO인사팀"];
  const positions = ["사원", "대리", "과장", "차장", "부장"];
  const dates = Array.from({ length: 365 }, (_, i) => new Date(2024, 0, 1 + i).toISOString().split('T')[0]);
  const times = Array.from({ length: 13 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00:00`);
  const securityIssues = ["P", "F"];

  const data = [];

  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const action = i % 2 === 0 ? "출" : "퇴";
    const device = devices[Math.floor(Math.random() * devices.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const date = dates[Math.floor(Math.random() * dates.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    const securityIssue = securityIssues[Math.floor(Math.random() * securityIssues.length)];
    const issuanceCount = securityIssue === "F" ? Math.floor(Math.random() * 4) + 1 : 0;
    const detail = "aaa";
    const userId = `${name}${Math.floor(Math.random() * 9000) + 1000}`;

    data.push({
      gate: device,
      id: uuidv4(),
      name,
      department,
      position,
      date,
      time,
      entering: action,
      issue: securityIssue,
      sticker_number: issuanceCount,
      detail
    });
  }

  return data;
};
