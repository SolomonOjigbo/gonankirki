import { Box, Card, Stack, Table, styled, Button, Divider, useTheme, TableRow, TableBody, TableHead, Select, MenuItem } from "@mui/material"; // CUSTOM COMPONENTS


import { FlexBetween } from "components/flexbox";
import { H6, Paragraph, Span } from "components/typography"; // CUSTOM ICON COMPONENTS
import numeral from "numeral";
import ChartIcon from "icons/ChartIcon";
import CheckMarkCircleOutlined from "icons/CheckMarkCircleOutlined"; 
import DownloadTo from "icons/DownloadTo";
import ReceiptOutlined from "icons/ReceiptOutlined";
import ChartDonut from "icons/sidebar/ChartDonutIcon"; // COMMON STYLED COMPONENTS

import { BodyTableCellV2, BodyTableRow, HeadTableCell } from "../accounts/common/styles"; // CUSTOM UTILS METHOD
import BasicInfoCards from "./BasicInfoCards";
import PeopleIcon from "icons/PeopleIcon";



const EarningBoxWrapper = styled(FlexBetween)(({
  theme
}) => ({
  [theme.breakpoints.down(555)]: {
    flexDirection: "column",
    "& > .MuiButton-root": {
      width: "100%"
    }
  },
  [theme.breakpoints.down(706)]: {
    "& > .MuiButton-root": {
      marginTop: 16
    }
  }
}));
const StyledStack = styled(Stack)(({
  theme
}) => ({
  [theme.breakpoints.down(555)]: {
    width: "100%",
    flexDirection: "column",
    "& > .MuiBox-root": {
      marginLeft: 0,
      width: "100%",
      marginBottom: 16
    }
  }
}));
const EarningBox = styled(Box)(({
  theme
}) => ({
  width: 130,
  paddingTop: 8,
  paddingBottom: 8,
  textAlign: "center",
  borderRadius: "8px",
  border: `1px solid ${theme.palette.grey[200]}`
}));
const BodyTableCell = styled(BodyTableCellV2)(() => ({
  "&:first-of-type": {
    fontWeight: 500
  },
  "&:last-of-type": {
    maxWidth: 100
  }
}));
const StyledHeadTableCell = styled(HeadTableCell)({
  "&:last-of-type": {
    maxWidth: 100
  }
});



 const StatCards = ({title, stats, Icon, iconColor})=> {
    return (
        <>
        <EarningBox>
                <Icon sx={{
              color: iconColor
            }} />

                <H6 fontSize={14} my={0.5}>
                 {stats}
                </H6>

                <Paragraph color="text.secondary">{title}</Paragraph>
              </EarningBox>
        </>
    )
 }

const Stats = ({cropAvailabilityList, inputRequestList, farm}) => {
  const theme = useTheme(); // CUSTOM DUMMY DATA SET


  return <Card sx={{
    pb: 2
  }}>
      <H6 fontSize={14} padding={3}>
       Farm Stats
      </H6>

      <Divider />

      <Box padding={3}>
        <Paragraph color="grey.500">
         Summary
        </Paragraph>

        <EarningBoxWrapper flexWrap="wrap" pt={2}>
          <StyledStack direction="row" flexWrap="wrap" spacing={2}>
          <StatCards  
          title="Commodity Availability"
           stats={cropAvailabilityList?.length > 0 ? cropAvailabilityList?.length: 0}
            Icon={ReceiptOutlined}
             iconColor="orange"
          />
          <StatCards 
          title="Input Requests"
          stats={inputRequestList?.length > 0 ? inputRequestList?.length : 0}
           Icon={ChartDonut}
            iconColor="blue"
          />
          <StatCards 
          title="Farm Size in Hectares"
          stats={farm?.farmData !== null || farm?.farmData !== undefined ? numeral(farm?.farmData?.farmSizeInHectares).format('0.00000') : "N/A"}
           Icon={CheckMarkCircleOutlined }
            iconColor="green"
          />
          </StyledStack>

          <Button style={{padding: 20}} disableRipple variant="outlined">Date Registered: {farm?.dateRegistered}</Button>
          <BasicInfoCards 
           label="Corperative Society"
           info={farm?.cooperativeSociety}
            Icon={PeopleIcon}
          />
        </EarningBoxWrapper>
      </Box>

      
    </Card>;
};

export default Stats;