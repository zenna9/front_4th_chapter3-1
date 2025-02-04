import { getTimeErrorMessage } from '../../utils/timeValidation';

const errorReturn = {
  startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
  endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
};

const nullReturn = {
  startTimeError: null,
  endTimeError: null,
};

describe('getTimeErrorMessage >', () => {
  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    const testCase = getTimeErrorMessage('18:01', '18:00');
    expect(testCase).toEqual(errorReturn);
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    const testCase = getTimeErrorMessage('18:00', '18:00');
    expect(testCase).toEqual(errorReturn);
  });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    const testCase = getTimeErrorMessage('18:00', '18:30');
    expect(testCase).toEqual(nullReturn);
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    const testCase = getTimeErrorMessage('', '18:30');
    expect(testCase).toEqual(nullReturn);
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    const testCase = getTimeErrorMessage('18:00', '');
    expect(testCase).toEqual(nullReturn);
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    const testCase = getTimeErrorMessage('', '');
    expect(testCase).toEqual(nullReturn);
  });
});
