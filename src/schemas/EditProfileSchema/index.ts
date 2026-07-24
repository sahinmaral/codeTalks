import * as Yup from 'yup';

const emptyToUndefined = (value: string) => (value === '' ? undefined : value);

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('validation.firstNameRequired')
    .min(2, 'validation.firstNameMin')
    .max(50, 'validation.firstNameMax'),
  middleName: Yup.string()
    .trim()
    .transform(emptyToUndefined)
    .notRequired()
    .min(2, 'validation.middleNameMin')
    .max(50, 'validation.middleNameMax'),
  lastName: Yup.string()
    .trim()
    .required('validation.lastNameRequired')
    .min(2, 'validation.lastNameMin')
    .max(50, 'validation.lastNameMax'),
  bio: Yup.string()
    .trim()
    .transform(emptyToUndefined)
    .notRequired()
    .min(2, 'validation.bioMin')
    .max(300, 'validation.bioMax'),
});

export default validationSchema;
