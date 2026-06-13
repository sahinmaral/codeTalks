import colors from '@/styles/colors';
import { ChannelUser } from '@/types';
import React, { useCallback, useMemo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import Text from '../Text';
import styles from './ChannelMemberCard.styles';

export enum ChannelMemberCardType {
  Normal = 'normal',
  Locked = 'locked',
  RemoveUser = 'remove-user',
}

type ChannelMemberCardProps = {
  user: ChannelUser;
  onPress?: (user: ChannelUser) => void;
  cardType?: ChannelMemberCardType;
};

const ChannelMemberCard = ({
  user,
  onPress,
  cardType = ChannelMemberCardType.Normal,
}: ChannelMemberCardProps) => {
  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');

  const renderIconByCardType = useCallback(() => {
    switch (cardType) {
      case ChannelMemberCardType.Locked:
        return <Icon name="lock-2-line" size={24} color={colors.gray[400]} />;
      case ChannelMemberCardType.RemoveUser:
        return <Icon name="ri-delete-bin-line" size={24} color={colors.danger} />;
      default:
        return <Icon name="arrow-right-s-line" size={24} color={colors.gray[400]} />;
    }
  }, [cardType]);

  const rolePillBackgroundColor = useMemo(() => {
    switch (user.role.name) {
      case 'Moderator':
        return colors.orange[100];
      case 'User':
        return colors.gray[200];
      default:
        return colors.gray[200];
    }
  }, [user.role.name]);

  const rolePillTextColor = useMemo(() => {
    switch (user.role.name) {
      case 'Moderator':
        return colors.orange[400];
      case 'User':
        return colors.gray[400];
      default:
        return colors.gray[400];
    }
  }, [user.role.name]);

  const avatarContainerBackgroundColor = useMemo(() => {
    switch (user.role.name) {
      case 'Moderator':
        return colors.orange[400];
      case 'User':
        return colors.gray[300];
      default:
        return colors.gray[300];
    }
  }, [user.role.name]);

  return (
    <TouchableOpacity
      key={user.id}
      style={styles.container}
      disabled={cardType == ChannelMemberCardType.Locked}
      onPress={() => cardType != ChannelMemberCardType.Locked && onPress && onPress(user)}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={[styles.avatarContainer, { backgroundColor: avatarContainerBackgroundColor }]}>
          {user.profilePhotoURL && (
            <Image style={styles.avatarProfilePhoto} source={{ uri: user.profilePhotoURL }} />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text fontWeight="700">{fullName}</Text>
          <View style={[styles.rolePill, { backgroundColor: rolePillBackgroundColor }]}>
            <Text fontWeight="700" color={rolePillTextColor}>
              {user.role.name}
            </Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>{renderIconByCardType()}</View>
      </View>

      {cardType == ChannelMemberCardType.Locked && <View style={styles.lockOverlay}></View>}
    </TouchableOpacity>
  );
};

export default ChannelMemberCard;
