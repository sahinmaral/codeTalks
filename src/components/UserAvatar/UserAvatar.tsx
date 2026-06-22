import React from 'react';
import { Image, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

const defaultUserImage = require('@/assets/images/default-user.png');

type UserAvatarProps = {
  uri?: string | null;
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function UserAvatar({ uri, size = 50, onPress, style }: UserAvatarProps) {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  const content = <Image style={dimensionStyle} source={uri ? { uri } : defaultUserImage} />;

  if (onPress) {
    return (
      <TouchableOpacity style={[dimensionStyle, style]} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[dimensionStyle, style]}>{content}</View>;
}

export default UserAvatar;
