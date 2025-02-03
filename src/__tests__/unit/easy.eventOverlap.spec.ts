import { Event, EventForm } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2024-07-01', '14:30')).toEqual(new Date(2024, 7 - 1, 1, 14, 30));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    expect(!!parseDateTime('202-12-90', '14:30')).toEqual(true);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    expect(!!parseDateTime('2025-12-15', '28:40')).toEqual(true);
    expect(!!parseDateTime('2025-12-15', '-2')).toEqual(true);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(!!parseDateTime('', '14:30')).toEqual(true);
  });
});

describe('convertEventToDateRange', () => {
  const event: Event = {
    id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
    title: '프로젝트 마감',
    date: '2025-02-25',
    startTime: '09:00',
    endTime: '18:00',
    description: '분기별 프로젝트 마감',
    location: '사무실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  };
  const eventForm: EventForm = {
    title: '프로젝트 마감',
    date: '2025-02-25',
    startTime: '09:00',
    endTime: '18:00',
    description: '분기별 프로젝트 마감',
    location: '사무실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  };
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const expectEvent = convertEventToDateRange(event);
    expect(expectEvent.start).toBeInstanceOf(Date);
    expect(expectEvent.end).toBeInstanceOf(Date);

    const expectEventForm = convertEventToDateRange(eventForm);
    expect(expectEventForm.start).toBeInstanceOf(Date);
    expect(expectEventForm.end).toBeInstanceOf(Date);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidEvent: Event = { ...event, date: '202-12-90' };
    const invalidEventConverted = convertEventToDateRange(invalidEvent);
    expect(!!invalidEventConverted.start.getTime()).toBe(false);
    expect(!!invalidEventConverted.end.getTime()).toBe(false);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidEvent: Event = { ...event, startTime: '-1', endTime: '26:92' };
    const invalidEventConverted = convertEventToDateRange(invalidEvent);
    expect(!!invalidEventConverted.start.getTime()).toBe(false);
    expect(!!invalidEventConverted.end.getTime()).toBe(false);
  });
});

describe('isOverlapping', () => {
  const event13hour1: Event = {
    id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
    title: '프로젝트 마감',
    date: '2025-02-25',
    startTime: '13:10',
    endTime: '18:00',
    description: '분기별 프로젝트 마감',
    location: '사무실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  };
  const event13hour2: Event = {
    id: 'da3ca408-836a-4d98-b67a-ca389d05742b',
    title: '점심 약속',
    date: '2025-02-25',
    startTime: '13:50',
    endTime: '14:50',
    description: 'KEO, 설명이 필요',
    location: '강남역 5번출구',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  };
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(event13hour1, event13hour2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const eventMorning: Event = { ...event13hour2, startTime: '09:00', endTime: '11:00' };
    expect(isOverlapping(event13hour1, eventMorning)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const events: Event[] = [
    {
      id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
      title: '프로젝트 마감',
      date: '2025-02-25',
      startTime: '13:10',
      endTime: '18:00',
      description: '분기별 프로젝트 마감',
      location: '사무실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: 'da3ca408-836a-4d98-b67a-ca389d05742b',
      title: '점심 약속',
      date: '2025-02-25',
      startTime: '13:50',
      endTime: '14:50',
      description: 'CHAN',
      location: '강남역 5번출구',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];
  const moreEvents: Event[] = [
    ...events,
    {
      id: 'da3ca408-836a-4d98-b67a-chan89d05742b',
      title: 'day24',
      date: '2025-02-24',
      startTime: '13:50',
      endTime: '14:50',
      description: 'HONG',
      location: '선릉 4',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: 'da3ca408-836a-4d98-b67a-ca110d05742b',
      title: '차가워',
      date: '2025-02-25',
      startTime: '08:10',
      endTime: '23:50',
      description: 'CHAN',
      location: 'dingo',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    expect(findOverlappingEvents(newEvent, events)).toEqual(events);
    expect(findOverlappingEvents(newEvent, moreEvents)).toEqual(events);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: 'da3ca507-836a-4d98-b67a-ca110d05742b',
      title: '차가워',
      date: '2025-02-23',
      startTime: '08:10',
      endTime: '23:50',
      description: 'Look at the window 창문을 열고 괜히 차가워',
      location: 'dingo',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    expect(findOverlappingEvents(newEvent, events)).toEqual([]);
  });
});
