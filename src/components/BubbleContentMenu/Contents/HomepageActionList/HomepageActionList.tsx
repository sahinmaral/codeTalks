import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Text from '@/components/Text';
import ModalType from '@/enums/ModalType';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import { AppNavigationProp } from '@/types';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import CreateChannelModal from '../CreateChannelModal';
import SendJoinRequestModal from '../SendJoinRequestModal';
import makeStyles from './HomepageActionList.styles';

type HomepageActionListProps = {
  initialModalType?: ModalType;
};

function HomepageActionList({ initialModalType }: HomepageActionListProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { hide } = useBubbleContentMenu();
  const [activeModal, setActiveModal] = useState<ModalType | null>(initialModalType ?? null);
  const navigation = useNavigation<AppNavigationProp>();

  const toggleModal = (modalType: ModalType) => {
    setActiveModal(prev => (prev === modalType ? null : modalType));
  };

  const closeModal = () => {
    setActiveModal(null);
    hide();
  };

  if (activeModal === ModalType.ChannelCreate) {
    return (
      <View>
        <CreateChannelModal />
      </View>
    );
  }

  if (activeModal === ModalType.SendInviteToChannel) {
    return (
      <View>
        <SendJoinRequestModal />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text fontWeight="700" size="large">
          What would you like to do?
        </Text>
        <Text color={theme.text.tertiary}>Choose an action to get started</Text>
      </View>
      <View style={styles.optionListContainer}>
        <TouchableOpacity
          style={styles.optionItemContainer}
          onPress={() => toggleModal(ModalType.ChannelCreate)}
        >
          <View style={styles.optionIconContainer}>
            <View style={styles.optionIconBackground}>
              <Icon name="ri-add-line" size={36} color={colors.orange[400]} />
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionHeader} fontWeight="700">
              Create a Channel
            </Text>
            <Text style={styles.optionDescription} color={theme.text.tertiary}>
              Start your own community for developers
            </Text>
          </View>
          <View style={styles.optionArrowContainer}>
            <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionItemContainer}
          onPress={() => toggleModal(ModalType.SendInviteToChannel)}
        >
          <View style={styles.optionIconContainer}>
            <View style={styles.optionIconBackground}>
              <Icon name="ri-send-plane-fill" size={36} color={colors.orange[400]} />
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionHeader} fontWeight="700">
              Join a Channel
            </Text>
            <Text style={styles.optionDescription} color={theme.text.tertiary}>
              Enter a Channel ID to send a join request
            </Text>
          </View>
          <View style={styles.optionArrowContainer}>
            <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionItemContainer}
          onPress={() => {
            navigation.navigate('Explore');
            closeModal();
          }}
        >
          <View style={styles.optionIconContainer}>
            <View style={styles.optionIconBackground}>
              <Icon name="compass-3-line" size={36} color={colors.orange[400]} />
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionHeader} fontWeight="700">
              Explore Channels
            </Text>
            <Text style={styles.optionDescription} color={theme.text.tertiary}>
              Browse and discover public channels
            </Text>
          </View>
          <View style={styles.optionArrowContainer}>
            <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomepageActionList;
