"use client";

import {
  Box, Button, Card, Grid, IconButton, styled, Switch, TextField, MenuItem,
  Select, Stack, Chip, OutlinedInput, InputLabel,
  Avatar
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useFormik } from "formik";
import { Paragraph } from "components/typography";
import { FlexBetween, FlexRowAlign } from "components/flexbox";
import { format } from "date-fns";
import { isDark } from "utils/constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { AuthContext } from "contexts/firebaseContext";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { validationSchema } from "utils/validationSchema";
import { conflictOptions, cropOptions, genderOptions, getLGAOptions, stateOptions } from "utils/optionsData";
import { useDropzone } from "react-dropzone";

const SwitchWrapper = styled(FlexBetween)({
  width: "100%",
  marginTop: 10,
});

const StyledCard = styled(Card)({
  padding: 24,
  minHeight: 400,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

const ButtonWrapper = styled(FlexRowAlign)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: "50%",
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
}));

const UploadButton = styled(FlexRowAlign)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: "50%",
  backgroundColor: theme.palette.grey[isDark(theme) ? 600 : 200],
  border: `1px solid ${theme.palette.background.paper}`,
}));

const AddNewUserPageView = () => {
  const { user, db, storage } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [lga, setLga] = useState(null);
  const [lgaList, setLgaList] = useState([]);
  const [cityState, setCityState] = useState(null);


  const handleStateChange = useCallback((selectedState) => {
    setCityState(selectedState);
  }, [setCityState]);
  
  const lgaOptionsData = useMemo(() => {
    return getLGAOptions(cityState);
  }, [cityState]);
  
  useEffect(() => {
    setLgaList(lgaOptionsData);
  }, [lgaOptionsData]);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: 'image/jpeg, image/png', 
    maxSize: 3.1 * 1024 * 1024 
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("No file selected");
      return;
    }

    const fileName = `farmerPhotos/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    try {
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          setUploadError(`Upload failed: ${error.message}`);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("URL", url);
          setDownloadURL(url);
          formik.setFieldValue('photoUrl', url);
          setSelectedFile(null);
        }
      );
    } catch (error) {
      setUploadError(`Unexpected error: ${error.message}`);
    }
  };

  const handleSubmitForm = async (values) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    const userId = user.uid;
    const farmersRef = collection(db, 'users', userId, 'farmers');

    try {
      const existingFarmers = await getDocs(query(farmersRef, where('farmerPhoneNumber', '==', values.farmerPhoneNumber)));

      if (!existingFarmers.empty) {
        toast.error('Farmer with this phone number already exists');
        return;
      }

      await addDoc(farmersRef, {
        ...values,
        registeredBy: userId,
        dateRegistered: format(new Date(), 'dd/MM/yyyy'),
      });

      toast.success('Farmer registered successfully!');
    } catch (error) {
      toast.error('Failed to Submit Form');
    }
  };

  const formik = useFormik({
    initialValues: {
      farmerName: '', email: '', farmerPhoneNumber: '', age: '', gender: '',
      numberOfEmployees: '', numberOfDependents: '', averageIncome: '',
      conflictImpact: [], farmLocation: '', farmerLGA: '', farmerState: '',
      farmerAddress: '', cropsProduced: [], photoUrl: null
    },
    validationSchema,
    onSubmit: handleSubmitForm,
  });

  const { values, touched, errors, handleChange, setFieldValue } = formik;

  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        <ToastContainer position="top-right" autoClose={5000} theme="colored" />
        
        <Grid item md={4} xs={12}>
          <StyledCard>
                  <div {...getRootProps()}>
            <ButtonWrapper>
              <UploadButton>
                <label htmlFor="upload-btn">
                    <input {...getInputProps()} />
                  <IconButton component="span" onClick={handleUpload}>
                    {downloadURL ? <Avatar src={values.photoUrl}/> : <PhotoCamera sx={{ fontSize: 100, color: "grey.400" }} />}
                    
                  </IconButton>
                </label>
              </UploadButton>
            </ButtonWrapper>
                  </div>

            <Paragraph marginTop={2} maxWidth={200} textAlign="center" color="text.secondary">
              Allowed *.jpeg, *.jpg, *.png max size of 3.1 MB
            </Paragraph>
            {uploadProgress > 0 && <Paragraph>Upload Progress: {uploadProgress}%</Paragraph>}
            <Box maxWidth={250} marginTop={5} marginBottom={1}>
              <SwitchWrapper>
                <Paragraph fontWeight={600}>Public Profile</Paragraph>
                <Switch defaultChecked />
              </SwitchWrapper>
            </Box>
          </StyledCard>
        </Grid>
        
        <Grid item md={8} xs={12}>
          <Card sx={{ padding: 3 }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                {[
                  { name: 'farmerName', label: 'Full Name' },
                  { name: 'email', label: 'Email Address' },
                  { name: 'farmerPhoneNumber', label: 'Phone Number' },
                  { name: 'age', label: 'Farmers Age' },
                  { name: 'numberOfEmployees', label: 'Number of Employees' },
                  { name: 'numberOfDependents', label: 'Number of Dependants' },
                  { name: 'averageIncome', label: 'Average Income' },
                  { name: 'farmLocation', label: 'Farm Location' },
                  { name: 'farmerAddress', label: 'Address' },
                  
                ].map((field, index) => (
                  <Grid item sm={6} xs={12} key={index}>
                    <TextField
                      fullWidth
                      name={field.name}
                      label={field.label}
                      value={values[field.name]}
                      onChange={handleChange}
                      helperText={touched[field.name] && errors[field.name]}
                      error={Boolean(touched[field.name] && errors[field.name])}
                    />
                  </Grid>
                ))}
                <Grid item sm={6} xs={12}>
                <InputLabel id="gender">Gender</InputLabel>
                  <TextField
                    fullWidth
                    select
                    id="gender"
                    value={values.gender}
                    name="gender"
                    onChange={handleChange}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item sm={6} xs={12}>
                  
                  <InputLabel id="state">State</InputLabel>
                  <Select
                    fullWidth
                    id="farmerState"
                    value={values.farmerState}
                    name="farmerState"
                    onChange={(e)=>{
                      handleStateChange(e.target.value)
                      setFieldValue('farmerState', e.target.value);  
                    }}
                    
                  >
                    {stateOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <InputLabel id="gender">LGA</InputLabel>
                {lgaList.length > 0 &&
                
                  <Select
                    fullWidth
                    id="farmerLGA"
                    value={values.farmerLGA}
                    name="farmerLGA"
                    onChange={(e)=> {
                      setLga(e.target.value);  // Set selected LGA
                  setFieldValue('farmerLGA', e.target.value);  // Update Formik state
                    }}
                  >
                    {lgaList.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>}
                </Grid>
                <Grid item sm={6} xs={12}>
               
               
                  <InputLabel id="conflictImpact">Conflict Impact</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    id="conflictImpact"
                    value={values.conflictImpact}
                    name="conflictImpact"
                    onChange={handleChange}
                    input={<OutlinedInput id="conflictImpact" label="ConflictImpact" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Stack>
                    )}
                  >
                    {conflictOptions.map((option) => (
                      <MenuItem key={option} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <InputLabel id="cropsProduced">Crops Produced</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    id="cropsProduced"
                    value={values.cropsProduced}
                    name="cropsProduced"
                    onChange={handleChange}
                    input={<OutlinedInput id="cropsProduced" label="Crops Produced" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Stack>
                    )}
                  >
                    {cropOptions.map((option) => (
                      <MenuItem key={option} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                fullWidth
              >
                Submit Form
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddNewUserPageView;
