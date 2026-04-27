import React, { useState } from 'react';
import Button from '../../Button';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './ChannelCreateModalContent.styles';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';
import validationSchema from '../../../schemas/CreateChannelSchema';
import { useAppSelector } from '../../../redux/hooks';
import { fetchCreateChannel } from '../../../services/channels';
import colors from '../../../styles/colors';

interface ChannelCreateModalContentProps {
  closeAllModals: () => void;
}

function ChannelCreateModalContent({ closeAllModals }: ChannelCreateModalContentProps) {
  const initialValues = { name: '', description: '' };
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.app.user);

  const handleCreateChannel = async (values: typeof initialValues) => {
    try {
      await fetchCreateChannel({ ...values, userId: user!.id });
      closeAllModals();
      showMessage({ message: 'Oda başarıyla oluşturuldu', type: 'info' });
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      await validationSchema.validate(values, { abortEarly: false });
      await handleCreateChannel(values);
    } catch {
      showMessage({ message: 'Bir hata oluştu', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.modalContainer}
      activeOpacity={1}
      onPress={(event) => event.stopPropagation()}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors }) => (
          <View>
            <View>
              <TextInput
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Oda adı..."
                style={styles.input}
              />
              {errors.name && <Text style={styles.inputError}>* {errors.name}</Text>}
            </View>

            <View>
              <TextInput
                multiline={true}
                numberOfLines={4}
                placeholder="Açıklama..."
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                style={styles.input}
              />
              {errors.description && (
                <Text style={styles.inputError}>* {errors.description}</Text>
              )}
            </View>

            <Button
              title={loading ? 'Kanal oluşturuluyor ...' : 'Oluştur'}
              icon={loading && <ActivityIndicator size="small" color={colors.white} />}
              disabled={loading}
              style={styles.button}
              onPress={formikSubmit}
            />
          </View>
        )}
      </Formik>
    </TouchableOpacity>
  );
}

export default ChannelCreateModalContent;
