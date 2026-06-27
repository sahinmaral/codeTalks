import { useBubbleContentMenu } from '@/components/BubbleContentMenu/BubbleContentMenu.provider';
import Button from '@/components/Button';
import Text from '@/components/Text';
import UserAvatar from '@/components/UserAvatar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/reducers/appReducer';
import { fetchDeleteUserProfilePhoto, fetchUpdateUserProfilePhoto } from '@/services/apiServices/users';
import { buildImageFormData, pickImageFromLibrary } from '@/utils/imagePicker';
import { notifyApiError } from '@/utils/notifyApiError';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import styles from './UpdateProfilePhotoModal.styles';

type UpdateProfilePhotoModalProps = {
  onSuccess?: (newPhotoURL: string | null) => void;
};

function UpdateProfilePhotoModal({ onSuccess }: UpdateProfilePhotoModalProps) {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState({ submit: false, delete: false });

  const isBusy = loading.submit || loading.delete;

  const { hide } = useBubbleContentMenu();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.app.user);

  const openImageLibrary = async () => {
    const asset = await pickImageFromLibrary();
    if (asset) {
      setSelectedImage(asset);
    }
  };

  const handleSubmitImage = async () => {
    if (!selectedImage) return;

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const response = await fetchUpdateUserProfilePhoto(buildImageFormData(selectedImage));
      const newPhotoURL = response.data.newProfilePhotoPath;

      if (user) {
        dispatch(setUser({ ...user, profilePhotoURL: newPhotoURL }));
      }
      onSuccess?.(newPhotoURL);
      hide();
      showMessage({ message: 'You successfully updated your profile photo', type: 'success' });
    } catch (exception) {
      notifyApiError(exception);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDeleteProfilePhoto = async () => {
    try {
      setLoading(prev => ({ ...prev, delete: true }));
      await fetchDeleteUserProfilePhoto();

      if (user) {
        dispatch(setUser({ ...user, profilePhotoURL: null }));
      }
      onSuccess?.(null);
      hide();
      showMessage({ message: 'You successfully removed your profile photo', type: 'success' });
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

    if (!user?.profilePhotoURL) {
      showMessage({ message: `You haven't selected any photo yet.`, type: 'danger' });
      return;
    }

    handleDeleteProfilePhoto();
  };

  return (
    <View>
      <View style={styles.header}>
        <Text fontWeight="800" size="xlarge">
          Update Profile Photo
        </Text>
      </View>

      <View style={styles.previewContainer}>
        <UserAvatar
          uri={selectedImage?.uri ?? user?.profilePhotoURL}
          size={100}
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
        {user?.profilePhotoURL ? (
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

export default UpdateProfilePhotoModal;
