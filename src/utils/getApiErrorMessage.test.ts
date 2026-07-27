import { AxiosError } from 'axios';
import { getApiErrorMessage } from './getApiErrorMessage';

function makeAxiosError(data: unknown): AxiosError {
  return {
    isAxiosError: true,
    response:
      data === undefined
        ? undefined
        : { data, status: 400, statusText: '', headers: {}, config: {} as any },
  } as AxiosError;
}

describe('getApiErrorMessage', () => {
  it('returns the detail field when present', () => {
    const error = makeAxiosError({ detail: 'Channel not found' });
    expect(getApiErrorMessage(error)).toBe('Channel not found');
  });

  it('falls back to the first validation error message when detail is empty', () => {
    const error = makeAxiosError({
      detail: '',
      errors: [
        {
          propertyName: 'email',
          errorMessage: 'Email is invalid',
          attemptedValue: 'x',
          errorCode: 'E1',
        },
      ],
    });
    expect(getApiErrorMessage(error)).toBe('Email is invalid');
  });

  it('falls back to the generic message when there is no usable response data', () => {
    const error = makeAxiosError(undefined);
    expect(getApiErrorMessage(error)).toBe('The server is unavailable. Please try again later.');
  });

  it('falls back to the generic message for an HTML/non-ApiError response body', () => {
    const error = makeAxiosError('<html>502 Bad Gateway</html>');
    expect(getApiErrorMessage(error)).toBe('The server is unavailable. Please try again later.');
  });
});
