import { Box, Grid, Stack, Button, Avatar, TextField, IconButton, useMediaQuery, Select, InputLabel, OutlinedInput, Chip, MenuItem } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup"; // CUSTOM COMPONENTS
import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
  } from 'firebase/firestore';
import { H5, Paragraph } from "components/typography";
import { Scrollbar } from "components/scrollbar";
import { AvatarBadge } from "components/avatar-badge"; // ==========================================================================
import useFetchFarmers from "hooks/useFetchFarmers";
import { useContext } from "react";
import { AuthContext } from "contexts/firebaseContext";

// ==========================================================================
const cropOptions = [
    { label: 'Ginger', value: 'Ginger' },
    { label: 'Sesame', value: 'Sesame' },
    { label: 'Cashew Nuts', value: 'Cashew Nuts' },
    { label: 'Hibiscus', value: 'Hibiscus' },
    { label: 'Others', value: 'Others' },
  ];
const EditFarmerForm = ({
  handleCancel,
 farmer
}) => {
  const downSm = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const initialValues = {
    farmerName: farmer?.farmerName || "",
    farmerEmail: farmer?.farmerEmail || "",
    farmerPhoneNumber: farmer.farmerPhoneNumber||'',
    farmerAddress: farmer.farmerAddress|| '',
    farmerLocation: farmer.farmerLocation|| '',
    cropsProduced: farmer.cropsProduced || [],
  };
//   const validationSchema = Yup.object({
//     farmerName: Yup.string().min(3, "Must be greater then 3 characters").required(" Name is Required!"),
//     farmerAddress: Yup.string().required("Address is Required!"),
//     farmerEmail: Yup.string().email("Invalid email address").required("Email is Required!"),
//     farmerLocation: Yup.string().required("State/Location is Required!"),
//     farmerPhoneNumber: Yup.number().min(6).required("Phone Number is required!"),
//     cropsProduced: Yup.string().required("Crops Produced is Required!")
//   });
  const {findFarmerById} = useFetchFarmers();
  const {user, db} = useContext(AuthContext)
  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    setFieldValue
  } = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: values => handleSubmitForm(values)
  });

  const handleSubmitForm = async (values) => {
    try {
      const farmerDoc = findFarmerById(farmer.id);
      if (!farmerDoc) {
        console.log('Farmer not found');
      }
  
      // Create a document reference using the userId and farmerId
      const farmerDocRef = doc(db, `users/${farmerDoc.userId}/farmers`, farmerDoc.id);

      console.log("FarmerDoc:", farmerDoc.userId);
      console.log("FarmerRef:", farmerDocRef);
      await setDoc(
        farmerDocRef,
        {
          ...values,
          lastUpdated: format(new Date(), 'dd/MM/yyyy'),
        },
        {merge: true},
      );

      toast.success('Farmer Profile Updated Successfully!');
      handleCancel()
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Failed to Update Farmer Profile');
    }
  };


  return <Box>
      <H5 fontSize={16} mb={4}>
        Add Contact
      </H5>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      <form onSubmit={handleSubmit}>
        <Scrollbar autoHide={false} style={{
        maxHeight: downSm ? 300 : ""
      }}>
          <Stack direction="row" justifyContent="center" mb={6}>
            <AvatarBadge badgeContent={<label htmlFor="icon-button-file">
                  <input type="file" accept="image/*" id="icon-button-file" style={{
              display: "none"
            }} />

                  <IconButton aria-label="upload picture" component="span">
                    <CameraAlt sx={{
                fontSize: 16,
                color: "background.paper"
              }} />
                  </IconButton>
                </label>}>
              <Avatar src={farmer?.avatar || "/static/avatar/001-man.svg"} sx={{
              width: 80,
              height: 80,
              backgroundColor: "grey.100"
            }} />
            </AvatarBadge>
          </Stack>

          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
              <TextField fullWidth name="farmerName" label="Full Name" variant="outlined" onBlur={handleBlur} value={values.farmerName} onChange={handleChange} error={Boolean(errors.farmerName && touched.farmerName)} helperText={touched.farmerName && errors.farmerName} />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField fullWidth name="farmerLocation" label="State/ Location" variant="outlined" onBlur={handleBlur} value={values.farmerLocation} onChange={handleChange} error={Boolean(errors.farmerLocation && touched.farmerLocation)} helperText={touched.farmerLocation && errors.farmerLocation} />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField fullWidth name="farmerEmail" type="email" label="Email" variant="outlined" onBlur={handleBlur} value={values.farmerEmail} onChange={handleChange} error={Boolean(errors.farmerEmail && touched.farmerEmail)} helperText={touched.farmerEmail && errors.farmerEmail} />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField fullWidth name="farmerPhoneNumber" label="Phone Number" variant="outlined" onBlur={handleBlur} value={values.farmerPhoneNumber} onChange={handleChange} error={Boolean(errors.farmerPhoneNumber && touched.farmerPhoneNumber)} helperText={touched.farmerPhoneNumber && errors.farmerPhoneNumber} />
            </Grid>
            <Grid item sm={6} xs={12}>
                  <InputLabel id="cropsProduced">Crops Produced</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    id="cropsProduced"
                    value={values.cropsProduced}
                    name="cropsProduced"
                    onChange={event => setFieldValue('cropsProduced', event.target.value)}
                    input={<OutlinedInput label="Crops Produced" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Stack>
                    )}
                  >
                    {cropOptions.map((crop, index) => (
                      <MenuItem key={index} value={crop.value}>
                        {crop.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
            <Grid item sm={6} xs={12}>
              <TextField multiline
                    fullWidth
                    rows={6} name="farmerAddress" label="Company" variant="outlined" onBlur={handleBlur} value={values.farmerAddress} onChange={handleChange} error={Boolean(errors.company && touched.company)} helperText={touched.farmerAddress && errors.farmerAddress} />
            </Grid>
          </Grid>
        </Scrollbar>

        <Stack direction="row" alignItems="center" spacing={1} mt={4}>
          <Button type="submit" size="small">
            Save
          </Button>

          <Button variant="outlined" size="small" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Box>;
};

export default EditFarmerForm;