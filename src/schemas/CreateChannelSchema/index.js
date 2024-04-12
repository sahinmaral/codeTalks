import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Kanal adı giriniz')
    .min(1, 'Kanal adı minimum 1 karakter olmalıdır'),
  description: Yup.string()
  .required('Açıklama giriniz')
  .min(1, 'Açıklaam minimum 1 karakter olmalıdır'),
});

export default validationSchema;
