import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('validation.channelNameRequired')
    .min(1, 'validation.channelNameMin1'),
  description: Yup.string()
    .required('validation.channelDescriptionRequired')
    .min(1, 'validation.channelDescriptionMin1'),
});

export default validationSchema;
