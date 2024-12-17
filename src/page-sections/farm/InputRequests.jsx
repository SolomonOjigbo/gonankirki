import { Box, Card, Chip, Grid, Stack, Button, styled, useTheme, Accordion, Pagination, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore"; // CUSTOM COMPONENTS

import MoreChannel from "./MoreChannel";
import Documentation from "./CropsProduced";
import { H6 } from "components/typography";
import { MoreButton } from "components/more-button";
import { SearchInput } from "components/search-input";
import { FlexBetween, FlexBox } from "components/flexbox"; // CUSTOM ICON COMPONENT

import Filter from "icons/Filter"; // CUSTOM UTILS METHOD

import { isDark } from "utils/constants"; // CUSTOM DUMMY DATA

import { TICKETS } from "./data"; // STYLED COMPONENT

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

const InputRequests = ({farm, inputRequests}) => {
  const theme = useTheme();
  return <Box>
      <Grid container spacing={3}>
        {
        /* ALL TICKETS */
      }
        <Grid item xl={9} md={8} xs={12}>
          <Card sx={{
          p: 3
        }}>
           
          </Card>
        </Grid>

        
      </Grid>
    </Box>;
};

export default InputRequests;