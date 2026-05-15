import { Touchable, View } from 'react-native';
import Text from '@/components/Text';
import styles from './MyProfile.styles';
import colors from '@/styles/colors';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { useState } from 'react';
import Icon from 'react-native-remix-icon';

const userPresenceStatuses = [
  {
    status: 'Online',
    color: colors.success,
    label: 'Online',
    description: 'Available and active',
  },
  { status: 'Away', color: colors.warning, label: 'Away', description: 'Not available' },
  { status: 'Busy', color: colors.danger, label: 'Busy', description: 'Do not disturb' },
  {
    status: 'Invisible',
    color: colors.gray[500],
    label: 'Invisible',
    description: 'Not visible to others',
  },
];

function MyProfile() {
  const [currentStatus, setCurrentStatus] = useState(userPresenceStatuses[0]);

  return (
    <View style={styles.container}>
      <Header
        title="My Profile"
        showRightIcon
        rightIcon="settings-5-line"
        onRightIconPress={() => console.log('Settings')}
      />
      <View style={styles.content}>
        <View style={styles.cardInformationContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarInner}>
                {/* <Text style={styles.avatarInitial}>J</Text> */}
              </View>
            </View>
          </View>
          <View style={styles.headerContainer}>
            <View>
              <Text size="large" fontWeight="700">
                John Doe
              </Text>
              <Text color={colors.gray[400]}>@johndoe</Text>
            </View>
            <Text style={styles.description}>
              Full-stack developer passionate about building scalable web applications and intuitive
              UIs.
            </Text>
          </View>
          <View styles={styles.editProfileContainer}>
            <Button theme="primary-outline" title="Edit Profile" style={styles.editProfileButton} />
          </View>
        </View>

        <View style={styles.additionalInformationContainer}>
          <View style={styles.additionalInformationCard}>
            <Text color={colors.orange[500]} fontWeight="700" size="large">
              14
            </Text>
            <Text
              style={styles.additionalInformationCardDescription}
              color={colors.gray[500]}
              fontWeight="400"
            >
              Channels
            </Text>
          </View>
          <View style={styles.additionalInformationCard}>
            <Text
              style={styles.additionalInformationCardHeader}
              color={colors.orange[500]}
              size="large"
              fontWeight="700"
            >
              Jan 2024
            </Text>
            <Text
              style={styles.additionalInformationCardDescription}
              color={colors.gray[500]}
              fontWeight="400"
            >
              Joined
            </Text>
          </View>
        </View>

        <View style={styles.userPresenceStatusContainer}>
          <View style={styles.userPresenceStatusBadgeContainer}>
            <View
              style={[styles.userPresenceStatusBadge, { backgroundColor: currentStatus.color }]}
            ></View>
            <Text fontWeight="500">{currentStatus.label}</Text>
          </View>
          <Icon
            name="arrow-right-s-line"
            size={20}
            color={colors.gray[400]}
            style={{ marginLeft: 10 }}
          />
        </View>
      </View>
    </View>
  );
}

export default MyProfile;
