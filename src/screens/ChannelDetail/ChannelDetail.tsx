import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './ChannelDetail.styles';
import colors from '../../styles/colors';
import Icon from 'react-native-remix-icon';
import ChannelDetailUserCard from '../../components/ChannelDetailUserCard';
import { fetchGetUsersByChannelId } from '../../services/users';
import { fetchGetUsersDetailAtChannelByChannelId } from '../../services/channels';
import Loading from '../Loading';
import { useAppSelector } from '../../redux/hooks';
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '../../components/CustomModal';
import UpdateChannelNameModalContent from '../../components/ModalContent/UpdateChannelNameModalContent/UpdateChannelNameModalContent';
import { ChannelUser, PaginatedResult, RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

interface PaginationMeta {
  count: number;
  size: number;
  index: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface UsersFetch {
  metaData: PaginationMeta;
  users: ChannelUser[];
}

interface CurrentUserDetailFetch {
  userDetail: { role: { name: string } };
}

interface FetchResults {
  usersFetch: UsersFetch;
  currentUserDetailAtChannelFetch: CurrentUserDetailFetch;
}

interface FetchState {
  loading: boolean;
  results: FetchResults | null;
  error: Error | null;
}

interface ChannelDetailProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelDetail'>;
  route: RouteProp<RootStackParamList, 'ChannelDetail'>;
}

function ChannelDetail({ navigation, route }: ChannelDetailProps) {
  const { channelId, channelName } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);

  const [fetchResult, setFetchResult] = useState<FetchState>({
    loading: true,
    results: null,
    error: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [visibleUserSearchInput, setVisibleUserSearchInput] = useState(false);

  const user = useAppSelector((state) => state.app.user);

  const toggleVisibleUserSearchInput = () => {
    setVisibleUserSearchInput((v) => !v);
    setUserName('');
  };

  const fetchUsers = async (index: number) => {
    try {
      setFetchResult((prev) => ({ ...prev, loading: true }));
      const response = await fetchGetUsersByChannelId(channelId, index);
      const data: PaginatedResult<ChannelUser> = response.data;

      setFetchResult((prev) => {
        if (!prev.results) return prev;
        return {
          ...prev,
          results: {
            ...prev.results,
            usersFetch: {
              metaData: {
                count: data.count,
                size: data.size,
                index: data.index,
                pages: data.pages,
                hasNext: data.hasNext,
                hasPrevious: data.hasPrevious,
              },
              users: [...prev.results.usersFetch.users, ...data.items],
            },
          },
        };
      });
    } catch (error) {
      setFetchResult((prev) => ({ ...prev, error: error as Error }));
    } finally {
      setFetchResult((prev) => ({ ...prev, loading: false }));
    }
  };

  const isUserModeratorAtThisChannel = useMemo(() => {
    return (
      fetchResult.results?.currentUserDetailAtChannelFetch.userDetail.role.name === 'Moderator'
    );
  }, [fetchResult.results]);

  const remainingUserCount = useMemo(() => {
    const meta = fetchResult.results?.usersFetch.metaData;
    const users = fetchResult.results?.usersFetch.users;
    if (!meta || !users) return 0;
    return meta.count > users.length ? meta.count - users.length : meta.count;
  }, [fetchResult.results]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setFetchResult((prev) => ({ ...prev, loading: true }));

          const [usersRes, userDetailRes] = await Promise.all([
            fetchGetUsersByChannelId(channelId),
            fetchGetUsersDetailAtChannelByChannelId(channelId, user!.id),
          ]);

          const usersData: PaginatedResult<ChannelUser> = usersRes.data;

          setFetchResult((prev) => ({
            ...prev,
            results: {
              usersFetch: {
                metaData: {
                  count: usersData.count,
                  size: usersData.size,
                  index: usersData.index,
                  pages: usersData.pages,
                  hasNext: usersData.hasNext,
                  hasPrevious: usersData.hasPrevious,
                },
                users: usersData.items,
              },
              currentUserDetailAtChannelFetch: {
                userDetail: userDetailRes.data,
              },
            },
          }));
        } catch (error) {
          setFetchResult((prev) => ({ ...prev, error: error as Error }));
        } finally {
          setFetchResult((prev) => ({ ...prev, loading: false }));
        }
      })();
    }, []),
  );

  if (fetchResult.loading && !fetchResult.results) {
    return <Loading text="Kanalın detayı yüklenirken lütfen bekleyiniz ..." />;
  }

  const toggleModal = () => setModalVisible((v) => !v);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 / 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-line" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', flex: 2 / 10 }}>
        <Image
          style={styles.photoContainer}
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
      </View>

      <View style={{ flex: 1.5 / 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ flex: 9 / 10, alignSelf: 'center' }}>
            <Text
              style={{ fontSize: 20, color: colors.black, textAlign: 'center', fontWeight: 'bold' }}
            >
              {channelName}
            </Text>
          </View>
          {isUserModeratorAtThisChannel ? (
            <View
              style={{
                flex: 1 / 10,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon name="pencil-line" size={26} color="black" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: colors.black }}>
            Grup · {fetchResult.results?.usersFetch.metaData.count} üye
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1 / 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {visibleUserSearchInput ? (
          <View style={{ flex: 9 / 10, height: '100%' }}>
            <TextInput
              value={userName}
              onChangeText={setUserName}
              placeholderTextColor={colors.black}
              style={{
                backgroundColor: colors.stone[300],
                borderRadius: 10,
                paddingLeft: 10,
              }}
              placeholder="Kullanıcı adı giriniz ..."
            />
          </View>
        ) : (
          <View style={{ height: '100%', flex: 9 / 10, justifyContent: 'center' }}>
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>
              {fetchResult.results?.usersFetch.metaData.count} üye
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={toggleVisibleUserSearchInput}
          style={{
            height: '100%',
            flex: 1 / 10,
            paddingTop: 10,
            paddingRight: 10,
            paddingLeft: 10,
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
          }}
        >
          <Icon name="search-line" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 4.5 / 10 }}>
        {!fetchResult.loading && fetchResult.results ? (
          <View style={{ flex: 1, gap: 10 }}>
            <ScrollView
              style={{ flex: 1 }}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {fetchResult.results.usersFetch.users.map((u) => (
                <ChannelDetailUserCard user={u} key={u.id} />
              ))}

              {fetchResult.results.usersFetch.metaData.hasNext && (
                <TouchableOpacity
                  onPress={() =>
                    fetchUsers(fetchResult.results!.usersFetch.metaData.index + 1)
                  }
                >
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.black }}>
                    Tümünü gör ({remainingUserCount}) kişi daha
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        ) : (
          <View style={{ flex: 1, gap: 10, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={42} />
            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
              Kullanıcılar yüklenirken lütfen bekleyiniz ...
            </Text>
          </View>
        )}
      </View>

      <CustomModal closeAllModals={toggleModal} containerModalVisible={modalVisible}>
        <UpdateChannelNameModalContent
          channelId={channelId}
          channelName={channelName}
          userId={user!.id}
          navigation={navigation}
          toggleModal={toggleModal}
        />
      </CustomModal>
    </View>
  );
}

export default ChannelDetail;
