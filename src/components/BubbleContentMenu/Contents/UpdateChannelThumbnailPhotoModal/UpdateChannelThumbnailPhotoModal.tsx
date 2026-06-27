import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Button from '@/components/Button';
import ChannelThumbnail from '@/components/ChannelThumbnail';
import Text from '@/components/Text';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveChannel } from '@/redux/reducers/activeChannelReducer';
import {
  fetchDeleteChannelThumbnailPhoto,
  fetchUpdateChannelThumbnailPhoto,
} from '@/services/apiServices/channels';
import { buildImageFormData, pickImageFromLibrary } from '@/utils/imagePicker';
import { notifyApiError } from '@/utils/notifyApiError';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import styles from './UpdateChannelThumbnailPhotoModal.styles';

type UpdateChannelThumbnailPhotoModalProps = {
  onSuccess?: (newPhotoURL: string | null) => void;
};

function UpdateChannelThumbnailPhotoModal({ onSuccess }: UpdateChannelThumbnailPhotoModalProps) {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState({ submit: false, delete: false });

  const isBusy = loading.submit || loading.delete;

  const { hide } = useBubbleContentMenu();
  const dispatch = useAppDispatch();
  const currentChannel = useAppSelector(state => state.activeChannel.channel);

  const openImageLibrary = async () => {
    const asset = await pickImageFromLibrary();
    if (asset) {
      setSelectedImage(asset);
    }
  };

  const handleSubmitImage = async () => {
    if (!selectedImage) return;
    if (!currentChannel?.id) return;

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const response = await fetchUpdateChannelThumbnailPhoto(
        currentChannel?.id,
        buildImageFormData(selectedImage),
      );
      const newPhotoURL = response.data.newThumbnailPhotoPath;

      if (currentChannel) {
        dispatch(setActiveChannel({ ...currentChannel, thumbnailPhotoURL: newPhotoURL }));
      }
      onSuccess?.(newPhotoURL);
      hide();
      showMessage({
        message: `You successfully updated channel's thumbnail photo`,
        type: 'success',
      });
    } catch (exception) {
      notifyApiError(exception);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDeleteProfilePhoto = async () => {
    if (!currentChannel?.id) return;

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      await fetchDeleteChannelThumbnailPhoto(currentChannel.id);

      if (currentChannel) {
        dispatch(setActiveChannel({ ...currentChannel, thumbnailPhotoURL: null }));
      }
      onSuccess?.(null);
      hide();
      showMessage({
        message: `You successfully removed channel's thumbnail photo`,
        type: 'success',
      });
    } catch (exception) {
      notifyApiError(exception);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handlePrimaryPress = () => {
    if (selectedImage) {
      handleSubmitImage();
    } else {
      openImageLibrary();
    }
  };

  const handleSecondaryPress = () => {
    if (selectedImage) {
      setSelectedImage(null);
      return;
    }

    if (!currentChannel?.thumbnailPhotoURL) {
      showMessage({ message: `You haven't selected any photo yet.`, type: 'danger' });
      return;
    }

    handleDeleteProfilePhoto();
  };

  return (
    <View>
      <View style={styles.header}>
        <Text fontWeight="800" size="xlarge">
          Update Thumbnail Photo
        </Text>
      </View>

      <View style={styles.previewContainer}>
        <ChannelThumbnail
          uri={selectedImage?.uri ?? currentChannel?.thumbnailPhotoURL}
          size={120}
          style={styles.avatar}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title={selectedImage ? 'Save' : 'Select Photo'}
          theme="primary"
          loading={loading.submit}
          disabled={isBusy}
          style={styles.button}
          onPress={handlePrimaryPress}
        />
        {currentChannel?.thumbnailPhotoURL ? (
          <Button
            title={selectedImage ? 'Clear' : 'Delete Current'}
            theme="danger-outline"
            loading={loading.delete}
            disabled={isBusy}
            style={styles.button}
            onPress={handleSecondaryPress}
          />
        ) : null}
      </View>
    </View>
  );
}

export default UpdateChannelThumbnailPhotoModal;
