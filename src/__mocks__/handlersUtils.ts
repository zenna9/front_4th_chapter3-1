import { http } from 'msw/core/http';
import { Event } from '../types';
import { HttpResponse } from 'msw';

let mockupEvents: Event[] = [];
// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  console.log('hmm');
  const events = [...initEvents];
  return http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    newEvent.id = String(events.length + 1);

    // 새 이벤트를 events 배열에 추가해서 리턴
    events.push(newEvent);

    const hResponse = HttpResponse.json(newEvent, { status: 201 });
    return hResponse;
  });
};

export const setupMockHandlerUpdating = (prevEvents: Event[]) => {
  const events = [...prevEvents];
  return http.put('/api/events/:id', async ({ params: { id }, request }) => {
    const updatedEvent = (await request.json()) as Event;
    const index = events.findIndex((event) => event.id === id);

    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent };
      return HttpResponse.json({ ...events[index] });
    }

    return new HttpResponse(null, { status: 404 });
  });
};

export const setupMockHandlerDeletion = () => {};

export const initMockupEvents = (): Event[] => {
  return [
    {
      //0
      id: '1',
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
      id: '2',
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
    {
      //2
      id: '3',
      title: '프로젝트 마감',
      date: '2025-02-25',
      startTime: '09:00',
      endTime: '18:00',
      description: '분기별 프로젝트 마감',
      location: '사무실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      //3
      id: '4',
      title: '운동',
      date: '2025-02-22',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      //4
      id: '5',
      title: '생일 파티',
      date: '2025-02-28',
      startTime: '19:00',
      endTime: '22:00',
      description: '친구 생일 축하',
      location: '친구 집',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];
};
