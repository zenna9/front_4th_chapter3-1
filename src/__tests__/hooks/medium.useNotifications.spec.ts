import { act, renderHook, RenderHookResult } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';

let result: RenderHookResult<ReturnType<typeof useNotifications>, unknown>['result'];
const mockEvents: Event[] = [
  {
    id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
    title: '팀 회의',
    date: '2025-02-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 5,
  },
  {
    id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
    title: '점심 약속',
    date: '2025-02-21',
    startTime: '12:30',
    endTime: '13:30',
    description: '동료와 점심 식사',
    location: '회사 근처 식당',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];
beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-02-20T09:58:00'));
  ({ result } = renderHook(() => useNotifications(mockEvents)));
});

afterEach(() => {
  vi.useRealTimers();
});
it('초기 상태에서는 알림이 없어야 한다', () => {
  // const { result } = renderHook(() => useNotifications(mockEvents));
  expect(result.current.notifications).toEqual([]);
});

it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
  act(() => vi.advanceTimersByTime(1000)); //멈췄던 시간이 흐르고있서
  expect(result.current.notifications).toEqual([
    {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      message: '5분 후 팀 회의 일정이 시작됩니다.',
    },
  ]);
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  act(() => vi.advanceTimersByTime(1000)); // 알림 생성
  expect(result.current.notifications).toEqual([
    {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      message: '5분 후 팀 회의 일정이 시작됩니다.',
    },
  ]);
  act(() => result.current.removeNotification(0));
  expect(result.current.notifications).toEqual([]);
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  act(() => vi.advanceTimersByTime(1000)); // 알림 생성
  act(() => result.current.removeNotification(0)); // 알림 삭제
  act(() => vi.advanceTimersByTime(500)); // 알림 시간이 지나지 않은 상태에서 시간을 더 흘려봄
  expect(result.current.notifications).toEqual([]);
});
