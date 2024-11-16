"use client"

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

import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "contexts/firebaseContext";
import useFetchFarmers from "hooks/useFetchFarmers";

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

const InputRequestForm = () => {
  const [categoryInputs, setCategoryInputs] = useState({});
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const { registeredFarmers, loading, error } = useFetchFarmers();
  const { user, db } = useContext(AuthContext);

  const validationSchema = Yup.object({
    farmer: Yup.string().required("Farmer is Required!"),
    categories: Yup.array().min(1, "Select at least one category").required("Categories are Required!"),
    equipment: Yup.array().required("Equipment is Required!"),
  });

  const initialValues = {
    farmer: "",
    categories: [],
    equipment: [],
  };

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
      toast("User not authenticated");
      return;
    }
    const dateSubmitted = format(new Date(), "dd/MM/yyyy");
    try {
      await addDoc(
        collection(
          db,
          "users",
          user.id,
          "farmers",
          selectedFarmer,
          "InputRequests"
        ),
        {
          categories: categoryInputs,
          equipment: values.equipment,
          createdBy: user.id,
          farmId: selectedFarmer,
          dateSubmitted,
        }
      );
      toast("Input Request Submitted Successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast("Failed to Submit Input Request");
    }
  };

  const handleCategoryChange = (selectedCategories) => {
    setFieldValue("categories", selectedCategories);
    const newCategoryInputs = {};
    selectedCategories.forEach((category) => {
      newCategoryInputs[category] = { productName: "", quantity: "" };
    });
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
            theme="colored"
          />
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" component="h2" align="center">
                    Submit Farm Input Request
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <InputLabel id="farmer">Select Farmer</InputLabel>
                  <Select
                    fullWidth
                    value={values.farmer}
                    onBlur={handleBlur}
                    name="farmer"
                    onChange={(event) => {
                      const farmer = registeredFarmers.find(
                        (farmer) => farmer.id === event.target.value
                      );
                      setSelectedFarmer(event.target.value);
                      setFieldValue("farmer", farmer);
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
                    value={values.categories}
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
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {farmInputCategories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {values.categories.map((category) => (
                  <Grid item xs={12} key={category}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" component="h3">
                        {category}
                      </Typography>
                      <TextField
                        fullWidth
                        name={`productName-${category}`}
                        label="Product/Brand Name"
                        value={categoryInputs[category]?.productName || ""}
                        onChange={(e) => handleCategoryInputChange(category, "productName", e.target.value)}
                        margin="normal"
                      />
                      <TextField
                        fullWidth
                        name={`quantity-${category}`}
                        label="Quantity"
                        value={categoryInputs[category]?.quantity || ""}
                        onChange={(e) => handleCategoryInputChange(category, "quantity", e.target.value)}
                        margin="normal"
                      />
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <InputLabel id="equipment">Select Agricultural Equipment</InputLabel>
                  <Select
                    multiple
                    fullWidth
                    id="equipment"
                    value={values.equipment}
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
                    SelectProps={{
                      native: true,
                    }}
                  >
                    {equipmentOptions.map((equipment) => (
                      <MenuItem key={equipment.value} value={equipment.value}>
                        {equipment.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Submit Request
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InputRequestForm;
