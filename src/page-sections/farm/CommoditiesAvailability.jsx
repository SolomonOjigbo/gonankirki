import { Box, Card, Grid, Stack, Button, styled, Accordion, Pagination, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore"; // CUSTOM COMPONENTS

import MoreChannel from "./MoreChannel";
import Documentation from "./CropsProduced";
import { H6 } from "components/typography";
import { MoreButton } from "components/more-button";
import { SearchInput } from "components/search-input";
import { FlexBetween, FlexBox } from "components/flexbox"; // CUSTOM ICON COMPONENT
import CommoditiesTable from "./CommoditiesTable"
import { isDark } from "utils/constants"; // CUSTOM DUMMY DATA

import CropsProduced from "./CropsProduced";

const FilterButton = styled(Button)(({
  theme
}) => ({
  borderRadius: 8,
  padding: ".3rem 1rem",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100],
  ":hover": {
    backgroundColor: theme.palette.grey[isDark(theme) ? 700 : 100]
  }
}));

const CommoditiesAvailability = ({farm, cropAvailabilityList, loading}) => {
  return <Box>
      <Grid container spacing={3}>
        {
        /* ALL TICKETS */
      }
        <Grid item xl={9} md={8} xs={12}>
          <Card sx={{
          p: 3
        }}>
            <FlexBetween>
              <SearchInput placeholder="Search" />

              <FlexBox alignItems="center" gap={1}>
               

                <MoreButton size="small" />
              </FlexBox>
            </FlexBetween>
            <CommoditiesTable cropAvailabilityList={cropAvailabilityList} />
            
          </Card>
        </Grid>

        <Grid item xl={3} md={4} xs={12}>
         
          <CropsProduced crops={farm.cropsProduced}/>
        </Grid>
      </Grid>
    </Box>;
};

export default CommoditiesAvailability;