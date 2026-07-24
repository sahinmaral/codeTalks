import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('validation.usernameRequired').min(3, 'validation.usernameMin3'),
  email: Yup.string().email('validation.emailInvalid').required('validation.emailRequired'),
  password: Yup.string()
    .required('validation.passwordRequired')
    .min(6, 'validation.passwordMin6')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^*-]).{6,}$/,
      'validation.passwordComplexity',
    ),
  passwordConfirm: Yup.string()
    .required('validation.passwordConfirmRequired')
    .oneOf([Yup.ref('password')], 'validation.passwordMustMatch'),
});

export default validationSchema;
