import Card from "@mui/material/Card"; // CUSTOM COMPONENTS

import { MoreButton } from "components/more-button";
import { H6, Paragraph } from "components/typography";
import FlexBetween from "components/flexbox/FlexBetween";

const Summery = ({user}) => {
  return <Card sx={{
    padding: 3
  }}>
      <FlexBetween>
        <H6 fontSize={16}>BDSP Profile</H6>
        <MoreButton size="small" />
      </FlexBetween>

      <Paragraph color="text.secondary" mt={2} fontWeight={400}>
        {user?.displayName}
      </Paragraph>
    </Card>;
};

export default Summery;