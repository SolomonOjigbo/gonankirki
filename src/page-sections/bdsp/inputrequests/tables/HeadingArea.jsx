import { TabContext, TabList } from "@mui/lab";
import { Button, styled, Tab } from "@mui/material"; // CUSTOM DEFINED HOOK

import useNavigate from "hooks/useNavigate"; // CUSTOM COMPONENTS

import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox"; // CUSTOM ICON COMPONENTS

import GroupSenior from "icons/GroupSenior";
import Add from "icons/Add"; // STYLED COMPONENT

const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
})); // ===================================================================

// ===================================================================
const HeadingArea = ({
  value,
  changeTab
}) => {
  const navigate = useNavigate();
  return <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <GroupSenior sx={{
          color: "primary.main"
        }} />
        </IconWrapper>

        <Paragraph fontSize={16}>Farm Input Requests</Paragraph>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab disableRipple label="All Request" value="" />
          <Tab disableRipple label="Recently Request" value="recent" />
          {/* <Tab disableRipple label="Subscriber" value="subscriber" /> */}
        </TabListWrapper>
      </TabContext>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/products/input-request-form")}>
        Create Input Request
      </Button>
    </FlexBetween>;
};

export default HeadingArea;