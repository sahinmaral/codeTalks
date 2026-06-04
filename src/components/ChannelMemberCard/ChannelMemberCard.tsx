import colors from '@/styles/colors';
import { ChannelUser } from '@/types';
import React, { useMemo } from 'react';
import { Image, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import Text from '../Text';
import styles from './ChannelMemberCard.styles';

type ChannelMemberCardProps = {
  user: ChannelUser;
};

const ChannelMemberCard = ({ user }: ChannelMemberCardProps) => {
  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');

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
    <View key={user.id} style={styles.container}>
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
      <View style={styles.actionsContainer}>
        <Icon name="arrow-right-s-line" size={24} color={colors.gray[400]} />
      </View>
    </View>
  );
};

export default ChannelMemberCard;
