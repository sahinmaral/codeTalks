import Button from '@/components/Button';
import Text from '@/components/Text';
import colors from '@/styles/colors';
import React from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import styles, { ConfirmationDialogTheme, dialogThemes } from './ConfirmationDialog.styles';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  description: string;
  icon: string;
  confirmTitle: string;
  cancelTitle?: string;
  theme?: ConfirmationDialogTheme;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationDialog({
  visible,
  title,
  description,
  icon,
  confirmTitle,
  cancelTitle = 'Cancel',
  theme = 'danger',
  loading,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!visible) return null;

  const themeStyle = dialogThemes[theme];

  return (
    <Pressable style={styles.overlay} onPress={onCancel}>
      <Pressable style={styles.card} onPress={() => {}}>
        <View style={[styles.iconCircle, { backgroundColor: themeStyle.iconBackground }]}>
          <Icon name={icon} color={themeStyle.accent} size={24} />
        </View>

        <Text size="large" fontWeight="800" style={styles.title}>
          {title}
        </Text>

        <Text size="small" color={colors.gray[400]} style={styles.description}>
          {description}
        </Text>

        <View style={styles.actions}>
          <Button
            title={confirmTitle}
            theme={themeStyle.confirmButtonTheme}
            loading={loading}
            disabled={loading}
            onPress={onConfirm}
            style={styles.confirmButton}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text size="medium" fontWeight="600" color={colors.gray[600]}>
              {cancelTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
}

export default ConfirmationDialog;
