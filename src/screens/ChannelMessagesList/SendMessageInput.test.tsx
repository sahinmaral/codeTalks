import { fetchCreateMessage } from '@/services/apiServices/messages';
import { renderWithProviders } from '@/test/renderWithProviders';
import { act, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import SendMessageInput from './SendMessageInput';

const flush = () => act(async () => {});

jest.mock('@/services/apiServices/messages', () => ({ fetchCreateMessage: jest.fn() }));
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }));

const mockFetchCreateMessage = fetchCreateMessage as jest.Mock;
const mockShowMessage = showMessage as jest.Mock;

const onMessageChange = jest.fn();

const renderInput = (message: string) =>
  renderWithProviders(
    <SendMessageInput
      channelName="general"
      channelId="channel-1"
      userId="user-1"
      message={message}
      onMessageChange={onMessageChange}
    />,
  );

const pressSend = () => fireEvent.press(screen.UNSAFE_getByProps({ name: 'ri-send-plane-fill' }));

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchCreateMessage.mockResolvedValue({ data: null });
});

describe('SendMessageInput', () => {
  it('names the channel in the placeholder', () => {
    renderInput('');

    expect(screen.getByPlaceholderText('Message general')).toBeTruthy();
  });

  it('reports typing back to the parent', () => {
    renderInput('');

    fireEvent.changeText(screen.getByPlaceholderText('Message general'), 'hello');

    expect(onMessageChange).toHaveBeenCalledWith('hello');
  });

  it('sends the message and clears the input', async () => {
    renderInput('hello');

    pressSend();
    await flush();

    expect(mockFetchCreateMessage).toHaveBeenCalledWith({
      userId: 'user-1',
      channelId: 'channel-1',
      content: 'hello',
    });
    expect(onMessageChange).toHaveBeenCalledWith('');
  });

  it('does nothing when the message is empty', async () => {
    renderInput('');

    pressSend();
    await flush();

    expect(mockFetchCreateMessage).not.toHaveBeenCalled();
  });

  it('keeps the message and warns when sending fails', async () => {
    mockFetchCreateMessage.mockRejectedValue(new Error('offline'));
    renderInput('hello');

    pressSend();
    await flush();

    expect(mockShowMessage).toHaveBeenCalledWith({
      message: 'An error occurred while sending the message',
      type: 'danger',
    });
    expect(onMessageChange).not.toHaveBeenCalledWith('');
  });

  it('ignores a second tap while the first send is still in flight', async () => {
    let resolveSend: (value: unknown) => void = () => {};
    mockFetchCreateMessage.mockReturnValue(new Promise(resolve => (resolveSend = resolve)));
    renderInput('hello');

    pressSend();
    pressSend();

    expect(mockFetchCreateMessage).toHaveBeenCalledTimes(1);

    await act(async () => resolveSend({ data: null }));
  });
});
