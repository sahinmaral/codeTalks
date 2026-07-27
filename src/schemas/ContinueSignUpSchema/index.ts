import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('validation.continueFirstNameRequired')
    .min(1, 'validation.continueFirstNameMin'),
  lastName: Yup.string()
    .required('validation.continueLastNameRequired')
    .min(1, 'validation.continueLastNameMin'),
  middleName: Yup.string().nullable(),
});

export default validationSchema;
