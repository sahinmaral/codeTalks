import { useBubbleContentMenu } from '@/components/BubbleContentMenu';
import UpdateChannelDescriptionModal from '@/components/BubbleContentMenu/Contents/UpdateChannelDescriptionModal';
import UpdateChannelJoinPolicyModal from '@/components/BubbleContentMenu/Contents/UpdateChannelJoinPolicyModal';
import UpdateChannelMuteSettingModal from '@/components/BubbleContentMenu/Contents/UpdateChannelMuteSettingModal';
import UpdateChannelNameModal from '@/components/BubbleContentMenu/Contents/UpdateChannelNameModal';
import UpdateChannelThumbnailPhotoModal from '@/components/BubbleContentMenu/Contents/UpdateChannelThumbnailPhotoModal';
import ChannelThumbnail from '@/components/ChannelThumbnail';
import { useConfirmationDialog } from '@/components/ConfirmationDialog';
import Divider from '@/components/Divider';
import Header from '@/components/Header';
import Text from '@/components/Text';
import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { UserRole } from '@/enums/UserRole';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveChannel } from '@/redux/reducers/activeChannelReducer';
import { removeChannelMuteSetting } from '@/redux/reducers/appReducer';
import {
  fetchDeleteChannel,
  fetchGetChannelById,
  fetchRemoveMemberFromChannel,
} from '@/services/apiServices/channels';
import { fetchUnmuteChannel } from '@/services/apiServices/users';
import colors from '@/styles/colors';
import { ChannelDetailDto, RootStackParamList } from '@/types';
import { formatMutedUntil } from '@/utils/channelMuteSetting';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { getDateFnsLocale } from '@/utils/dateFnsLocale';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
  const channelMuteSettings = useAppSelector(state => state.app.channelMuteSettings);
  const activeChannel = useAppSelector(state => state.activeChannel.channel);
  const currentChannelMuteSetting = useMemo(() => {
    return channelMuteSettings.find(setting => setting.channelId === activeChannel?.id);
  }, [channelMuteSettings, activeChannel]);

  // Derived from the store rather than held locally: the mute settings are seeded at login,
  // updated by the mute menu and cleared by handleUnmuteChannel, so redux is the only source
  // of truth for whether this channel is muted.
  const isChannelMuted = currentChannelMuteSetting?.isMuted ?? false;

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
      // channelId is a dependency: the active channel can change under a mounted screen
      // (e.g. a notification tap), and empty deps would keep refetching the first one.
    }, [channelId, dispatch]),
  );

  const handleRemoveFromChannel = async () => {
    try {
      await fetchRemoveMemberFromChannel(channelId, user!.id);
      navigation.navigate('ActiveChannelList');
      showMessage({ message: t('channels.removedFromChannel'), type: 'success' });
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await fetchDeleteChannel(channelId);
      navigation.navigate('ActiveChannelList');
      showMessage({ message: t('channels.deletedChannel'), type: 'success' });
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
      }
    }
  };

  const handleUnmuteChannel = async () => {
    try {
      await fetchUnmuteChannel(channelId);
      dispatch(removeChannelMuteSetting(channelId));
      navigation.navigate('ActiveChannelList');
      showMessage({ message: t('channels.unmutedChannel'), type: 'success' });
    } catch (exception) {
      if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: t('common.errorOccurred'), type: 'danger' });
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
    return <Loading text={t('channels.loadingChannelDetail')} />;
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
              <Text color={theme.text.tertiary}>{t('channels.channelId')}</Text>
              <Text>#{channelInviteCode}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text color={theme.text.tertiary}>{t('channels.created')}</Text>
              <Text>
                {format(new Date(channelCreatedAt), 'MMM yyyy', { locale: getDateFnsLocale() })}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text color={theme.text.tertiary}>{t('channels.members')}</Text>
              <Text>{channel.memberCount}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text size="medium" fontWeight="700" color={theme.text.tertiary}>
            {t('channels.membersSection')}
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
                <Text fontWeight="700">{t('channels.viewAllMembers')}</Text>
              </View>
              <View>
                <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text size="medium" fontWeight="700" color={theme.text.tertiary}>
            {t('channels.notifications')}
          </Text>
          <View style={styles.card}>
            {!isChannelMuted ? (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  show(<UpdateChannelMuteSettingModal />);
                }}
              >
                <View style={styles.rowLeading}>
                  <Icon name="ri-notification-line" color={theme.text.tertiary} />
                  <Text fontWeight="700">{t('channels.muteChannel')}</Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  confirm({
                    theme: 'warning',
                    icon: 'ri-notification-off-line',
                    title: t('channels.unmuteTitle'),
                    description: t('channels.unmuteDescription', { channel: channelName }),
                    confirmTitle: t('channels.unmuteConfirm'),
                    onConfirm: () => handleUnmuteChannel(),
                  });
                }}
              >
                <View style={styles.rowLeading}>
                  <Icon name="ri-notification-off-line" color={theme.text.tertiary} />
                  <Text fontWeight="700">
                    {t('channels.mutedUntil', {
                      time: formatMutedUntil(currentChannelMuteSetting?.mutedUntil),
                    })}
                  </Text>
                </View>
                <View>
                  <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isUserAllowedToUseAdminPanel ? (
          <View>
            <Text size="medium" fontWeight="700" color={colors.orange[400]}>
              {t('channels.adminPanel')}
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
                      <Text fontWeight="700">{t('channels.editChannelName')}</Text>
                    </View>
                    <View>
                      <Icon name="ri-arrow-right-s-line" size={24} color={theme.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.row, styles.rowBordered]}
                    onPress={() => {
                      show(<UpdateChannelThumbnailPhotoModal />);
                    }}
                  >
                    <View style={styles.rowLeading}>
                      <Icon name="ri-image-edit-line" color={theme.text.tertiary} />
                      <Text fontWeight="700">{t('channels.setChangeThumbnail')}</Text>
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
                      <Text fontWeight="700">{t('channels.editDescription')}</Text>
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
                      <Text fontWeight="700">{t('channels.editJoinPolicy')}</Text>
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
                    <Text fontWeight="700">{t('channels.pendingJoinRequests')}</Text>
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
                  <Text fontWeight="700">{t('channels.removeMemberRow')}</Text>
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
                  <Text fontWeight="700">{t('channels.bannedMembersRow')}</Text>
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
                title: t('channels.leaveTitle'),
                description: t('channels.leaveDescription', { channel: channelName }),
                confirmTitle: t('channels.leaveChannel'),
                onConfirm: () => handleRemoveFromChannel(),
              })
            }
          >
            <View style={styles.rowLeading}>
              <Icon name="logout-box-r-line" color={colors.warning} />
              <Text fontWeight="700" color={colors.warning}>
                {t('channels.leaveChannel')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              confirm({
                theme: 'danger',
                icon: 'ri-delete-bin-line',
                title: t('channels.deleteTitle'),
                description: t('channels.deleteDescription', { channel: channelName }),
                confirmTitle: t('channels.deleteChannel'),
                onConfirm: () => handleDeleteChannel(),
              })
            }
          >
            <View style={styles.rowLeading}>
              <Icon name="ri-delete-bin-line" color={colors.danger} />
              <Text fontWeight="700" color={colors.danger}>
                {t('channels.deleteChannel')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default ChannelDetail;
