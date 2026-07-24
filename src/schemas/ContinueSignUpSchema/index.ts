import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('validation.continueFirstNameRequired')
    .min(1, 'validation.continueFirstNameMin'),
  lastName: Yup.string()
    .required('validation.continueLastNameRequired')
    .min(1, 'validation.continueLastNameMin'),
  phoneNumber: Yup.string()
    .matches(
      /^(?:\+?90|0)?\s*(?:\(?\d{3}\)?\s*[\-]?\s*\d{3}\s*[\-]?\s*\d{4})$/,
      'validation.phoneInvalid',
    )
    .required('validation.phoneRequired'),
  middleName: Yup.string().nullable(),
});

export default validationSchema;
