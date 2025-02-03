import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    const day = getDaysInMonth(2025, 1);
    expect(day).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2025, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
    expect(getDaysInMonth(2020, 2)).toBe(29);
    expect(getDaysInMonth(2028, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2025, 2)).toBe(28);
    expect(getDaysInMonth(2026, 2)).toBe(28);
    expect(getDaysInMonth(2027, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    expect(getDaysInMonth(2025, 0)).toBe(getDaysInMonth(2025, 1));
    expect(getDaysInMonth(2025, -1)).toBe(getDaysInMonth(2024, 11));
    expect(getDaysInMonth(2025, -2)).toBe(getDaysInMonth(2024, 10));
    expect(getDaysInMonth(2025, 13)).toBe(getDaysInMonth(2026, 1));
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const testToExpect: [Date, Date[]][] = [
      [
        new Date('2025-01-01'),
        [
          new Date('2024-12-29'),
          new Date('2024-12-30'),
          new Date('2024-12-31'),
          new Date('2025-01-01'),
          new Date('2025-01-02'),
          new Date('2025-01-03'),
          new Date('2025-01-04'),
        ],
      ],
      [
        new Date('2025-02-12'),
        [
          new Date('2025-02-09'),
          new Date('2025-02-10'),
          new Date('2025-02-11'),
          new Date('2025-02-12'),
          new Date('2025-02-13'),
          new Date('2025-02-14'),
          new Date('2025-02-15'),
        ],
      ],
      [
        new Date('2025-03-26'),
        [
          new Date('2025-03-23'),
          new Date('2025-03-24'),
          new Date('2025-03-25'),
          new Date('2025-03-26'),
          new Date('2025-03-27'),
          new Date('2025-03-28'),
          new Date('2025-03-29'),
        ],
      ],
      [
        new Date('2025-04-16'),
        [
          new Date('2025-04-13'),
          new Date('2025-04-14'),
          new Date('2025-04-15'),
          new Date('2025-04-16'),
          new Date('2025-04-17'),
          new Date('2025-04-18'),
          new Date('2025-04-19'),
        ],
      ],
    ];

    testToExpect.forEach((tst) => {
      expect(getWeekDates(tst[0])).toEqual(tst[1]);
    });
  });

  //코치님 왜 월요일이 주의 시작이라고 하셔놓고 일요일부터 주시는거예요ㅠ_ㅠ
  // it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
  it('주의 시작(일요일)이 입력되면 그 날이 속한 주의 날짜들을 반환한다', () => {
    const testToExpect: [Date, Date[]][] = [
      [
        new Date('2024-12-29'),
        [
          new Date('2024-12-29'),
          new Date('2024-12-30'),
          new Date('2024-12-31'),
          new Date('2025-01-01'),
          new Date('2025-01-02'),
          new Date('2025-01-03'),
          new Date('2025-01-04'),
        ],
      ],
      [
        new Date('2025-02-09'),
        [
          new Date('2025-02-09'),
          new Date('2025-02-10'),
          new Date('2025-02-11'),
          new Date('2025-02-12'),
          new Date('2025-02-13'),
          new Date('2025-02-14'),
          new Date('2025-02-15'),
        ],
      ],
    ];
    testToExpect.forEach((tst) => {
      expect(getWeekDates(tst[0])).toEqual(tst[1]);
    });
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const testToExpect: [Date, Date[]][] = [
      [
        new Date('2025-01-04'),
        [
          new Date('2024-12-29'),
          new Date('2024-12-30'),
          new Date('2024-12-31'),
          new Date('2025-01-01'),
          new Date('2025-01-02'),
          new Date('2025-01-03'),
          new Date('2025-01-04'),
        ],
      ],
      [
        new Date('2025-02-15'),
        [
          new Date('2025-02-09'),
          new Date('2025-02-10'),
          new Date('2025-02-11'),
          new Date('2025-02-12'),
          new Date('2025-02-13'),
          new Date('2025-02-14'),
          new Date('2025-02-15'),
        ],
      ],
    ];
    testToExpect.forEach((tst) => {
      expect(getWeekDates(tst[0])).toEqual(tst[1]);
    });
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const testToExpect: [Date, Date[]][] = [
      [
        new Date('2025-12-31'),
        [
          new Date('2025-12-28'),
          new Date('2025-12-29'),
          new Date('2025-12-30'),
          new Date('2025-12-31'),
          new Date('2026-01-01'),
          new Date('2026-01-02'),
          new Date('2026-01-03'),
        ],
      ],
      [
        new Date('2024-12-31'),
        [
          new Date('2024-12-29'),
          new Date('2024-12-30'),
          new Date('2024-12-31'),
          new Date('2025-01-01'),
          new Date('2025-01-02'),
          new Date('2025-01-03'),
          new Date('2025-01-04'),
        ],
      ],
    ];

    testToExpect.forEach((tst) => {
      expect(getWeekDates(tst[0])).toEqual(tst[1]);
    });
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const testToExpect: [Date, Date[]][] = [
      [
        new Date('2024-01-01'),
        [
          new Date('2023-12-31'),
          new Date('2024-01-01'),
          new Date('2024-01-02'),
          new Date('2024-01-03'),
          new Date('2024-01-04'),
          new Date('2024-01-05'),
          new Date('2024-01-06'),
        ],
      ],
      [
        new Date('2025-01-01'),
        [
          new Date('2024-12-29'),
          new Date('2024-12-30'),
          new Date('2024-12-31'),
          new Date('2025-01-01'),
          new Date('2025-01-02'),
          new Date('2025-01-03'),
          new Date('2025-01-04'),
        ],
      ],
    ];

    testToExpect.forEach((tst) => {
      expect(getWeekDates(tst[0])).toEqual(tst[1]);
    });
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const testToExpect: [Date, Date[]][] = [
      [
        new Date('2024-02-29'),
        [
          new Date('2024-02-25'),
          new Date('2024-02-26'),
          new Date('2024-02-27'),
          new Date('2024-02-28'),
          new Date('2024-02-29'),
          new Date('2024-03-01'),
          new Date('2024-03-02'),
        ],
      ],
      [
        new Date('2020-02-29'),
        [
          new Date('2020-02-23'),
          new Date('2020-02-24'),
          new Date('2020-02-25'),
          new Date('2020-02-26'),
          new Date('2020-02-27'),
          new Date('2020-02-28'),
          new Date('2020-02-29'),
        ],
      ],
    ];

    testToExpect.forEach((tst) => {
      expect(getWeekDates(tst[0])).toEqual(tst[1]);
    });
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const testToExpect: [Date, Date[]][] = [
      [
        new Date('2024-01-31'),
        [
          new Date('2024-01-28'),
          new Date('2024-01-29'),
          new Date('2024-01-30'),
          new Date('2024-01-31'),
          new Date('2024-02-01'),
          new Date('2024-02-02'),
          new Date('2024-02-03'),
        ],
      ],
      [
        new Date('2024-04-30'),
        [
          new Date('2024-04-28'),
          new Date('2024-04-29'),
          new Date('2024-04-30'),
          new Date('2024-05-01'),
          new Date('2024-05-02'),
          new Date('2024-05-03'),
          new Date('2024-05-04'),
        ],
      ],
    ];

    testToExpect.forEach((tst) => {
      expect(getWeekDates(tst[0])).toEqual(tst[1]);
    });
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const expectedRslt = [
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ];
    expect(getWeeksAtMonth(new Date('2024-07-01'))).toEqual(expectedRslt);
  });
});

