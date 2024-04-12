import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Kullanıcı adı giriniz')
    .min(1, 'Kullanıcı adı minimum 1 karakter olmalıdır'),
  email: Yup.string()
    .email('Geçerli bir email giriniz')
    .required('Email giriniz'),
  password: Yup.string()
    .required('Şifrenizi giriniz')
    .min(6, 'Şifre minimum 6 karakter olmalıdır')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^*-]).{6,}$/,
      'Şifreniz en az bir büyük harf, küçük harf, rakam ve özel karakter içermelidir',
    ),
  passwordConfirm: Yup.string()
    .required('Şifrenizi tekrar giriniz')
    .oneOf([Yup.ref('password')], 'Şifreniz ile aynı olmalıdır'),
});

export default validationSchema;
