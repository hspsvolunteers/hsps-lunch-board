/**
 * 測試用假資料 (Mock Data)
 * 儲存於 localStorage，方便在重新整理頁面或切換路由時保留操作狀態。
 */

export const MOCK_ADMIN_PASSWORD = 'admin';

export const INITIAL_MOCK_ISSUES = [
  {
    trackingId: 'HS-A101',
    incidentDate: '2026-10-02',
    dishName: '糖醋排骨',
    feedback: '排骨裡面有兩塊骨頭碎屑較為尖銳，孩子食用時差點刮傷口腔，希望能請團膳廚房在分切肉品時加強注意與過濾碎骨。',
    status: '已回覆',
    reply: '已於 10/3 召開午餐委員會與團膳廠商召開檢討會議，要求廠商強化鋸骨機刀片維護，並在裹粉油炸前增設碎骨人工檢驗程序。本校營養師每週亦會突擊抽驗肉品。感謝家長提醒！',
    isPublic: true,
    studentClass: '三年二班',
    parentName: '林媽媽',
    phone: '0912-345-678',
    lineId: 'lin_mom_88',
    otherNotes: '平日下午三點後方便接聽電話',
    photoUrl: ''
  },
  {
    trackingId: 'HS-B204',
    incidentDate: '2026-10-03',
    dishName: '季節蔬菜（空心菜）',
    feedback: '當天的炒空心菜偏老偏苦，且部分菜梗較粗硬，低年級孩子咀嚼困難，當天班上剩菜量偏多，希望能留意菜餚嫩度。',
    status: '處理中',
    reply: '',
    isPublic: true,
    studentClass: '一年四班',
    parentName: '張爸爸',
    phone: '0988-765-432',
    lineId: '',
    otherNotes: '',
    photoUrl: ''
  },
  {
    trackingId: 'HS-C309',
    incidentDate: '2026-10-04',
    dishName: '玉米濃湯',
    feedback: '湯品送達教室時溫度偏涼，大約僅為常溫微溫，天氣轉涼孩子們喝了反映不夠暖胃，保溫桶是否需加強保溫措施？',
    status: '處理中',
    reply: '已請總務處量測各送餐推車之保溫桶封條密閉度，目前正針對低溫車廂路線調整運送動線。',
    isPublic: true,
    studentClass: '五年一班',
    parentName: '王小姐',
    phone: '0922-111-222',
    lineId: 'wang_crystal',
    otherNotes: '',
    photoUrl: ''
  },
  {
    trackingId: 'HS-D412',
    incidentDate: '2026-10-05',
    dishName: '紅燒豆腐',
    feedback: '口味偏鹹，醬油用量似乎偏重，希望營養師能協助檢討減鈉比例，維護孩子們清淡飲食的習慣。',
    status: '待處理',
    reply: '',
    isPublic: false, // 尚未公開審核中
    studentClass: '二年三班',
    parentName: '陳先生',
    phone: '0933-666-888',
    lineId: 'chen888',
    otherNotes: '若有需要可直接 LINE 聯繫',
    photoUrl: ''
  }
];

const STORAGE_KEY = 'hsps_mock_issues_data';

export function getStoredMockIssues() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ISSUES));
    return [...INITIAL_MOCK_ISSUES];
  }
  try {
    return JSON.parse(local);
  } catch {
    return [...INITIAL_MOCK_ISSUES];
  }
}

export function saveStoredMockIssues(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
