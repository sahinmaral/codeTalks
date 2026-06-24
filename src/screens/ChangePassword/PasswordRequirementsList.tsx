import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import colors from '@/styles/colors';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { PasswordRequirementsType } from './ChangePassword';
import makeStyles from './ChangePassword.styles';

type PasswordRequirementsListProps = {
  passwordRequirements: PasswordRequirementsType;
};

const REQUIREMENTS: { key: keyof PasswordRequirementsType; label: string }[] = [
  { key: 'minLength', label: 'Min 6 characters' },
  { key: 'includeLowercase', label: 'Include a lowercase letter' },
  { key: 'includeUppercase', label: 'Include an uppercase letter' },
  { key: 'includeSpecialCharacter', label: 'Include a special character' },
];

const PasswordRequirementsList = ({ passwordRequirements }: PasswordRequirementsListProps) => {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  return (
    <View style={styles.passwordRequirementsContainer}>
      <Text fontWeight="600">Password Requirements</Text>

      {REQUIREMENTS.map(({ key, label }) => {
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
            <Text color={isMet ? theme.text.primary : theme.text.tertiary}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default PasswordRequirementsList;
