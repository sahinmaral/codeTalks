import i18n from '@/localization/i18n';

const translateErrorMessage = (errorMessage: string): string => {
  switch (errorMessage) {
    case 'This user has already accepted to this channel':
      return i18n.t('serverErrors.alreadyInChannel');
    default:
      return errorMessage;
  }
};

export default translateErrorMessage;
