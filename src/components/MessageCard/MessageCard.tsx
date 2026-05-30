import { formatDistance, parseISO } from 'date-fns';
import React from 'react';
import { Image, View } from 'react-native';
import { tr } from 'date-fns/locale';
import styles from './MessageCard.styles';
import { Message } from '@/types';
import Text from '@/components/Text';
import { useAppSelector } from '@/redux/hooks';
import colors from '@/styles/colors';

interface MessageCardProps {
  messageDetail: Message;
}

function MessageCard({ messageDetail }: MessageCardProps) {
  const user = useAppSelector(state => state.app.user);

  if (messageDetail.sender.id !== user.id) {
    return (
      <View style={styles.container}>
        <View style={styles.userProfilePhotoContainer}>
          <Image
            style={styles.userProfilePhoto}
            source={{ uri: messageDetail.sender.profilePhotoURL }}
          />
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
