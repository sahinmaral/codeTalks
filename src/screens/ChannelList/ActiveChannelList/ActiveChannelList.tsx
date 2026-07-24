import ActiveChannelCard from '@/components/ActiveChannelCard';
import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import HomepageActionList from '@/components/BubbleContentMenu/Contents/HomepageActionList';
import Header from '@/components/Header';
import NoChannelRegisteredCard from '@/components/NoChannelRegisteredCard';
import useSignalRConnection from '@/hooks/useSignalRConnection';
import useThemedStyles from '@/hooks/useThemedStyles';
import ErrorScreen from '@/screens/Error';
import Loading from '@/screens/Loading';
import colors from '@/styles/colors';
import { Channel, PaginatedResult, RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import makeStyles from '../ChannelList.styles';

interface ActiveChannelListProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActiveChannelList'>;
}

function ActiveChannelList({ navigation }: ActiveChannelListProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const { show, visible } = useBubbleContentMenu();

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
    return <ErrorScreen description={t('channels.channelsLoadFailedServer')} onRetry={retry} />;
  }

  if (isLoading) {
    return <Loading text={t('channels.loadingChannels')} />;
  }

  return (
    <View style={styles.container}>
      <Header title={t('channels.activeChannelsTitle')} description={t('channels.welcomeBack')} />

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
