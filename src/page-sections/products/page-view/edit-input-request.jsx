"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "contexts/firebaseContext";
import useFetchFarmers from "hooks/useFetchFarmers";
import { getAllInputRequestIds } from "hooks/getAllIds";
import { useParams } from "next/navigation";


const farmInputCategories = [
  { label: "Fertilizer", value: "Fertilizer" },
  { label: "Pesticides", value: "Pesticides" },
  { label: "Fungicides", value: "Fungicides" },
  { label: "Seedlings", value: "Seedlings" },
  { label: "Seeds", value: "Seeds" },
  { label: "Animal Feeds", value: "Animal Feeds" },
];

const equipmentOptions = [
  { label: "Tractor", value: "Tractor" },
  { label: "Plough", value: "Plough" },
  { label: "Harvester", value: "Harvester" },
  { label: "Sprayer", value: "Sprayer" },
  { label: "Planter", value: "Planter" },
  { label: "Seeder", value: "Seeder" },
  { label: "Cultivator", value: "Cultivator" },
  { label: "Rotavator", value: "Rotavator" },
];

const EditInputRequestForm = ({request}) => {
  const params = useParams();
  const id = params.id;
  const [categoryInputs, setCategoryInputs] = useState({});
  const [selectedEquipment, setSelectedEquipment] = useState([]);
//   const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [inputs, setInputs] = useState({
    categories: {},
    equipment: [],
    createdBy: "",
    dateSubmitted: "",
  });

  const { registeredFarmers, loading, error, findInputRequestById } = useFetchFarmers();
  const { db } = useContext(AuthContext);

  const getInputRequest = useCallback(async () => {
    const data = await findInputRequestById(id);
    if (request !== undefined){
        setInputs(request || { categories: {}, equipment: [] });
        setValues(request || { categories: {}, equipment: [] });
        
    }else{
        setInputs(data || { categories: {}, equipment: [] });
        setValues(data || { categories: {}, equipment: [] });
    }
  }, [id, findInputRequestById, request]);

  useEffect(() => {
    getInputRequest();
  }, [getInputRequest]);

  const validationSchema = Yup.object({
    farmer: Yup.string().required("Farmer is Required!"),
    categories: Yup.object().required("Categories are Required!"),
    equipment: Yup.array().required("Equipment is Required!"),
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
        categories: {},
        equipment: [],
        ...inputs,
      },
    validationSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values) => {
    if (!db) {
      toast("User not authenticated");
      return;
    }
    const dateSubmitted = format(new Date(), "dd/MM/yyyy");
    const farmerId = values.farmerId;
    const userId = values.createdBy

    const inputRequestRef = doc(db, "users", userId, "farmers", farmerId, "InputRequests", id)
    try {
      await setDoc(
        inputRequestRef,
        {
            ...values,
          categories: values.categories,
          equipment: values?.equipment,
          dateUpdated: dateSubmitted
        },
        {merge: true}
      );
      toast("Input Request Submitted Successfully!");
      window.location.reload();
      setInputs(
        {
            categories: {},
            equipment: [],
            createdBy: "",
            dateSubmitted: "",
          }
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      toast("Failed to Submit Input Request");
    }
  };

  const handleCategoryChange = (selectedCategories) => {
    setFieldValue("categories", selectedCategories);
    const newCategoryInputs = selectedCategories.reduce((acc, category) => {
      acc[category] = { productName: "", quantity: "" };
      return acc;
    }, {});
    setCategoryInputs(newCategoryInputs);
  };

  const handleCategoryInputChange = (category, name, value) => {
    setCategoryInputs((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [name]: value,
      },
    }));
  };

  const renderCategoryInputs = () =>
    Object.keys(values?.categories).map((category) => (
      <Grid item xs={12} key={category}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" component="h3">
            {category[category]}
          </Typography>
          <TextField
            fullWidth
            name={`productName-${category}`}
            label="Product/Brand Name"
            value={categoryInputs[category] ? categoryInputs[category]?.productName: values.categories[category]?.productName}
            onChange={(e) => handleCategoryInputChange(category, "productName", e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            name={`quantity-${category}`}
            label="Quantity"
            value={categoryInputs[category] ? categoryInputs[category]?.quantity: values?.categories[category]?.quantity}
            onChange={(e) => handleCategoryInputChange(category, "quantity", e.target.value)}
            margin="normal"
          />
        </Card>
      </Grid>
    ));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

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
          theme="light"
          />
          <Grid item xs={12}>
            <Card sx={{ p: 8 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" align="center">
                    Edit Farm Input Request
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <InputLabel id="farmer">Select Farmer</InputLabel>
                  <Select
                    fullWidth
                    value={values?.farmerId}
                    onBlur={handleBlur}
                    name="farmerId"
                    renderValue={()=> {
                        const farmer = registeredFarmers.find((f) => f.id === values?.farmerId)
                        return <h5>{farmer?.farmerName}</h5>
                    }}
                    onChange={(event) => {
                    //   const farmer = registeredFarmers.find((f) => f.id === event.target.value);
                      setFieldValue("farmerId", event.target.value);
                    //   setFieldValue("farmerId", farmer.id);
                    }}
                    error={Boolean(touched.farmer && errors.farmer)}
                  >
                    {registeredFarmers.map((farmer) => (
                      <MenuItem key={farmer.id} value={farmer.id}>
                        {farmer.farmerName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6} xs={12}>
                  <InputLabel id="categories">Select Farm Input Categories</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    id="categories"
                    value={Object?.keys(values?.categories)}
                    name="categories"
                    onChange={(event) => handleCategoryChange(event.target.value)}
                    input={<OutlinedInput label="Categories" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Stack>
                    )}
                    error={Boolean(touched.categories && errors.categories)}
                  >
                    {farmInputCategories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {renderCategoryInputs()}
                <Grid item xs={12}>
                  <InputLabel id="equipment">Select Agricultural Equipment</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    id="equipment"
                    value={values?.equipment || []}
                    name="equipment"
                    onChange={(event) => setFieldValue("equipment", event.target.value)}
                    input={<OutlinedInput label="Equipment" />}
                    renderValue={(selected) => (
                      <Stack gap={1} direction="row" flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Stack>
                    )}
                    error={Boolean(touched.equipment && errors.equipment)}
                  >
                    {equipmentOptions.map((equipment) => (
                      <MenuItem key={equipment.value} value={equipment.value}>
                        {equipment.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth size="large" type="submit" variant="contained">
                    Submit Input Request
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};


// import useFetchFarmers from "hooks/useFetchFarmers";


export async function getStaticPaths() {

    const paths = getAllInputRequestIds();
    return {
      paths,
      fallback: true,
    };
  }
  
  export async function getStaticProps({ params }) {
    const {findInputRequestById} = useFetchFarmers()
    const request = findInputRequestById(params.id);

    return {
      props: {
        request,
      },
    };
  }

export default EditInputRequestForm;
