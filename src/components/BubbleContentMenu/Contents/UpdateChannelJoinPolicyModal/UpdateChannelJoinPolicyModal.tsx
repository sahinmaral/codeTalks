import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Button from '@/components/Button';
import Text from '@/components/Text';
import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveChannelJoinPolicy } from '@/redux/reducers/activeChannelReducer';
import { fetchPatchChannel } from '@/services/channels';
import colors from '@/styles/colors';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import * as Yup from 'yup';
import styles from './UpdateChannelJoinPolicyModal.styles';

const JOIN_POLICIES = [
  { label: 'Request', value: ChannelJoinPolicy.Request, icon: 'mail-send-line' },
  { label: 'Open', value: ChannelJoinPolicy.Open, icon: 'global-line' },
];

function UpdateChannelJoinPolicyModal() {
  const currentChannel = useAppSelector(state => state.activeChannel.channel);
  const selectedChannelId = currentChannel?.id ?? '';
  const currentChannelJoinPolicy = currentChannel?.joinPolicy ?? ChannelJoinPolicy.Request;

  const initialValues = { channelJoinPolicy: currentChannelJoinPolicy };
  const [loading, setLoading] = useState(false);

  const { hide } = useBubbleContentMenu();
  const dispatch = useAppDispatch();

  const handleUpdateChannelJoinPolicy = async ({ channelJoinPolicy }: typeof initialValues) => {
    try {
      setLoading(true);
      await fetchPatchChannel(selectedChannelId, { joinPolicy: channelJoinPolicy });
      dispatch(setActiveChannelJoinPolicy(channelJoinPolicy));
      hide();
      showMessage({ message: 'Kanala giriş politikası başarıyla güncellendi', type: 'success' });
    } catch (exception) {
      if (exception instanceof Yup.ValidationError) {
        showMessage({ message: exception.errors[0], type: 'warning' });
      } else if (exception instanceof AxiosError) {
        showMessage({ message: getApiErrorMessage(exception), type: 'danger' });
      } else {
        showMessage({ message: 'An error occurred', type: 'danger' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text fontWeight="800" size="xlarge">
          Edit Channel Join Policy
        </Text>
      </View>

      <Formik initialValues={initialValues} onSubmit={handleUpdateChannelJoinPolicy}>
        {({ handleSubmit: formikSubmit, values, setFieldValue }) => (
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text fontWeight="600">Channel Join Policy</Text>
              <View style={styles.segmentContainer}>
                {JOIN_POLICIES.map(policy => {
                  const isActive = values.channelJoinPolicy === policy.value;
                  const activeColor = isActive ? colors.orange[500] : colors.gray[500];
                  return (
                    <TouchableOpacity
                      key={policy.value}
                      activeOpacity={0.8}
                      style={[styles.segment, isActive && styles.segmentActive]}
                      onPress={() => setFieldValue('channelJoinPolicy', policy.value)}
                    >
                      <Icon name={policy.icon} size={16} color={activeColor} />
                      <Text fontWeight={isActive ? '600' : '400'} color={activeColor}>
                        {policy.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Button
              title={loading ? 'Saving changes...' : 'Save Changes'}
              loading={loading}
              disabled={loading}
              style={styles.button}
              onPress={formikSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

export default UpdateChannelJoinPolicyModal;
