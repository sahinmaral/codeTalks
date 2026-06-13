import Text from '@/components/Text';
import colors from '@/styles/colors';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { PasswordRequirementsType } from './ChangePassword';
import styles from './ChangePassword.styles';

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
                { borderColor: isMet ? colors.green[400] : colors.gray[400] },
              ]}
            >
              <Icon
                size={14}
                name={isMet ? 'ri-check-line' : 'ri-close-line'}
                color={isMet ? colors.green[400] : colors.gray[400]}
              />
            </View>
            <Text color={isMet ? colors.black : colors.gray[400]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default PasswordRequirementsList;
