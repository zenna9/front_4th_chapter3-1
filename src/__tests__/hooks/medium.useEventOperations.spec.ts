import { act, screen, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event, EventForm } from '../../types.ts';
import { setupServer } from 'msw/node';
import { events } from '../../__mocks__/response/events.json';

beforeAll(() => server.listen());
afterAll(() => server.close());

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다(GET)', async () => {
  const { result } = renderHook(() => useEventOperations(false)); //useEventOperations를 실행하여 훅을 테스트할 수 있도록 함.
  await act(async () => {
    await result.current.fetchEvents(); // get요청 실행
  });
  expect(result.current.events).toEqual(events);
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다(POST)', async () => {
  let expectedMessage = '';
  const { result } = renderHook(() => useEventOperations(false));
  const eventData: Event = {
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
  await act(async () => {
    await result.current.saveEvent(eventData);
  });
  console.log(result);
  await waitFor(() => {
    expect(screen.getByText('일정이 추가되었습니다.')).toBeInTheDocument();
  });
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {});
