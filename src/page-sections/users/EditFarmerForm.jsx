"use client";



import { Box, Grid, Stack, Button, Avatar, TextField, IconButton, useMediaQuery, Select, InputLabel, OutlinedInput, Chip, MenuItem, CircularProgress } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik, useFormik } from "formik";
import * as Yup from "yup"; // CUSTOM COMPONENTS
import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
// import { useRouter } from 'next/router'
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

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "contexts/firebaseContext";
import { conflictOptions, cropOptions, genderOptions, getLGAOptions, stateOptions } from "utils/optionsData";
import { useDropzone } from "react-dropzone";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useParams } from "next/navigation";
import { auth } from "config/firebase";
import useNavigate from "hooks/useNavigate";
import { getAllFarmerIds } from "hooks/getAllIds";
// ==========================================================================

const EditFarmerForm = ({farmer}) => {
  const downSm = useMediaQuery(theme => theme.breakpoints.down("sm"));
  console.log("Farmer: ", farmer)

  const params = useParams()
  const { id } = params;
  const {findFarmerById, loading} = useFetchFarmers();
  const navigate = useNavigate()

  const { user, db, storage } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [lga, setLga] = useState(null);
  const [lgaList, setLgaList] = useState([]);
  const [cityState, setCityState] = useState(null);
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerPhoneNumber: '',
    age: '',
    gender: '',
    numberOfEmployees: '',
    numberOfDependents: '',
    averageIncome: '',
    conflictImpact: '',
    farmLocation: '',
    farmerLGA: '',
    farmerState: '',
    farmerAddress: '',
    cropsProduced: [],
    farmSize: '',
    photoUrl: null,
    farmLandPhotoUrl: null
  });

  
  useEffect(() => {
   
      const fetchFarmerData = async () => {
       const farmerData = findFarmerById(id)
        if(farmer !== undefined) {
          
          setFormData(farmer);
          setValues(farmer); // Initialize form values
          setDownloadURL(farmer?.photoUrl);
        } else {
          setFormData(farmerData);  // Farmer data is now correctly set
          setValues(farmerData); // Initialize form values
          setDownloadURL(farmer?.photoUrl);
        } 
     }
    
      fetchFarmerData();
  }, [id,findFarmerById, farmer]);

  const {
    values,
    errors,
    setValues,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    setFieldValue
  } = useFormik({
    initialValues:{
      farmerName: '',
    farmerPhoneNumber: '',
    age: '',
    gender: '',
    numberOfEmployees: '',
    numberOfDependents: '',
    averageIncome: '',
    conflictImpact: '',
    farmLocation: '',
    farmerLGA: '',
    farmerState: '',
    farmerAddress: '',
    cropsProduced: [],
    farmSize: '',
    photoUrl: null,
    farmLandPhotoUrl: null,
     ...formData,
    },
    // validationSchema,
    enableReinitialize: true,
    onSubmit: values => handleSubmitForm(values)
  });

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
    console.log("PHOTO:", acceptedFiles)
    setFieldValue("photoUrl",acceptedFiles[0]);
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: 'image/jpeg, image/png, image/jpg, image/webp', 
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
          setSelectedFile(url);
          setFieldValue('photoUrl', url);
          
        }
      );
    } catch (error) {
      setUploadError(`Unexpected error: ${error.message}`);
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      await handleUpload();
      const farmerDetails = await findFarmerById(id);
      if (!farmerDetails) {
        console.log('Farmer not found');
      }
  
      // Create a document reference using the userId and farmerId
      const farmerDocRef = doc(db, `users/${farmerDetails.userId}/farmers`, farmerDetails.id);

      console.log("FarmerDoc:", farmerDetails.userId);
      console.log("FarmerRef:", farmerDetails);
      await setDoc(
        farmerDocRef,
        {
          ...values,
          lastUpdated: format(new Date(), 'dd/MM/yyyy'),
          photoUrl: values.photoUrl || downloadURL
        },
        {merge: true},
      );

      toast('Farmer Profile Updated Successfully!');
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating document: ', error);
      toast('Failed to Update Farmer Profile');
    }
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <Box sx={{padding:10}}>
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
            <AvatarBadge badgeContent={<label htmlFor="icon-button-file" {...getRootProps()} >
              <input {...getInputProps()} />

                  <IconButton aria-label="upload picture" component="span" onClick={onDrop}>
                    <CameraAlt sx={{
                fontSize: 16,
                color: "background.paper"
              }} />
                  </IconButton>
                </label>}>
              <Avatar src={values?.photoUrl ? values?.photoUrl : selectedFile? selectedFile : "/static/avatar/001-man.svg"} sx={{
              width: 80,
              height: 80,
              backgroundColor: "grey.100"
            }} />
            </AvatarBadge>
          </Stack>

          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
              <TextField fullWidth name="farmerName" label="Full Name" variant="outlined" onBlur={handleBlur} value={values?.farmerName} onChange={handleChange} error={Boolean(errors.farmerName && touched.farmerName)} helperText={touched.farmerName && errors.farmerName} />
            </Grid>

            

            <Grid item sm={6} xs={12}>
              <TextField fullWidth name="farmerEmail" type="email" label="Email" variant="outlined" onBlur={handleBlur} value={values?.farmerEmail} onChange={handleChange} error={Boolean(errors.farmerEmail && touched.farmerEmail)} helperText={touched.farmerEmail && errors.farmerEmail} />
            </Grid>

            <Grid item sm={6} xs={12}>
              <TextField fullWidth name="farmerPhoneNumber" label="Phone Number" variant="outlined" onBlur={handleBlur} value={values?.farmerPhoneNumber} onChange={handleChange} error={Boolean(errors.farmerPhoneNumber && touched.farmerPhoneNumber)} helperText={touched.farmerPhoneNumber && errors.farmerPhoneNumber} />
            </Grid>
            <Grid item sm={6} xs={12}>
                <InputLabel id="gender">Gender</InputLabel>
                  <TextField
                    fullWidth
                    select
                    id="gender"
                    value={values?.gender}
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
              <TextField fullWidth name="farmLocation" label="GPS Location" variant="outlined" onBlur={handleBlur} value={values?.farmLocation} onChange={handleChange} error={Boolean(errors.farmLocation && touched.farmLocation)} helperText={touched.farmLocation && errors.farmLocation} />
            </Grid>
                <Grid item sm={6} xs={12}>
                  
                  <InputLabel id="state">State</InputLabel>
                  <TextField
                    select
                    fullWidth
                    id="farmerState"
                    value={values?.farmerState}
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
                  </TextField>
                  <InputLabel id="gender">LGA</InputLabel>
                {lgaList.length > 0 &&
                
                  <TextField
                    select
                    fullWidth
                    id="farmerLGA"
                    value={values?.farmerLGA || ""}
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
                  </TextField>}
                </Grid>
                <Grid item sm={6} xs={12}>
              <TextField multiline
                    fullWidth
                    rows={6} name="farmerAddress" label="Farmer's Address" variant="outlined" onBlur={handleBlur} value={values?.farmerAddress} onChange={handleChange} error={Boolean(errors.company && touched.company)} helperText={touched.farmerAddress && errors.farmerAddress} />
            </Grid>
            <Grid item sm={6} xs={12}>
            <InputLabel id="conflictImpact">Conflict Impact</InputLabel>
                  <TextField
                    select
                    fullWidth
                    id="conflictImpact"
                    value={values?.conflictImpact}
                    name="conflictImpact"
                    onChange={handleChange}
                    
                  >
                    {conflictOptions.map((option) => (
                      <MenuItem key={option} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                  <InputLabel id="cropsProduced">Crops Produced</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    id="cropsProduced"
                    value={values?.cropsProduced || []}
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
          </Grid>
                
            
        </Scrollbar>

        <Stack direction="row" alignItems="center" spacing={1} mt={4}>
          <Button type="submit" size="large" onClick={handleSubmitForm}>
            Submit
          </Button>

          <Button variant="outlined" size="large" color="secondary" onClick={()=>navigate(`/dashboard/users/all-farmers`)}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Box>;
};


export async function getStaticPaths() {

  const paths = getAllFarmerIds();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const {findFarmerById} = useFetchFarmers();
  const farmer = findFarmerById(params.id);
  console.log(farmer)
  return {
    props: {
      farmer,
    },
  };
}


export default EditFarmerForm;