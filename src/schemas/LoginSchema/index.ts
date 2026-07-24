import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('validation.emailRequired'),
  password: Yup.string().required('validation.passwordRequired'),
});

export default validationSchema;
