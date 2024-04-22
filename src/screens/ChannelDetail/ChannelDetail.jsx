import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./ChannelDetail.styles";
import colors from "../../styles/colors";
import Icon from "react-native-remix-icon";
import ChannelDetailUserCard from "../../components/ChannelDetailUserCard";
import { fetchGetUsersByChannelId } from "../../services/users";
import { fetchGetUsersDetailAtChannelByChannelId } from "../../services/channels";
import Loading from "../Loading";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import CustomModal from "../../components/CustomModal";
import UpdateChannelNameModalContent from "../../components/ModalContent/UpdateChannelNameModalContent/UpdateChannelNameModalContent";

function ChannelDetail({ navigation, route }) {
  const { channelId, channelName } = route.params;

  const scrollViewRef = useRef();

  const [fetchResult, setFetchResult] = useState({
    loading: true,
    results: null,
    error: null,
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [visibleUserSearchInput, setVisibleUserSearchInput] = useState(false);

  const { user } = useSelector((state) => state.app);

  const toggleVisibleUserSearchInput = () => {
    setVisibleUserSearchInput(!visibleUserSearchInput);
    setUserName("");
  };

  const fetchUsers = async (index) => {
    try {
      setFetchResult((prevState) => ({ ...prevState, loading: true }));
      const response = await fetchGetUsersByChannelId(channelId, index);

      setFetchResult((prevState) => ({
        ...prevState,
        metaData: {
          count: response.data.count,
          size: response.data.size,
          index: response.data.index,
          pages: response.data.pages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
        },
        users: [...prevState.users, ...response.data.items],
      }));
    } catch (error) {
      setFetchResult((prevState) => ({
        ...prevState,
        error,
      }));
    } finally {
      setFetchResult((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const isUserModeratorAtThisChannel = useMemo(() => {
    if (
      fetchResult.results &&
      fetchResult.results.currentUserDetailAtChannelFetch.userDetail
    ) {
      return (
        fetchResult.results.currentUserDetailAtChannelFetch.userDetail.role
          .name === "Moderator"
      );
    }
  }, [fetchResult.results]);

  const remainingUserCount = useMemo(() => {
    if (fetchResult.results && fetchResult.results.usersFetch.metaData) {
      if (
        fetchResult.results.usersFetch.metaData.count >
        fetchResult.results.usersFetch.users.length
      )
        return (
          fetchResult.results.usersFetch.metaData.count -
          fetchResult.results.usersFetch.users.length
        );
      else return fetchResult.results.usersFetch.metaData.count;
    }
  }, [fetchResult.results]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setFetchResult((prevState) => ({ ...prevState, loading: true }));

          const promiseResult = await Promise.all([
            fetchGetUsersByChannelId(channelId),
            fetchGetUsersDetailAtChannelByChannelId(channelId, user.id),
          ]);

          const usersPromiseResult = promiseResult[0];
          const currentUserDetailAtChannelPromiseResult = promiseResult[1];

          setFetchResult((prevState) => ({
            ...prevState,
            results: {
              usersFetch: {
                metaData: {
                  count: usersPromiseResult.data.count,
                  size: usersPromiseResult.data.size,
                  index: usersPromiseResult.data.index,
                  pages: usersPromiseResult.data.pages,
                  hasNext: usersPromiseResult.data.hasNext,
                  hasPrevious: usersPromiseResult.data.hasPrevious,
                },
                users: usersPromiseResult.data.items,
              },
              currentUserDetailAtChannelFetch: {
                userDetail: currentUserDetailAtChannelPromiseResult.data,
              },
            },
          }));
        } catch (error) {
          setFetchResult((prevState) => ({
            ...prevState,
            error,
          }));
        } finally {
          setFetchResult((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      })();
    }, [])
  );

  if (fetchResult.loading && !fetchResult.metaData) {
    return <Loading text="Kanalın detayı yüklenirken lütfen bekleyiniz ..." />;
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 / 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-line" size="26" color="black"></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", flex: 2 / 10 }}>
        <Image
          style={styles.photo.container}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
      </View>
      <View style={{ flex: 1.5 / 10 }}>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <View style={{ flex: 9 / 10, alignSelf: "center" }}>
            <Text
              style={{
                fontSize: 20,
                color: colors.black,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {channelName}
            </Text>
          </View>
          {isUserModeratorAtThisChannel ? (
            <View
              style={{
                flex: 1 / 10,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon name="pencil-line" size="26" color="black"></Icon>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: colors.black }}>
            Grup · {fetchResult.results.usersFetch.metaData.count} üye
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1 / 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {visibleUserSearchInput ? (
          <View style={{ flex: 9 / 10, height: "100%" }}>
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
          <View
            style={{ height: "100%", flex: 9 / 10, justifyContent: "center" }}
          >
            <Text
              style={{
                color: colors.black,
                fontWeight: "bold",
              }}
            >
              106 üye
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={toggleVisibleUserSearchInput}
          style={{
            height: "100%",
            flex: 1 / 10,
            paddingTop: 10,
            paddingRight: 10,
            paddingLeft: 10,
            alignItems: "flex-end",
            justifyContent: "flex-start",
          }}
        >
          <Icon name="search-line" size="26" color="black"></Icon>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 4.5 / 10 }}>
        {!fetchResult.loading && fetchResult.results.usersFetch.metaData ? (
          <View style={{ flex: 1, gap: 10 }}>
            <ScrollView
              style={{ flex: 1 }}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            >
              {fetchResult.results.usersFetch.users.map((user) => {
                return <ChannelDetailUserCard user={user} key={user.id} />;
              })}

              {fetchResult.results.usersFetch.metaData.hasNext && (
                <TouchableOpacity
                  onPress={() =>
                    fetchUsers(
                      fetchResult.results.usersFetch.metaData.index + 1
                    )
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: colors.black,
                    }}
                  >
                    Tümünü gör ({remainingUserCount}) kişi daha
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={42} />
            <Text
              style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}
            >
              Kullanıcılar yüklenirken lütfen bekleyiniz ...
            </Text>
          </View>
        )}
      </View>
      <CustomModal toggleModal={toggleModal} modalVisible={modalVisible}>
        <UpdateChannelNameModalContent
          channelId={channelId}
          channelName={channelName}
          userId={user.id}
          navigation={navigation}
          toggleModal={toggleModal}
        />
      </CustomModal>
    </View>
  );
}

export default ChannelDetail;
