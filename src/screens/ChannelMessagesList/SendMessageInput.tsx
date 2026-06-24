import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-remix-icon';
import makeStyles from './ChannelMessagesList.styles';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import { showMessage } from 'react-native-flash-message';
import { fetchCreateMessage } from '@/services/messages';

type SendMessageInputProps = {
  channelName: string;
  channelId: string;
  userId: string;
  message: string;
  onMessageChange: (value: string) => void;
};

const SendMessageInput = ({
  channelName,
  channelId,
  userId,
  message,
  onMessageChange,
}: SendMessageInputProps) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const [isLoading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.length === 0) {
      return;
    }

    try {
      setLoading(true);
      await fetchCreateMessage({ userId, channelId, content: message });
      onMessageChange('');
    } catch {
      showMessage({ message: 'Error during sending message', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 10,
      }}
    >
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={onMessageChange}
          placeholder={`Message ${channelName}`}
          placeholderTextColor={theme.text.tertiary}
          multiline
        />
      </View>

      <View style={styles.sendMessageButtonContainer}>
        <TouchableOpacity
          style={[styles.sendMessageButton, isLoading && styles.sendMessageButtonDisabled]}
          onPress={handleSendMessage}
          disabled={isLoading}
        >
          <Icon size={25} name="ri-send-plane-fill" color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendMessageInput;
