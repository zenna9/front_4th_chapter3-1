import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';
import { events } from '../../__mocks__/response/events.json';

const mockEvents = events as Event[];

//테스트 중 호출 여부와 호출 상세 정보를 추적할 수 있음
//실제 useToast의 동작을 대신하는 Mock 함수 - 테스트에서 useToast 호출을 추적하기 위함
//useToast가 실제 UI를 띄우지 않고, vi.fn()으로 감싸진 가짜 함수로 대체
//toastFn.mock.calls.length 같은 방법으로 얼마나 호출되었는지 확인 가능
const toastFn = vi.fn();

//Chakra UI의 다른 기능(ex. Button, Box)은 실제 동작하도록 유지하면서,특정 기능(useToast)만 가짜(mock)로 대체하려고 함.
vi.mock('@chakra-ui/react', async () => {
  //Chakra UI 모듈 전체를 모킹..
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다(GET)', async () => {
  const { result } = renderHook(() => useEventOperations(false)); //useEventOperations를 실행하여 훅을 테스트할 수 있도록 함.
  await act(async () => {
    await result.current.fetchEvents(); // get요청 실행
  });
  expect(result.current.events).toEqual(events);
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  const newEvent: Event = {
    id: '',
    title: '이 거지같은 회사에 두번씩이나 버려지다니',
    date: '2025-02-19',
    startTime: '08:30',
    endTime: '18:00',
    description: '월급주잖아..',
    location: '강남역',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1, // 분 단위로 저장
  };
  setupMockHandlerCreation(mockEvents);
  const { result } = renderHook(() => useEventOperations(false));
  await act(async () => {
    // Promise.resolve(null); //이게뭔데...
    await result.current.saveEvent(newEvent);
  });
  console.log('res', result.current.events);
  expect(result.current.events).toEqual([...mockEvents, { ...newEvent, id: '2' }]);
});

// 설명을 좀 더 명확하게 변경
// it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
it("'title', 'endTime' 변경 후 저장 시 정확하게 반영된다", async () => {
  const updatedEvent: Event = {
    id: '1',
    title: '다른 회의!',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '12:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };
  setupMockHandlerUpdating(mockEvents, updatedEvent);
  const { result } = renderHook(() => useEventOperations(true));
  await act(async () => {
    await result.current.saveEvent(updatedEvent);
  });
  expect(result.current.events).toEqual([updatedEvent]);
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  setupMockHandlerDeletion(mockEvents);
  const { result } = renderHook(() => useEventOperations(true));
  await act(async () => {
    await result.current.deleteEvent('1');
  });
  expect(result.current.events).toEqual([]);
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(
    http.get('/api/events', async () => {
      return new HttpResponse(null, { status: 500 }); // 서버 에러 (500)
    })
  );
  const { result } = renderHook(() => useEventOperations(false));
  await act(async () => {
    await result.current.fetchEvents(); // get요청 실행
  });
  expect(toastFn).toHaveBeenCalledWith(
    expect.objectContaining({ title: '이벤트 로딩 실패', status: 'error' })
  );
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  const updatedEvent: Event = {
    ...mockEvents[0],
    id: '5',
    title: '없는 회의~~~~',
  };
  setupMockHandlerUpdating(mockEvents, updatedEvent);
  const { result } = renderHook(() => useEventOperations(true));
  await act(async () => {
    await result.current.saveEvent(updatedEvent);
  });
  expect(toastFn).toHaveBeenCalledWith(
    expect.objectContaining({ title: '일정 저장 실패', status: 'error' })
  );
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  server.use(
    http.delete('/api/events/:id', async () => {
      // return new HttpResponse(null, { status: 500 });
      throw new Error('Failed to fetch');
    })
  );
  const { result } = renderHook(() => useEventOperations(false));
  await act(async () => {
    await result.current.deleteEvent('1');
  });
  // expect(toastFn).toHaveBeenCalled(); // 성공해도 팝업은 뜨니 크게 의미가 없을 것 같다.
  expect(toastFn).toHaveBeenCalledWith(
    expect.objectContaining({ title: '일정 삭제 실패', status: 'error' })
  );
});
