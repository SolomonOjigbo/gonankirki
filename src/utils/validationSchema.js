import * as Yup from 'yup';

// Validation Schema using Yup
export const validationSchema = Yup.object().shape({
    farmerName: Yup.string().required('Farmer name is required'),
    farmerPhoneNumber: Yup.string()
      .max(11, 'Phone number must be 11 digits')
      .min(11, 'Phone number must be 11 digits')
      .required('Phone number is required')
      .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits'),
    farmerAddress: Yup.string().required('Farmer address is required'),
    farmLocation: Yup.string().required('Farm location is required'),
    farmerState: Yup.string().required('State is required'),
    farmerLGA: Yup.string().required('LGA is required'),
    // farmSize: Yup.string().required('Farm size is required'),
    numberOfEmployees: Yup.number()
      .required('Number of employees is required')
      .min(0, 'Number of employees cannot be negative'),
    numberOfDependents: Yup.number()
      .required('Number of dependants is required')
      .min(0, 'Number of dependants cannot be negative'),
    averageIncome: Yup.number()
      .required('Average income is required')
      .min(0, 'Average income cannot be negative'),
  });
  

 export const validationSchemaStep1 = Yup.object({
    farmerName: Yup.string().required('Farmer name is required'),
    farmerPhoneNumber: Yup.string()
      .max(11, 'Phone number must be 11 digits')
      .min(11, 'Phone number must be 11 digits')
      .required('Phone number is required')
      .matches(/^[0-9]{11}$/, 'Phone number must be a number'),
    cropsProduced: Yup.array().min(1, 'Please select at least one crop')
  });

 export const validationSchemaStep2 = Yup.object({
    age: Yup.string().required('Age is required')
    .matches(/^[0-9]{2}$/, 'Age must be a number between 10 - 99'),
    gender: Yup.string().required('Gender is required'),
    numberOfEmployees: Yup.string().required('Number of employees is required')
    .matches(/^[0-9]/, 'must be a number'),
    numberOfDependents: Yup.string().required('Number of dependants is required')
    .matches(/^[0-9]/, 'Number of dependants must be between 1 - 9999'),
    averageIncome: Yup.string().required('Average income is required')
    .matches(/^[0-9]{4,8}$/, 'Average income must be between 1000 - 99999999'),
    conflictImpact: Yup.string().required('Conflict/disaster impact is required')
  });

  export const validationSchemaStep3 = Yup.object({
    farmerState: Yup.string().required('State is required'),
    farmerLGA: Yup.string().required('LGA is required'),
    farmerAddress: Yup.string().required('Address is required'),
    // farmSize: Yup.string().required('Farm size is required'),
  });
