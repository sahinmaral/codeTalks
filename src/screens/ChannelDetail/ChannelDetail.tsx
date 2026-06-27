import { useBubbleContentMenu } from '@/components/BubbleContentMenu';
import UpdateChannelDescriptionModal from '@/components/BubbleContentMenu/Contents/UpdateChannelDescriptionModal';
import UpdateChannelJoinPolicyModal from '@/components/BubbleContentMenu/Contents/UpdateChannelJoinPolicyModal';
import UpdateChannelNameModal from '@/components/BubbleContentMenu/Contents/UpdateChannelNameModal';
import UpdateChannelThumbnailPhotoModal from '@/components/BubbleContentMenu/Contents/UpdateChannelThumbnailPhotoModal';
import ChannelThumbnail from '@/components/ChannelThumbnail';
import { useConfirmationDialog } from '@/components/ConfirmationDialog';
import CustomToggleSwitch from '@/components/CustomToggleSwitch';
import Divider from '@/components/Divider';
import Header from '@/components/Header';
import Text from '@/components/Text';
import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { UserRole } from '@/enums/UserRole';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveChannel } from '@/redux/reducers/activeChannelReducer';
import {
  fetchDeleteChannel,
  fetchGetChannelById,
  fetchRemoveMemberFromChannel,
} from '@/services/apiServices/channels';
import colors from '@/styles/colors';
import { ChannelDetailDto, RootStackParamList } from '@/types';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import Loading from '../Loading';
import makeStyles from './ChannelDetail.styles';

interface FetchState {
  loading: boolean;
  data: ChannelDetailDto | null;
  error: Error | null;
}

interface ChannelDetailProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelDetail'>;
}

