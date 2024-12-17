import { Box, Card, Chip, Grid, useTheme } from "@mui/material";
import { H6 } from "components/typography";
import Stats from "./Stats";
import Birthday from "icons/Birthday"
import MoneyIcon from "icons/MoneyIcon"
import ProfileIcon from "icons/ProfileIcon"
import Emergency from "icons/Emergency"
import PeopleIcon from "icons/PeopleIcon"
import BasicInfoCards from "./BasicInfoCards"



const Overview = ({farm, cropAvailabilityList, inputRequestList}) => {
  const theme = useTheme();
  return <Grid container spacing={3}>
   

      <Grid item xs={12}>
        <Card sx={{
        position: "relative",
        minHeight: 300,
        p: 3
      }}>

          <H6 fontSize={18} mb={3}>
            Basic Information
          </H6>
        <Stats cropAvailabilityList={cropAvailabilityList} farm={farm}/>

        <Grid container spacing={4} padding={4}>
          <Grid item md={4} xs={12}>
          <BasicInfoCards 
        label="Age"
         info={farm?.age}
          Icon={Birthday}
        />
          </Grid>
          
          <Grid item md={4} xs={12}>
        <BasicInfoCards 
        label="Average Income"
         info={farm?.averageIncome}
          Icon={MoneyIcon}
        />
        </Grid>
        
        <Grid item md={4} xs={12}>
        <BasicInfoCards 
        label="Gender"
         info={farm?.gender}
          Icon={ProfileIcon}
        />
        </Grid>
        <Grid container spacing={4} padding={4}>
        <Grid item md={4} xs={12}>
        <BasicInfoCards 
        label="Number of Employees"
         info={farm?.numberOfEmployees}
          Icon={PeopleIcon}
        />
        </Grid>
        <Grid item md={4} xs={12}>
        <BasicInfoCards 
        label="Number of Dependants"
         info={farm?.numberOfDependents}
          Icon={PeopleIcon}
        />
        </Grid>
        <Grid item md={4} xs={12}>
        <BasicInfoCards 
        label="Conflict Impact"
         info={farm?.conflictImpact}
          Icon={Emergency}
        />
        </Grid>
          </Grid>
        </Grid>
        </Card>
      </Grid>
    </Grid>;
};

export default Overview;