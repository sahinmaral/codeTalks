import Text from '@/components/Text';
import UserAvatar from '@/components/UserAvatar';
import { useAppSelector } from '@/redux/hooks';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import { Message } from '@/types';
import React from 'react';
import { View } from 'react-native';
import makeStyles from './MessageCard.styles';

interface MessageCardProps {
  messageDetail: Message;
}

function MessageCard({ messageDetail }: MessageCardProps) {
  const styles = useThemedStyles(makeStyles);
  const user = useAppSelector(state => state.app.user);

  if (messageDetail.sender.id !== user!.id) {
    return (
      <View style={styles.container}>
        <View style={styles.userProfilePhotoContainer}>
          <UserAvatar uri={messageDetail.sender.profilePhotoURL} size={40} />
        </View>
        <View style={styles.contentContainer}>
          <View>
            <Text fontWeight="700">{messageDetail.sender.userName}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text>{messageDetail.content}</Text>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.senderContainer}>
        <View style={styles.senderContentContainer}>
          <View style={styles.senderMessageContainer}>
            <Text color={colors.white}>{messageDetail.content}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default MessageCard;
