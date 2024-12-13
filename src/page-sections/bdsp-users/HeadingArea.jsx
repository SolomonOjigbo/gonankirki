import { TabContext, TabList } from "@mui/lab";
import { Button, styled, Tab } from "@mui/material";
import useNavigate from "hooks/useNavigate";
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
import GroupSenior from "icons/GroupSenior";
import Add from "icons/Add";

// Styled TabList wrapper
const TabListWrapper = styled(TabList)(({ theme }) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3,
  },
}));

const HeadingArea = ({ value, changeTab }) => {
  const navigate = useNavigate();

  return (
    <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <GroupSenior sx={{ color: "primary.main" }} />
        </IconWrapper>
        <Paragraph fontSize={16}>Registered BDSP Users</Paragraph>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab disableRipple label="All BDSPs" value="" />
          {/* <Tab disableRipple label="Recently Registered" value="recent" /> */}
          <Tab disableRipple label="Active" value="isActivated" />
          <Tab disableRipple label="Inactive" value="Inactive" />
        </TabListWrapper>
      </TabContext>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => navigate("/dashboard/bdsp-users/all-bdsps/add-user")}
      >
        Add BDSP User
      </Button>
    </FlexBetween>
  );
};

export default HeadingArea;
