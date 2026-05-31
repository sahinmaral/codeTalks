import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './ChannelDetail.styles';
import colors from '@/styles/colors';
import Icon from 'react-native-remix-icon';
import ChannelDetailUserCard from '@/components/ChannelDetailUserCard';
import { fetchGetChannelById } from '@/services/channels';
import Loading from '../Loading';
import { useAppSelector } from '@/redux/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { ChannelDetailDto, ChannelUser, PaginatedResult, RootStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Text from '@/components/Text';
import { format } from 'date-fns';
import Divider from '@/components/Divider';
import Header from '@/components/Header';
import CustomToggleSwitch from '@/components/CustomToggleSwitch';

interface FetchState {
  loading: boolean;
  data: ChannelDetailDto;
  error: Error | null;
}

interface ChannelDetailProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelDetail'>;
  route: RouteProp<RootStackParamList, 'ChannelDetail'>;
}

function ChannelDetail({ navigation, route }: ChannelDetailProps) {
  const { channelId, channelName, channelDescription, channelInviteCode, channelCreatedAt } =
    route.params;

  const scrollViewRef = useRef<ScrollView>(null);

  const [fetchResult, setFetchResult] = useState<FetchState>({
    loading: true,
    data: null,
    error: null,
  });

  const user = useAppSelector(state => state.app.user);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setFetchResult(prev => ({ ...prev, loading: true }));

          const response = await fetchGetChannelById(channelId);
          setFetchResult(prev => ({ ...prev, data: response.data }));
        } catch (error) {
          setFetchResult(prev => ({ ...prev, error: error as Error }));
        } finally {
          setFetchResult(prev => ({ ...prev, loading: false }));
        }
      })();
    }, []),
  );

  const isUserModeratorAtThisChannel = useMemo(() => {
    return fetchResult.data?.role?.name === 'Moderator';
  }, [fetchResult.data]);

  if (fetchResult.loading && !fetchResult.data) {
    return <Loading text="Kanalın detayı yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      <Header title={channelName} showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, styles.infoCard]}>
          <View style={styles.identitySection}>
            <View style={styles.thumbnailContainer}>
              <View style={styles.thumbnailRing}>
                <View style={styles.thumbnail}>
                  <Text size="xxlarge" fontWeight="800" color={colors.white}>
                    #
                  </Text>
                  {/* {user?.profilePhotoURL ? (
                  <Image
                    source={{ uri: user.profilePhotoURL }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                  />
                ) : null} */}
                </View>
              </View>
            </View>
            <View style={styles.nameSection}>
              <Text size="large" fontWeight="700" style={styles.centerText}>
                {channelName}
              </Text>

              <Text size="medium" color={colors.gray[400]} style={styles.centerText}>
                {channelDescription}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={styles.metaSection}>
            <View style={styles.metaRow}>
              <Text color={colors.gray[400]}>Channel ID</Text>
              <Text>#{channelInviteCode}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text color={colors.gray[400]}>Created</Text>
              <Text>{format(new Date(channelCreatedAt), 'MMM yyyy')}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text color={colors.gray[400]}>Members</Text>
              <Text>{fetchResult.data.memberCount}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text size="medium" fontWeight="700" color={colors.gray[400]}>
            MEMBERS
          </Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => {}}>
              <View style={styles.rowLeading}>
                <Icon name="ri-group-line" color={colors.gray[400]} />
                <Text fontWeight="700">View All Members</Text>
              </View>
              <View>
                <Icon name="ri-arrow-right-s-line" size={24} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text size="medium" fontWeight="700" color={colors.gray[400]}>
            NOTIFICATIONS
          </Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBordered]}>
              <View style={styles.rowLeading}>
                <Icon name="ri-notification-line" color={colors.gray[400]} />
                <Text fontWeight="700">Mute this Channel</Text>
              </View>
              <View>
                <CustomToggleSwitch value={true} onValueChange={() => {}} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeading}>
                <Icon name="ri-music-2-line" color={colors.gray[400]} />
                <Text fontWeight="700">Notification Sound</Text>
              </View>
              <View>
                <CustomToggleSwitch value={false} onValueChange={() => {}} />
              </View>
            </View>
          </View>
        </View>

        {isUserModeratorAtThisChannel ? (
          <View>
            <Text size="medium" fontWeight="700" color={colors.orange[400]}>
              ADMIN PANEL
            </Text>
            <View style={[styles.card, styles.adminCard]}>
              <TouchableOpacity style={[styles.row, styles.rowBordered]} onPress={() => {}}>
                <View style={styles.rowLeading}>
                  <Icon name="ri-edit-box-line" color={colors.gray[400]} />
                  <Text fontWeight="700">Edit Channel Name</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={colors.gray[400]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.row, styles.rowBordered]} onPress={() => {}}>
                <View style={styles.rowLeading}>
                  <Icon name="ri-image-edit-line" color={colors.gray[400]} />
                  <Text fontWeight="700">Set/Change Thumbnail Image</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={colors.gray[400]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.row, styles.rowBordered]} onPress={() => {}}>
                <View style={styles.rowLeading}>
                  <Icon name="ri-list-check" color={colors.gray[400]} />
                  <Text fontWeight="700">Edit Description</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={colors.gray[400]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.row, styles.rowBordered]} onPress={() => {}}>
                <View style={styles.rowLeading}>
                  <Icon name="ri-user-add-line" color={colors.gray[400]} />
                  <Text fontWeight="700">Pending Join Requests</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={colors.gray[400]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.row} onPress={() => {}}>
                <View style={styles.rowLeading}>
                  <Icon name="ri-user-unfollow-line" color={colors.gray[400]} />
                  <Text fontWeight="700">Remove a Member</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={colors.gray[400]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <TouchableOpacity style={[styles.row, styles.rowBordered]} onPress={() => {}}>
            <View style={styles.rowLeading}>
              <Icon name="logout-box-r-line" color={colors.warning} />
              <Text fontWeight="700" color={colors.warning}>
                Leave Channel
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => {}}>
            <View style={styles.rowLeading}>
              <Icon name="ri-delete-bin-line" color={colors.danger} />
              <Text fontWeight="700" color={colors.danger}>
                Delete Channel
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default ChannelDetail;
