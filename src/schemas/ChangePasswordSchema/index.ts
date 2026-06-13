import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Mevcut şifrenizi giriniz'),
  newPassword: Yup.string()
    .required('Yeni şifrenizi giriniz')
    .min(6, 'Şifre minimum 6 karakter olmalıdır')
    .matches(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .matches(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .matches(/[^A-Za-z0-9]/, 'Şifre en az bir özel karakter içermelidir')
    .notOneOf([Yup.ref('currentPassword')], 'Yeni şifre mevcut şifre ile aynı olamaz'),
  newPasswordRepeat: Yup.string()
    .required('Yeni şifrenizi tekrar giriniz')
    .oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor'),
});

export default validationSchema;
