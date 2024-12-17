"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack"; // CUSTOM PAGE SECTION COMPONENTS

import Footer from "../../_common/Footer";
import LiveUser from "../LiveUser";
import TopQueries from "../TopQueries";
import TopReferral from "../TopReferral";
import ChartFilters from "../ChartFilters";
import CompleteGoal from "../CompleteGoal";
import CompleteRate from "../CompleteRate";
import TopPerforming from "../TopPerforming";
import SessionBrowser from "../SessionBrowser";
import SalesByCountry from "../SalesByCountry";
import CropAvailabilityPiechart from "../CropAvailabilityPiechart";
import useFetchFarmers from "hooks/useFetchFarmers";
import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";
import { useEffect } from "react";

const db = getFirestore();

const Analytics1PageView = () => {
  const { registeredFarmers, cropAvailabilityData, inputRequestData, loading } = useFetchFarmers(); 
  
  const removeFarmersCollection = async () => {
    try {
      // Reference the users collection
      const usersCollectionRef = collection(db, "users");
  
      // Fetch all user documents
      const usersSnapshot = await getDocs(usersCollectionRef);
  
      // Loop through each user document
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
  
        // Reference the farmers subcollection for each user
        const farmersCollectionRef = collection(db, "users", userId, "farmers");
  
        // Fetch all documents in the farmers subcollection
        const farmersSnapshot = await getDocs(farmersCollectionRef);
  
        // Delete each farmer document in the subcollection
        for (const farmerDoc of farmersSnapshot.docs) {
          const farmerDocRef = doc(db, "users", userId, "farmers", farmerDoc.id);
          await deleteDoc(farmerDocRef);
        }
      }
  
      console.log("All farmers collections have been successfully removed.");
    } catch (error) {
      console.error("Error removing farmers collections:", error);
      toast.error("Failed to remove farmers collections. Please try again.");
    }
  };

  useEffect(() => {
    // Call the removeFarmersCollection function once
    removeFarmersCollection();
  }, []);

  return <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        {
        /* DIFFERENT DATA SHOW WITH CHART */
      }
        <Grid item md={8} xs={12}>
          <ChartFilters />
        </Grid>

        {
        /* LIVER ONLINE USER CHART CARD */
      }
        <Grid item md={4} xs={12}>
          <div style={{justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>Commodity Availability Stats</div>
          <CropAvailabilityPiechart cropAvailabilityData={cropAvailabilityData} loading={loading} />
        </Grid>

        {
        /* VISIT BY TOP REFERRAL SOURCE CHART CARD */
      }
        {/* <Grid item md={8} xs={12}>
          <TopReferral />
        </Grid> */}

        {
        /* SESSION BY BROWSER CHART CARD */
      }
        {/* <Grid item md={4} xs={12}>
          <SessionBrowser />
        </Grid> */}

        {
        /* COMPLETE GOAL AND RATES CHART CARD */
      }
        {/* <Grid item lg={3} xs={12}>
          <Stack spacing={3} sx={{
          "& > div": {
            flex: 1
          }
        }} direction={{
          lg: "column",
          sm: "row",
          xs: "column"
        }}>
            <CompleteGoal />
           
          </Stack>
        </Grid> */}

        {
        /* SALES BY COUNTRY CHART CARD */
      }
        
        {/* <Grid item lg={3} xs={12}>
          <Stack spacing={3} sx={{
          "& > div": {
            flex: 1
          }
        }} direction={{
          lg: "column",
          sm: "row",
          xs: "column"
        }}>
            
            <CompleteRate />
          </Stack>
        </Grid> */}

        {/* <Grid item md={4} xs={12}>
          <SessionBrowser />
        </Grid> */}
        {
        /* TOP PERFORMING PAGES CHART CARD */
      }
        {/* <Grid item md={6} xs={12}>
          <TopPerforming />
        </Grid> */}

        {
        /* TOP QUERIES CHART CARD */
      }
        {/* <Grid item md={6} xs={12}>
          <TopQueries />
        </Grid> */}

        {
        /* FOOTER CARD */
      }
        {/* <Grid item xs={12}>
          <Footer />
        </Grid> */}
      </Grid>
    </Box>;
};

export default Analytics1PageView;