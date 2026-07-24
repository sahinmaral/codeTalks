import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { PasswordRequirementsType } from './ChangePassword';
import makeStyles from './ChangePassword.styles';

type PasswordRequirementsListProps = {
  passwordRequirements: PasswordRequirementsType;
};

const REQUIREMENTS: { key: keyof PasswordRequirementsType; labelKey: string }[] = [
  { key: 'minLength', labelKey: 'profile.reqMinLength' },
  { key: 'includeLowercase', labelKey: 'profile.reqLowercase' },
  { key: 'includeUppercase', labelKey: 'profile.reqUppercase' },
  { key: 'includeSpecialCharacter', labelKey: 'profile.reqSpecialChar' },
];

const PasswordRequirementsList = ({ passwordRequirements }: PasswordRequirementsListProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  return (
    <View style={styles.passwordRequirementsContainer}>
      <Text fontWeight="600">{t('profile.passwordRequirements')}</Text>

      {REQUIREMENTS.map(({ key, labelKey }) => {
        const isMet = passwordRequirements[key];

        return (
          <View key={key} style={styles.requirementItemContainer}>
            <View
              style={[
                styles.requirementCompletionIconContainer,
                { borderColor: isMet ? colors.green[400] : theme.text.tertiary },
              ]}
            >
              <Icon
                size={14}
                name={isMet ? 'ri-check-line' : 'ri-close-line'}
                color={isMet ? colors.green[400] : theme.text.tertiary}
              />
            </View>
            <Text color={isMet ? theme.text.primary : theme.text.tertiary}>{t(labelKey)}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default PasswordRequirementsList;