describe('getEventsForDay', () => {
  const events: Event[] = [
    {
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
    },
    {
      id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
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
    {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
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
  ];
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const expectedRslt = [
      {
        id: '80d85368-b4a4-47b3-b959-25171d49371f',
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
    ];
    expect(getEventsForDay(events, 22)).toEqual(expectedRslt);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay(events, 15)).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay(events, 0)).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    expect(getEventsForDay(events, 32)).toEqual([]);
    expect(getEventsForDay(events, 33)).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-12'))).toBe('2025년 2월 2주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-01'))).toBe('2025년 1월 5주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-03-31'))).toBe('2025년 4월 1주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-03-31'))).toBe('2025년 4월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2024-02-29'))).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    expect(formatWeek(new Date('2025-02-28'))).toBe('2025년 2월 4주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    expect(formatMonth(new Date('2024-07-10'))).toBe('2024년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    expect(isDateInRange(new Date('2024-07-10'), rangeStart, rangeEnd)).toBe(true);
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    expect(isDateInRange(new Date('2024-07-01'), rangeStart, rangeEnd)).toBe(true);
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    expect(isDateInRange(new Date('2024-07-31'), rangeStart, rangeEnd)).toBe(true);
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    expect(isDateInRange(new Date('2024-06-30'), rangeStart, rangeEnd)).toBe(false);
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    expect(isDateInRange(new Date('2024-08-01'), rangeStart, rangeEnd)).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    expect(isDateInRange(new Date('2024-07-01'), rangeEnd, rangeStart)).toBe(false);
  });
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    expect(fillZero(5, 2)).toBe('05');
    expect(fillZero(5)).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    expect(fillZero(10, 2)).toBe('10');
    expect(fillZero(10)).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    expect(fillZero(3, 3)).toBe('003');
  });

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {
    expect(fillZero(100)).toBe('100');
    expect(fillZero(100, 2)).toBe('100');
  });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    expect(fillZero(0)).toBe('00');
    expect(fillZero(0, 2)).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    expect(fillZero(1, 5)).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    expect(fillZero(3.14, 5)).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    expect(fillZero(0)).toBe(fillZero(0, 2));
    expect(fillZero(15)).toBe(fillZero(15, 2));
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    expect(fillZero(10517, 3)).toBe('10517');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    expect(formatDate(new Date('2025-02-03'))).toBe('2025-02-03');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    expect(formatDate(new Date('2025-02-03'), 20)).toBe('2025-02-20');
    expect(formatDate(new Date('2025-02-03'), 14)).toBe('2025-02-14');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    expect(formatDate(new Date('2025-2-03'))).toBe('2025-02-03');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    expect(formatDate(new Date('2025-02-3'))).toBe('2025-02-03');
  });
});
