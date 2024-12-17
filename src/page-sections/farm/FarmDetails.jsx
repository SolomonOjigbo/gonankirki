
import { Box, Button, Card, Chip, Container, Grid, Stack, styled, useTheme } from "@mui/material"; // CUSTOM COMPONENTS

import { H1, H6, Paragraph } from "components/typography"; // CUSTOM UTILS METHOD
import FarmMap from "./page-view/FarmMap"
import { isDark } from "utils/constants";

const StyledCard = styled(Card)(({
  theme
}) => ({
  padding: "2rem",
  transition: "all 300ms",
  boxShadow: theme.shadows[0],
  border: `1px solid ${theme.palette.grey[isDark(theme) ? 700 : 100]}`,
  ":hover": {
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main
  }
}));


const FarmDetails = ({farm}) => {
  const theme = useTheme();

  const region = farm?.farmLocation
  const polygonCoordinates = farm?.farmData?.polygonCoordinates;
 
  
  return <Card sx={{
    p: 3
  }}>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12}>
          <H6 fontSize={18} mb={4}>
            Farm Location & Address
          </H6>
          <Grid item lg={6} xs={12}>
            <StyledCard>
              <H6 mb={2} fontSize={16}>
            Longitude:  {region?.longitude}<br/>
            Latitude: {region?.latitude}
              </H6>

              <Paragraph mb={6} fontSize={16} color="text.secondary">
              {farm?.farmerAddress}
              </Paragraph>

              <Stack mb={3} direction="row" spacing={1} alignItems="center">
              <p>{farm?.farmerState},</p><span>{farm?.farmerLGA}</span>
              
              </Stack>

              
            </StyledCard>
          </Grid>
         
        </Grid>

        <Grid item lg={6} xs={12}>
          <Card sx={{
          p: 1
        }}>
          <div style={{ width: '100%', height: '560px' }}>
            <FarmMap 
            region={region}
            polygonCoordinates={polygonCoordinates}
            deleteMode={false}
            markersToDelete={[]}
            />
            </div>
          </Card>
        </Grid>

        
      </Grid>
    </Card>;
};

export default FarmDetails;