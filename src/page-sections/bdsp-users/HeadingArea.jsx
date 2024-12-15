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
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  [theme.breakpoints.down(727)]: {
    order: 3,
  },
}));

// Styled Tab to highlight active tab with a bottom border
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    // borderBottom: `3px solid ${theme.palette.primary.main}`,
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
          <StyledTab disableRipple label="All BDSPs" value="All BDSPs" />
          <StyledTab disableRipple label="Active" value="Active" />
          <StyledTab disableRipple label="Inactive" value="Inactive" />
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
