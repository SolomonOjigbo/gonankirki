import { Grid, Stack, Box } from "@mui/material"; // CUSTOM COMPONENTS

// import Post from "./Post";
// import Teams from "./Teams";
import Activation from "./Activation";
import Hobbies from "./Hobbies";
import Summery from "./Summery";
// import Portfolio from "./Portfolio";
// import MyConnections from "./MyConnections";
import AdditionalDetails from "./AdditionalDetails";
import FarmersListView from "./Tables/FarmersListView"

const Overview = ({user}) => {
  return <Box mt={3}>
      <Grid container spacing={3}>
        <Grid item lg={9} md={8} xs={12}>
          <Stack spacing={3}>
            <Summery user={user}/>
            <Activation user={user}/>
            {/* <Teams user={user}/> */}
            {/* <Hobbies user={user} /> */}
            {/* <Post user={user} /> */}
            {/* <Portfolio user={user} /> */}
            {/* <FarmersListView stats={stats} /> */}

          </Stack>
        </Grid>

        <Grid item lg={3} md={4} xs={12}>
          <Stack spacing={3}>
            <AdditionalDetails user={user}/>
            {/* <MyConnections user={user}/> */}
          </Stack>
        </Grid>
      </Grid>
    </Box>;
};

export default Overview;