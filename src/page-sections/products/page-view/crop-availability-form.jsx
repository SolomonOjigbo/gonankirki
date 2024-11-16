"use client";

import { useCallback, useState, useContext, useEffect } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";
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

import { H6 } from "components/typography";
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

import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "contexts/firebaseContext";

const cropOptions = [
  { label: "Ginger", value: "Ginger" },
  { label: "Sesame", value: "Sesame" },
  { label: "Cashew Nuts", value: "Cashew Nuts" },
  { label: "Hibiscus", value: "Hibiscus" },
  { label: "Others", value: "Others" },
];
const specifications = [
  { label: "Dried", value: "Dried" },
  { label: "Fresh", value: "Fresh" },
  { label: "Organic", value: "Organic" },
  { label: "Inorganic", value: "Inorganic" },
  { label: "Clean", value: "Clean" },
  { label: "Unclean", value: "Unclean" },
];

const CreateProductPageView = () => {
  const [files, setFiles] = useState([]);
  const { registeredFarmers } = useFetchFarmers();
  const { user, db } = useContext(AuthContext);
  const [formData, setFormData] = useState({
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
  });
  const {loading, findCropAvailabilityById} = useFetchFarmers();


  useEffect(()=> {
    const getProduct = async()=> {
     try {
       const item = await findCropAvailabilityById(id);
       setFormData(item);
       console.log(item);
 
     } catch (error) {
       console.error("Failed to fetch product:", error);
     }
   };
   getProduct();
   
 },[findCropAvailabilityById, id])
 
 console.log(product);

 if (loading) {
   return (
     <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
       <CircularProgress />
     </Box>
   );
 }

  const handleDropFile = useCallback((acceptedFiles) => {
    const files = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles(files);
  }, []);

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

  const initialValues = {formData};

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    const userId = values.farmer.userId;
    const farmerId = values.farmer.id;

    const dateSubmitted = format(new Date(), "dd/MM/yyyy");
    try {
      await addDoc(
        collection(
          db,
          "users",
          userId,
          "farmers",
          farmerId,
          "CropAvailability"
        ),
        {
          cropProduced: values.cropProduced,
          quantityAvailable: values.quantityAvailable,
          dateOfAvailability: values.dateOfAvailability,
          userId: userId,
          farmerId: farmerId,
          farmerName: values.farmer.farmerName,
          dateSubmitted: dateSubmitted,
          remarks: values.remarks,
          price: values.price,
          specifications: values.specifications,
        }
      );
      toast.success("Form Submitted successfully! Thank you!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to Submit Form");
    }
  };

  return (
    <Box pt={2} pb={4}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FlexBox gap={0.5} alignItems="center">
                    <IconWrapper>
                      <ShoppingBasket sx={{ color: "primary.main" }} />
                    </IconWrapper>

                    <H6 fontSize={16}>Submit Crop Availability Notice</H6>
                  </FlexBox>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                      <InputLabel id="cropProduced">Crop Produced</InputLabel>
                      <Select
                        fullWidth
                        name="cropProduced"
                        id="cropProduced"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.cropProduced}
                        error={Boolean(touched.cropProduced && errors.cropProduced)}
                        SelectProps={{
                          native: true,
                          IconComponent: KeyboardArrowDown,
                        }}
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
                        value={values.farmer.id}
                        onBlur={handleBlur}
                        name="farmer"
                        onChange={(event) => {
                          const farmer = registeredFarmers.find(
                            (farmer) => farmer.id === event.target.value
                          );
                          setFieldValue("farmer", farmer);
                        }}
                        error={Boolean(touched.farmer?.id && errors.farmer?.farmerName)}
                        SelectProps={{
                          native: true,
                          IconComponent: KeyboardArrowDown,
                        }}
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
                        value={values.quantityAvailable}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        helperText={touched.quantityAvailable && errors.quantityAvailable}
                        error={Boolean(touched.quantityAvailable && errors.quantityAvailable)}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <DatePicker
                        label="Date of Availability"
                        value={values.dateOfAvailability}
                        onChange={(date) => setFieldValue("dateOfAvailability", date)}
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
                        <DropZone onDrop={handleDropFile} />
                      </Card>
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
                        value={values.price}
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
                        value={values.specifications}
                        name="specifications"
                        onChange={(event) => setFieldValue("specifications", event.target.value)}
                        input={<OutlinedInput label="Crops Specifications" />}
                        renderValue={(selected) => (
                          <Stack gap={1} direction="row" flexWrap="wrap">
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Stack>
                        )}
                        SelectProps={{
                          native: true,
                          IconComponent: KeyboardArrowDown,
                        }}
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
                        value={values.remarks}
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

export default CreateProductPageView;
