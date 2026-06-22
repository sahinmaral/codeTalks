import React from 'react';
import { Image, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

const defaultChannelImage = require('@/assets/images/default-image.png');

type ChannelThumbnailProps = {
  uri?: string | null;
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function ChannelThumbnail({ uri, size = 50, onPress, style }: ChannelThumbnailProps) {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  const content = <Image style={dimensionStyle} source={uri ? { uri } : defaultChannelImage} />;

  if (onPress) {
    return (
      <TouchableOpacity style={[dimensionStyle, style]} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[dimensionStyle, style]}>{content}</View>;
}

export default ChannelThumbnail;
