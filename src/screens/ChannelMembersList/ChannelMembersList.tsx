import ChannelMemberCard from '@/components/ChannelMemberCard';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Text from '@/components/Text';
import useDebounce from '@/hooks/useDebounce';
import { fetchGetUsersByChannelId } from '@/services/channels';
import colors from '@/styles/colors';
import { ChannelUser, RootStackParamList, UsersAtChannelListModel } from '@/types';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Loading from '../Loading';
import styles from './ChannelMembersList.styles';

type ChannelMembersListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChannelMembersList'>;
  route: RouteProp<RootStackParamList, 'ChannelMembersList'>;
};

interface FetchState {
  loading: boolean;
  data: UsersAtChannelListModel | null;
  error: Error | null;
}

const matchesSearch = (user: ChannelUser, term: string) => {
  if (!term) return true;

  const fullName = [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return fullName.includes(term) || user.userName.toLowerCase().includes(term);
};

const ChannelMembersList = ({ navigation, route }: ChannelMembersListProps) => {
  const { channelId } = route.params;

  const [fetchResult, setFetchResult] = useState<FetchState>({
    loading: true,
    data: null,
    error: null,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setFetchResult(prev => ({ ...prev, loading: true }));

          const response = await fetchGetUsersByChannelId(channelId, {
            search: debouncedSearch,
            index: 0,
          });

          setFetchResult(prev => ({ ...prev, data: response.data, error: null }));
        } catch (error) {
          setFetchResult(prev => ({ ...prev, error: error as Error }));
        } finally {
          setFetchResult(prev => ({ ...prev, loading: false }));
        }
      })();
    }, [channelId, debouncedSearch]),
  );

  const filteredAdmins = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return (fetchResult.data?.admins ?? []).filter(admin => matchesSearch(admin, term));
  }, [fetchResult.data?.admins, debouncedSearch]);

  const members = fetchResult.data?.items ?? [];
  const hasResults = filteredAdmins.length > 0 || members.length > 0;

  if (fetchResult.loading && !fetchResult.data) {
    return <Loading text="Kanaldaki kullanıcılar yüklenirken lütfen bekleyiniz ..." />;
  }

  return (
    <View style={styles.container}>
      <Header title={'Members'} showBackButton onBackPress={() => navigation.goBack()} />

      <View style={styles.searchContainer}>
        <Input
          icon="ri-search-line"
          placeholder="Search members..."
          containerStyle={{ borderRadius: 20, backgroundColor: colors.light }}
          onChangeText={setSearch}
          value={search}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredAdmins.length > 0 && (
          <View>
            <View style={styles.adminMembersHeader}>
              <Text fontWeight="700" color={colors.gray[400]}>
                ADMINS
              </Text>
            </View>
            <View style={styles.adminMembersList}>
              {filteredAdmins.map(admin => (
                <ChannelMemberCard key={admin.id} user={admin} />
              ))}
            </View>
          </View>
        )}

        {members.length > 0 && (
          <View>
            <View style={styles.adminMembersHeader}>
              <Text fontWeight="700" color={colors.gray[400]}>
                MEMBERS
              </Text>
            </View>
            <View style={styles.adminMembersList}>
              {members.map(member => (
                <ChannelMemberCard key={member.id} user={member} />
              ))}
            </View>
          </View>
        )}

        {!hasResults && (
          <View style={styles.adminMembersHeader}>
            <Text color={colors.gray[400]}>
              {debouncedSearch
                ? `"${debouncedSearch}" ile eşleşen kullanıcı bulunamadı.`
                : 'Kanalda kullanıcı bulunamadı.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ChannelMembersList;
