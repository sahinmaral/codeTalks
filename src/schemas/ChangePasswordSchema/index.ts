import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('validation.currentPasswordRequired'),
  newPassword: Yup.string()
    .required('validation.newPasswordRequired')
    .min(6, 'validation.passwordMin6')
    .matches(/[a-z]/, 'validation.passwordLowercase')
    .matches(/[A-Z]/, 'validation.passwordUppercase')
    .matches(/[^A-Za-z0-9]/, 'validation.passwordSpecialChar')
    .notOneOf([Yup.ref('currentPassword')], 'validation.newPasswordNotSameAsCurrent'),
  newPasswordRepeat: Yup.string()
    .required('validation.newPasswordRepeatRequired')
    .oneOf([Yup.ref('newPassword')], 'validation.passwordsDoNotMatch'),
});

export default validationSchema;
