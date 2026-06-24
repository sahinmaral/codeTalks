import { UserRole } from '@/enums/UserRole';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import getFullName from '@/helpers/getFullName';
import colors from '@/styles/colors';
import { ChannelUser } from '@/types';
import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import Text from '../Text';
import UserAvatar from '../UserAvatar';
import makeStyles from './ChannelMemberCard.styles';

export enum ChannelMemberCardType {
  Normal = 'normal',
  Locked = 'locked',
  RemoveUser = 'remove-user',
  UnbanUser = 'unban-user',
}

type ChannelMemberCardProps = {
  user: ChannelUser;
  onPress?: () => void;
  cardType?: ChannelMemberCardType;
};

const ChannelMemberCard = ({
  user,
  onPress,
  cardType = ChannelMemberCardType.Normal,
}: ChannelMemberCardProps) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const fullName = getFullName(user);

  const renderIconByCardType = useCallback(() => {
    switch (cardType) {
      case ChannelMemberCardType.Locked:
        return <Icon name="lock-2-line" size={24} color={theme.text.tertiary} />;
      case ChannelMemberCardType.RemoveUser:
        return <Icon name="ri-delete-bin-line" size={24} color={colors.danger} />;
      case ChannelMemberCardType.UnbanUser:
        return <Icon name="ri-lock-unlock-line" size={24} color={colors.green[500]} />;
      default:
        return <Icon name="arrow-right-s-line" size={24} color={theme.text.tertiary} />;
    }
  }, [cardType, theme]);

  const rolePillStyle = useMemo(() => {
    switch (user.role.name) {
      case UserRole.Owner:
        return { backgroundColor: colors.orange[200] };
      case UserRole.Moderator:
        return { backgroundColor: colors.gray[300], borderWidth: 1, borderColor: colors.gray[400] };
      default:
        return { backgroundColor: colors.gray[300] };
    }
  }, [user.role.name]);

  const rolePillTextColor = useMemo(() => {
    switch (user.role.name) {
      case UserRole.Owner:
        return colors.orange[500];
      case UserRole.Moderator:
        return colors.black;
      default:
        return colors.gray[500];
    }
  }, [user.role.name]);

  const rolePillIconByRoleName = useMemo(() => {
    switch (user.role.name) {
      case UserRole.Owner:
        return (
          <View style={[styles.pillIconBadge, { backgroundColor: colors.orange[500] }]}>
            <Icon name="star-fill" size={12} color={colors.white} />
          </View>
        );
      case UserRole.Moderator:
        return <Icon name="star-fill" size={12} color={colors.white} />;
      default:
        return null;
    }
  }, [user.role.name]);

  return (
    <TouchableOpacity
      key={user.id}
      style={styles.container}
      disabled={cardType == ChannelMemberCardType.Locked}
      onPress={() => cardType != ChannelMemberCardType.Locked && onPress && onPress()}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <UserAvatar uri={user.profilePhotoURL} size={50} />
        <View style={styles.infoContainer}>
          <Text fontWeight="700">{fullName}</Text>
          <View style={[styles.rolePill, rolePillStyle]}>
            {rolePillIconByRoleName}
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
