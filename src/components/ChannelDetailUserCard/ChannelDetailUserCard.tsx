import React, { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import styles from './ChannelDetailUserCard.styles';
import { useAppSelector } from '../../redux/hooks';
import { ChannelUser } from '../../types';

interface ChannelDetailUserCardProps {
  user: ChannelUser;
}

function ChannelDetailUserCard({ user }: ChannelDetailUserCardProps) {
  const currentUser = useAppSelector((state) => state.app.user);

  const fullName = useMemo(() => {
    return `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          style={styles.photoContainer}
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.rightTopContainer}>
          <Text style={styles.text}>
            {currentUser?.id === user.id ? 'Siz' : fullName}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{user.role.name}</Text>
          </View>
        </View>
        <View style={styles.rightBottomContainer}>
          <Text style={styles.rightBottomText}>{user.userName}</Text>
        </View>
      </View>
    </View>
  );
}

export default ChannelDetailUserCard;