function ChannelDetail({ navigation }: ChannelDetailProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { show } = useBubbleContentMenu();

  const [fetchResult, setFetchResult] = useState<FetchState>({
    loading: true,
    data: null,
    error: null,
  });

  const dispatch = useAppDispatch();
  const { confirm } = useConfirmationDialog();

  const user = useAppSelector(state => state.app.user);
  const activeChannel = useAppSelector(state => state.activeChannel.channel);
  const channelId = activeChannel?.id ?? '';
  const channelName = activeChannel?.name ?? '';
  const channelDescription = activeChannel?.description;
  const channelInviteCode = activeChannel?.inviteCode ?? '';
  const channelCreatedAt = activeChannel?.createdAt ?? '';

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setFetchResult(prev => ({ ...prev, loading: true }));

          const response = await fetchGetChannelById(channelId);
          setFetchResult(prev => ({ ...prev, data: response.data }));
          dispatch(
            setActiveChannel({
              id: response.data.id,
              name: response.data.name,
              description: response.data.description,
              inviteCode: response.data.inviteCode,
              joinPolicy: response.data.joinPolicy,
              createdAt: response.data.createdAt,
              role: response.data.role.name as UserRole,
            }),
          );
        } catch (error) {
          setFetchResult(prev => ({ ...prev, error: error as Error }));
        } finally {
          setFetchResult(prev => ({ ...prev, loading: false }));
        }
      })();
    }, []),
  );

  const handleRemoveFromChannel = async () => {
    try {
      await fetchRemoveMemberFromChannel(channelId, user!.id);
      navigation.navigate('ActiveChannelList');
      showMessage({ message: 'You successfully removed from this channel', type: 'success' });
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await fetchDeleteChannel(channelId);
      navigation.navigate('ActiveChannelList');
      showMessage({ message: 'You successfully deleted this channel', type: 'success' });
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    }
  };

  const isUserAllowedToUseAdminPanel = useMemo(() => {
    return (
      fetchResult.data?.role?.name === UserRole.Moderator ||
      fetchResult.data?.role?.name === UserRole.Owner
    );
  }, [fetchResult.data]);

  const isUserOwner = useMemo(() => {
    return fetchResult.data?.role?.name === UserRole.Owner;
  }, [fetchResult.data]);

  if (fetchResult.loading && !fetchResult.data) {
    return <Loading text="Kanalın detayı yüklenirken lütfen bekleyiniz ..." />;
  }

  if (!fetchResult.data) {
    return null;
  }

  const channel = fetchResult.data;

  return (
    <View style={styles.container}>
      <Header title={channelName} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, styles.infoCard]}>
          <View style={styles.identitySection}>
            <View style={styles.thumbnailContainer}>
              <View style={styles.thumbnailRing}>
                <ChannelThumbnail
                  uri={activeChannel?.thumbnailPhotoURL}
                  size={80}
                  onPress={() => show(<UpdateChannelThumbnailPhotoModal />)}
                />
              </View>
            </View>
            <View style={styles.nameSection}>
              <Text size="large" fontWeight="700" style={styles.centerText}>
                {channelName}
              </Text>

              <Text size="medium" color={theme.text.tertiary} style={styles.centerText}>
                {channelDescription}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={styles.metaSection}>
            <View style={styles.metaRow}>
              <Text color={theme.text.tertiary}>Channel ID</Text>
              <Text>#{channelInviteCode}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text color={theme.text.tertiary}>Created</Text>
              <Text>{format(new Date(channelCreatedAt), 'MMM yyyy')}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text color={theme.text.tertiary}>Members</Text>
              <Text>{channel.memberCount}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text size="medium" fontWeight="700" color={theme.text.tertiary}>
            MEMBERS
          </Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                navigation.navigate('ChannelMembersList');
              }}
            >
              <View style={styles.rowLeading}>
                <Icon name="ri-group-line" color={theme.text.tertiary} />
                <Text fontWeight="700">View All Members</Text>
              </View>
              <View>
                <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text size="medium" fontWeight="700" color={theme.text.tertiary}>
            NOTIFICATIONS
          </Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBordered]}>
              <View style={styles.rowLeading}>
                <Icon name="ri-notification-line" color={theme.text.tertiary} />
                <Text fontWeight="700">Mute this Channel</Text>
              </View>
              <View>
                <CustomToggleSwitch value={true} onValueChange={() => {}} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowLeading}>
                <Icon name="ri-music-2-line" color={theme.text.tertiary} />
                <Text fontWeight="700">Notification Sound</Text>
              </View>
              <View>
                <CustomToggleSwitch value={false} onValueChange={() => {}} />
              </View>
            </View>
          </View>
        </View>

        {isUserAllowedToUseAdminPanel ? (
          <View>
            <Text size="medium" fontWeight="700" color={colors.orange[400]}>
              ADMIN PANEL
            </Text>
            <View style={[styles.card, styles.adminCard]}>
              {isUserOwner ? (
                <>
                  <TouchableOpacity
                    style={[styles.row, styles.rowBordered]}
                    onPress={() => {
                      show(<UpdateChannelNameModal />);
                    }}
                  >
                    <View style={styles.rowLeading}>
                      <Icon name="ri-edit-box-line" color={theme.text.tertiary} />
                      <Text fontWeight="700">Edit Channel Name</Text>
                    </View>
                    <View>
                      <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.row, styles.rowBordered]} onPress={() => {}}>
                    <View style={styles.rowLeading}>
                      <Icon name="ri-image-edit-line" color={theme.text.tertiary} />
                      <Text fontWeight="700">Set/Change Thumbnail Image</Text>
                    </View>
                    <View>
                      <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.row, styles.rowBordered]}
                    onPress={() => {
                      show(<UpdateChannelDescriptionModal />);
                    }}
                  >
                    <View style={styles.rowLeading}>
                      <Icon name="ri-list-check" color={theme.text.tertiary} />
                      <Text fontWeight="700">Edit Description</Text>
                    </View>
                    <View>
                      <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.row, styles.rowBordered]}
                    onPress={() => {
                      show(<UpdateChannelJoinPolicyModal />);
                    }}
                  >
                    <View style={styles.rowLeading}>
                      <Icon name="ri-shield-keyhole-line" color={theme.text.tertiary} />
                      <Text fontWeight="700">Edit Join Policy</Text>
                    </View>
                    <View>
                      <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                </>
              ) : null}

              {channel.joinPolicy === ChannelJoinPolicy.Request ? (
                <TouchableOpacity
                  style={[styles.row, styles.rowBordered]}
                  onPress={() => {
                    navigation.navigate('ChannelPendingJoinRequestsList');
                  }}
                >
                  <View style={styles.rowLeading}>
                    <Icon name="ri-user-add-line" color={theme.text.tertiary} />
                    <Text fontWeight="700">Pending Join Requests</Text>
                  </View>
                  <View>
                    <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                  </View>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.row, styles.rowBordered]}
                onPress={() => {
                  navigation.navigate('RemoveMemberFromChannel');
                }}
              >
                <View style={styles.rowLeading}>
                  <Icon name="ri-user-unfollow-line" color={theme.text.tertiary} />
                  <Text fontWeight="700">Remove a Member</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  navigation.navigate('ChannelBannedMembersList');
                }}
              >
                <View style={styles.rowLeading}>
                  <Icon name="ri-forbid-line" color={theme.text.tertiary} />
                  <Text fontWeight="700">Banned Members</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.row, styles.rowBordered]}
            onPress={() =>
              confirm({
                theme: 'warning',
                icon: 'logout-box-r-line',
                title: 'Leave Channel?',
                description: `Are you sure you want to leave #${channelName}? You will need to send a new join request to rejoin this channel.`,
                confirmTitle: 'Leave Channel',
                onConfirm: () => handleRemoveFromChannel(),
              })
            }
          >
            <View style={styles.rowLeading}>
              <Icon name="logout-box-r-line" color={colors.warning} />
              <Text fontWeight="700" color={colors.warning}>
                Leave Channel
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              confirm({
                theme: 'danger',
                icon: 'ri-delete-bin-line',
                title: 'Delete Channel?',
                description: `Are you sure you want to delete #${channelName}? This action is permanent and cannot be undone. All messages and members will be removed.`,
                confirmTitle: 'Delete Channel',
                onConfirm: () => handleDeleteChannel(),
              })
            }
          >
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
