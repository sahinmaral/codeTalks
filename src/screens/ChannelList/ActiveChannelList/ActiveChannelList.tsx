import ActiveChannelCard from '@/components/ActiveChannelCard';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import HomepageActionList from '@/components/BubbleContentMenu/Contents/HomepageActionList';
import Header from '@/components/Header';
import NoChannelRegisteredCard from '@/components/NoChannelRegisteredCard';
import useSignalRConnection from '@/hooks/useSignalRConnection';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearUser } from '@/redux/reducers/appReducer';
import ErrorScreen from '@/screens/Error';
import Loading from '@/screens/Loading';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import { Channel, PaginatedResult, RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import makeStyles from '../ChannelList.styles';

interface ActiveChannelListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActiveChannelList'>;
}

function ActiveChannelList({ navigation }: ActiveChannelListProps) {
  const styles = useThemedStyles(makeStyles);
  const user = useAppSelector(state => state.app.user);
  const { show, visible } = useBubbleContentMenu();

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const {
    data: channels,
    isLoading,
    error,
    retry,
  } = useSignalRConnection<PaginatedResult<Channel>>({
    receiveEvent: 'ReceiveActiveChannelsByUserId',
    sendMethod: 'SendActiveChannelsByUserId',
    invokeArgs: [{ page: 1, pageSize: 10 }],
  });

  if (error && !channels) {
    return (
      <ErrorScreen
        description="Kanallar yüklenemedi. Sunucuya bağlanmaya çalışılıyor ..."
        onRetry={retry}
      />
    );
  }

  if (isLoading) {
    return <Loading text="Kanallar yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Active Channels"
        description="Welcome back!"
        rightIcon="logout-box-r-line"
        onRightIconPress={handleLogout}
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
