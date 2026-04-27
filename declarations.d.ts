declare module 'react-native-remix-icon' {
  import React from 'react';
  interface IconProps {
    name: string;
    size?: number | string;
    color?: string;
  }
  const Icon: React.FC<IconProps>;
  export default Icon;
}

declare module '*.json' {
  const value: any;
  export default value;
}
