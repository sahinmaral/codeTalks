import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email giriniz'),
  password: Yup.string().required('Şifrenizi giriniz'),
});

export default validationSchema;
