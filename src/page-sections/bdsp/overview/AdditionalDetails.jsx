import { Card, Stack, useTheme, alpha, Box } from "@mui/material"; // CUSTOM COMPONENTS

import { H6, Small } from "components/typography";
import { MoreButton } from "components/more-button";
import FlexBetween from "components/flexbox/FlexBetween"; // CUSTOM ICON COMPONENTS

import Globe from "icons/Globe";
import DateRange from "icons/DateRange";
import Education from "icons/Education";
import UserOutlined from "icons/UserOutlined";
import EmailOutlined from "icons/EmailOutlined";
import BriefcaseOutlined from "icons/BriefcaseOutlined";
import Call from "icons/Call";
import { userAgent } from "next/server";

const AdditionalDetails = ({user}) => {
  const theme = useTheme();
  return <Card sx={{
    padding: 3
  }}>
      <FlexBetween>
        <H6 fontSize={16}>Basic Details</H6>
        <MoreButton size="small" />
      </FlexBetween>

      <Stack mt={3} spacing={2}>
        <ListItem title="Email" Icon={EmailOutlined} subTitle={user?.email} color={theme.palette.grey[400]} />

        <ListItem Icon={Call} title="Phone Number" subTitle={user?.phoneNumber} color={theme.palette.primary.main} />

        <ListItem title="Nickname" subTitle={user?.displayName} Icon={UserOutlined} color={theme.palette.warning[600]} />

        <ListItem Icon={DateRange} title="Join Date" subTitle={user?.dateRegistered? user.dateRegistered : "N/A"} color={theme.palette.success.main} />

        <ListItem title="Location" subTitle={user.address ? user.address : "N/A"} Icon={BriefcaseOutlined} color={theme.palette.error.main} />

        <ListItem Icon={Education} title="User Role" subTitle={user?.userRole} color={theme.palette.warning.main} />
      </Stack>
    </Card>;
};

export default AdditionalDetails; // ===========================================================================

// ===========================================================================
function ListItem({
  title,
  subTitle,
  Icon,
  color
}) {
  return <Stack direction="row" alignItems="center" spacing={1.5}>
      <Stack alignItems="center" justifyContent="center" sx={{
      width: 30,
      height: 30,
      borderRadius: "4px",
      backgroundColor: alpha(color, 0.2)
    }}>
        <Icon sx={{
        color
      }} />
      </Stack>

      <Box>
        <Small lineHeight={1} color="text.secondary">
          {title}
        </Small>
        <H6 fontSize={14}>{subTitle}</H6>
      </Box>
    </Stack>;
}