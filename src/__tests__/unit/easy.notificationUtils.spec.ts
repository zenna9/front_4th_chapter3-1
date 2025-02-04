import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const events: Event[] = [
  {
    //0
    id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
    title: '팀 회의',
    date: '2025-02-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    //1
    id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
    title: '아침 운동',
    date: '2025-02-25',
    startTime: '07:30',
    endTime: '08:30',
    description: '필라테스',
    location: '챈필라테스',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    //2
    id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
    title: '분기 마감회의',
    date: '2025-02-25',
    startTime: '09:00',
    endTime: '09:55',
    description: '노트북챙길것',
    location: '사무실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 2,
  },
  {
    //3
    id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
    title: '생일 파티',
    date: '2025-02-25',
    startTime: '10:00',
    endTime: '13:00',
    description: '친구 생일 축하',
    location: '친구 집',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 70,
  },
  {
    //4
    id: '80d85368-b4a4-47b3-b959-25171d49371f',
    title: '운동',
    date: '2025-02-25',
    startTime: '18:00',
    endTime: '19:00',
    description: '주간 운동',
    location: '헬스장',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 100,
  },
];
describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const testCase = getUpcomingEvents(events, new Date('2025-02-25T08:59:20'), []);
    expect(testCase).toEqual([events[2], events[3]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const testCase = getUpcomingEvents(events, new Date('2025-02-25T08:59:20'), [events[2].id]);
    expect(testCase).toEqual([events[3]]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const testCase = getUpcomingEvents(events, new Date('2025-02-25T08:59:20'), []);
    expect(testCase).toEqual([events[2], events[3]]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const testCase = getUpcomingEvents(events, new Date('2025-02-25T08:59:20'), []);
    expect(testCase).toEqual([events[2], events[3]]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    expect(createNotificationMessage(events[2])).toBe('2분 후 분기 마감회의 일정이 시작됩니다.');
  });
});
