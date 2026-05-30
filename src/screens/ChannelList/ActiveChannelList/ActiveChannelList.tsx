import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import colors from '@/styles/colors';
import Icon from 'react-native-remix-icon';
import styles from '../ChannelList.styles';
import ActiveChannelCard from '@/components/ActiveChannelCard';
import Loading from '@/screens/Loading';
import { Channel, RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomepageActionList from '@/components/BubbleContentMenu/Contents/HomepageActionList';
import Header from '@/components/Header';
import useSignalRConnection from '@/hooks/useSignalRConnection';
import NoChannelRegisteredCard from '@/components/NoChannelRegisteredCard';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';

interface ActiveChannelListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActiveChannelList'>;
}

function ActiveChannelList({ navigation }: ActiveChannelListProps) {
  const user = useAppSelector(state => state.app.user);
  const { show, hide, visible } = useBubbleContentMenu();

  const { data: channels, isLoading } = useSignalRConnection<PaginatedResult<Channel>>({
    receiveEvent: 'ReceiveActiveChannelsByUserId',
    sendMethod: 'SendActiveChannelsByUserId',
    invokeArgs: [{ userId: user?.id, page: 1, pageSize: 10 }],
  });

  if (isLoading) {
    return <Loading text="Kanallar yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Active Channels"
        description="Welcome back!"
        showRightIcon={true}
        rightIcon="logout-box-r-line"
        onRightIconPress={() => console.log('Logged out')}
      />

      {channels?.items.length === 0 ? (
        <NoChannelRegisteredCard />
      ) : (
        <ScrollView
          style={styles.channelListContainer}
          contentContainerStyle={styles.channelListContainerContent}
        >
          {channels?.items.map(channel => (
            <ActiveChannelCard key={channel.id} navigation={navigation} channel={channel} />
          ))}
        </ScrollView>
      )}

      {!visible && (
        <TouchableOpacity
          onPress={() => show(<HomepageActionList />)}
          style={styles.showBubbleContentMenuButton}
        >
          <Icon name={'ri-add-line'} size={24} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ActiveChannelList;
