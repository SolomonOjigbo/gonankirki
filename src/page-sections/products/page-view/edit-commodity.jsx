"use client";

import { useCallback, useState, useContext, useEffect, useMemo } from "react";
import { KeyboardArrowDown, PhotoCamera } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllCommodityIds } from "hooks/getAllIds";
import { H6, Paragraph } from "components/typography";
import { DropZone } from "components/dropzone";
import FlexBox from "components/flexbox/FlexBox";
import { QuillEditor } from "components/quill-editor";
import { IconWrapper } from "components/icon-wrapper";

import ShoppingBasket from "icons/ShoppingBasket";
import useFetchFarmers from "hooks/useFetchFarmers";
import { DatePicker } from "@mui/x-date-pickers";

import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { collection, addDoc,setDoc, doc } from "firebase/firestore";
import { AuthContext } from "contexts/firebaseContext";
import { useParams } from "next/navigation";
import { cropOptions, specifications } from "utils/optionsData";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "config/firebase";
import useNavigate from "hooks/useNavigate";

const EditProductPageView = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { loading, findCropAvailabilityById, registeredFarmers } = useFetchFarmers(); 
  const { user, db } = useContext(AuthContext);
 const initialValues ={
    cropProduced: "",
    dateOfAvailability: "",
    dateSubmitted: "",
    farmer: {
      farmerName: "",
      id: "",
    },
    quantityAvailable: "",
    remarks: "",
    price: "",
    specifications: [],
    imageUrl: null,
    farmerId: ""
  };
  const validationSchema = Yup.object({
    cropProduced: Yup.string().required("Crop Produced is Required!"),
    farmer: Yup.object().shape({
      farmerName: Yup.string().required("Name of Farmer is Required!"),
    }),
    price: Yup.string().required("Price is Required!"),
    specifications: Yup.array().of(Yup.string()).required("Crop Specifications is Required!"),
    dateOfAvailability: Yup.string().required("Date of Availability is Required!"),
    quantityAvailable: Yup.string().required("Quantity Available is Required!"),
    remarks: Yup.string().required("Remarks is Required!"),
  });
 

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true, 
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const getProduct = async () => {
    try {
      const item = await findCropAvailabilityById(id);
      if( item){
        setValues(item)
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  useEffect(() => {
    
    getProduct();
  }, [getProduct]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
 
  const handleUpload = async () => {
    if (!selectedFile) {
      toast("No file selected");
      return;
    }
    const fileName = `cropCommodity/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    try {
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          toast(`Upload failed: ${error.message}`);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("URL", url);
          setDownloadURL(url);
         
        }
      );
      return downloadURL;
    } catch (error) {
      toast(`Unexpected error: ${error.message}`);
    }
  };

  const onDrop = async(acceptedFiles) => {

       const file = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFieldValue("imageUrl",file[0]?.preview);
    setSelectedFile(file[0]);
  };


  const handleSubmitForm = async (values) => {

    if(db === undefined) {
      toast("User not authenticated");
      navigate("/login");
    }
    const url = await handleUpload()

    const userId = values?.farmer.userId;
    const farmerId = values?.farmer.id;

    const commodityRef = doc(db, 'users', userId, 'farmers', farmerId, "CropAvailability", id);

    const dateSubmitted = format(new Date(), "dd/MM/yyyy");
    try {
      await setDoc(
        commodityRef
        ,
        {
          cropProduced: values?.cropProduced,
          quantityAvailable: values?.quantityAvailable,
          dateOfAvailability: values?.dateOfAvailability,
          userId: userId,
          farmer: values?.farmer,
          dateSubmitted: dateSubmitted,
          remarks: values?.remarks,
          price: values?.price,
          specifications: values?.specifications,
          imageUrl: url || "/static/user/user-11.png" 
        },
        {merge: true},
      );
      toast.success("Form Submitted successfully! Thank you!");
      // window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error(`Failed to Submit Form ${error}`);
    }
  };

  return (
    <Box py={3} px={4}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} py={2} px={3}>
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
          <Grid item xs={12}>
            <Card sx={{ p: 8 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FlexBox gap={0.5} alignItems="center">
                    <IconWrapper>
                      <ShoppingBasket sx={{ color: "primary.main" }} />
                    </IconWrapper>

                    <H6 fontSize={16}>Submit Commoditity Availability Notice</H6>
                  </FlexBox>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                      <InputLabel id="cropProduced">Commodity Produced</InputLabel>
                      <Select
                        fullWidth
                        name="cropProduced"
                        id="cropProduced"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.cropProduced|| ""}
                        error={Boolean(touched.cropProduced && errors.cropProduced)}
                      >
                        {cropOptions.map((crop, index) => (
                          <MenuItem key={index} value={crop.value}>
                            {crop.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <InputLabel id="farmer">Select Farmer</InputLabel>
                      <Select
                        fullWidth
                        value={values?.farmerId || ""}
                        onBlur={handleBlur}
                        name="farmerId"
                        onChange={(event) => {
                          setFieldValue("farmerId", event.target.value);
                        }}
                        error={Boolean(touched.farmer?.id && errors.farmer?.farmerName)}
                        
                      >
                        {registeredFarmers.map((farmer) => (
                          <MenuItem key={farmer.id} value={farmer.id}>
                            {farmer.farmerName}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="quantityAvailable"
                        label="Quantity Available"
                        value={values?.quantityAvailable}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={touched.quantityAvailable && errors.quantityAvailable}
                        error={Boolean(touched.quantityAvailable && errors.quantityAvailable)}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <DatePicker
                        label="Date of Availability"
                        value={values?.dateOfAvailability}
                        onChange={(date) => setFieldValue("dateOfAvailability", date ? date.toISOString() : "")}

                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            name="dateOfAvailability"
                            onBlur={handleBlur}
                            error={Boolean(touched.dateOfAvailability && errors.dateOfAvailability)}
                            helperText={touched.dateOfAvailability && errors.dateOfAvailability}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>

                    
                        <Card>
                        <DropZone onDrop={onDrop} />
                      </Card>
                      {
                        (values?.imageUrl !==undefined || values?.imageUrl !==null) ?
                        (<Image src={values?.imageUrl} alt={values?.cropProduced} height={150} width={150}/>) : <PhotoCamera sx={{ fontSize: 100, color: "grey.400" }} />
                      }
                      {uploadProgress > 0 && <Paragraph>Upload Progress: {uploadProgress}%</Paragraph>}
                      
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="price"
                        label="Price"
                        value={values?.price}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={touched.price && errors.price}
                        error={Boolean(touched.price && errors.price)}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <InputLabel id="specifications">Crop Specifications</InputLabel>
                      <Select
                        multiple
                        fullWidth
                        id="specifications"
                        value={Array.isArray(values?.specifications) ? values.specifications : []}
                        name="specifications"
                        onChange={handleChange}
                        input={<OutlinedInput label="Crops Specifications" />}
                        renderValue={(selected) => (
                          <Stack gap={1} direction="row" flexWrap="wrap">
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Stack>
                        )}
                      >
                        {specifications.map((spec, index) => (
                          <MenuItem key={index} value={spec.value}>
                            {spec.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12}>
                      <InputLabel id="remarks">Remarks</InputLabel>
                      <QuillEditor
                        id="remarks"
                        value={values?.remarks}
                        onChange={(value) => setFieldValue("remarks", value)}
                        error={Boolean(touched.remarks && errors.remarks)}
                        helperText={touched.remarks && errors.remarks}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <FlexBox flexWrap="wrap" gap={2}>
              <Button type="submit" variant="contained">
                Submit Form
              </Button>

              <Button variant="outlined" color="secondary">
                Cancel
              </Button>
            </FlexBox>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};





export default EditProductPageView;
