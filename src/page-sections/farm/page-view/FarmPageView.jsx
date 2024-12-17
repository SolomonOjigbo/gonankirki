"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Search from "@mui/icons-material/Search";
import { Box, Button, Card, Grid, TextField, useTheme } from "@mui/material"; // CUSTOM DEFINED HOOK

import useNavigate from "hooks/useNavigate"; // CUSTOM COMPONENTS

import TabButton from "../TabButton";
import { H4, H6 } from "components/typography";
import { FlexBetween, FlexBox } from "components/flexbox"; // CUSTOM PAGE SECTION COMPONENTS

import Faq from "../CommoditiesAvailability";
import Tickets from "../InputRequests";
import Contact from "../FarmDetails";
import Overview from "../Overview"; // CUSTOM UTILS METHOD

import { isDark } from "utils/constants";
import { useParams } from "next/navigation";
import useFetchFarmers from "hooks/useFetchFarmers";
import CommoditiesAvailability from "../CommoditiesAvailability";
import InputRequests from "../InputRequests";
import FarmDetails from "../FarmDetails";
import useFetchStats from "hooks/useFetchStats";

const FarmPageView = () => {
  const theme = useTheme();
  const params = useParams()
  const { id } = params;
  const {findFarmerById, loading} = useFetchFarmers();
  const navigate = useNavigate()
  const [active, setActive] = useState("Farmer Details");
  const [farm, setFarm] = useState();
  const { getFarmerCropAvailability, getFarmerInputRequests} = useFetchStats()

  const [cropAvailabilityList, setCropAvailabilityList] = useState([]);
  const [inputRequestList, setInputRequestList] = useState([]);


  const fetchFarmerData = async(id) => {
    if(!loading){

      const farmerData = findFarmerById(id)
      setFarm(farmerData); // Initialize form values
      const inputRequestData = getFarmerInputRequests(farmerData?.userId, id )
      setInputRequestList(inputRequestData)
      const cropAvailability = getFarmerCropAvailability(farmerData?.userId, id)
      setCropAvailabilityList(cropAvailability)
    }
    
 }
  useEffect(() => {
      fetchFarmerData(id);
  }, [id, findFarmerById, getFarmerInputRequests, getFarmerCropAvailability]);

  const handleChange = value => () => setActive(value);





  return <Box py={3}>
      <Card sx={{
      p: 3,
      mb: 3
    }}>
        {
        /* HEADING AREA */
      }
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5} lg={4}>
            <Box textAlign="center">
              <Image alt="farm-picture" 
              // src={require("../../../../public/static/illustration/support.svg")} 
              src={farm?.photoUrl ? farm.photoUrl: require("../../../../public/static/illustration/support.svg")} 
              width={200}
              height={150}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <Box>
              <H4 mb={2} fontSize={25}>
                {farm?.farmerName}
              </H4>
              <H6 mb={2} fontSize={20}>
                {farm?.farmerPhoneNumber}
              </H6>

              
            </Box>
          </Grid>
        </Grid>

        {
        /* TAB BUTTON LIST */
      }
        <FlexBetween p={2} mt={4} gap={2} flexWrap="wrap" borderRadius={4} bgcolor={isDark(theme) ? "grey.700" : "grey.100"}>
          <FlexBox flexWrap="wrap" rowGap={2} columnGap={8}>
            <TabButton title="Farmer Details" active={active} handleChange={handleChange} />
            <TabButton title="Farm Size & Location" active={active} handleChange={handleChange} />
            <TabButton title="Commodities Availability" active={active} handleChange={handleChange} />
            <TabButton title="Input Requests" active={active} handleChange={handleChange} />
          </FlexBox>

          <Button size="small" onClick={() => navigate(`/dashboard/users/farmers/${id}`)}>
            Edit Farm Details
          </Button>
        </FlexBetween>
      </Card>

      {
      /* BODY CONTENTS  */
    }
      {active === "Farmer Details" && <Overview farm={farm} cropAvailabilityList={cropAvailabilityList} inputRequestList={inputRequestList} />}
      {active === "InputRequests" && <InputRequests farm={farm} inputRequestList={inputRequestList}/>}
      {active === "Commodities Availability" && <CommoditiesAvailability farm={farm} cropAvailabilityList={cropAvailabilityList} loading={loading}/>}
      {active === "Farm Size & Location" && <FarmDetails farm={farm}/>}
    </Box>;
};

export default FarmPageView;