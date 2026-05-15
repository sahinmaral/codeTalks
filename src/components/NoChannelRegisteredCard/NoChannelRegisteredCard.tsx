import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-remix-icon';
import colors from '@/styles/colors';
import Text from '@/components/Text';
import Button from '@/components/Button';
import styles from './NoChannelRegisteredCard.styles';
import ModalType from '@/enums/ModalType';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import HomepageActionList from '@/components/BubbleContentMenu/Contents/HomepageActionList';

function NoChannelRegisteredCard() {
  const { show } = useBubbleContentMenu();

  const handleSubmit = (modalType: ModalType) => {
    show(<HomepageActionList initialModalType={modalType} />);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="ri-chat-4-line" size={35} color={colors.orange[500]} />
      </View>
      <View style={styles.textContainer}>
        <Text size="large" fontWeight="700" style={{ textAlign: 'center' }}>
          No Active Channels
        </Text>
        <Text color={colors.gray[500]} size="medium" style={{ textAlign: 'center' }}>
          You haven't joined any channels yet. Explore and find communities that interest you!
        </Text>
      </View>
      <View style={styles.buttonGroupContainer}>
        <Button
          title="Create Channel"
          icon="ri-add-line"
          style={styles.button}
          onPress={() => handleSubmit(ModalType.ChannelCreate)}
        />
        <Button
          theme="primary-outline"
          title="Join With Channel ID"
          icon="ri-send-plane-fill"
          style={styles.button}
          onPress={() => handleSubmit(ModalType.SendInviteToChannel)}
        />
      </View>
    </View>
  );
}

export default NoChannelRegisteredCard;
