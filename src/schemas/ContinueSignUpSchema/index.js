import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Kullanıcı adı giriniz')
    .min(1, 'Kullanıcı adı minimum 1 karakter olmalıdır'),
  lastName: Yup.string()
  .required('Adınızı giriniz')
  .min(1, 'Adınız minimum 1 karakter olmalıdır'),
  phoneNumber: Yup.string()
  .matches(/^(?:\+?90|0)?\s*(?:\(?\d{3}\)?\s*[\-]?\s*\d{3}\s*[\-]?\s*\d{4})$/, 'Geçersiz telefon numarası')
  .required('Telefon numarası giriniz'),
  middleName: Yup.string()
  .nullable()
});

export default validationSchema;
