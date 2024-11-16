import { Box, Button, Container, useTheme } from "@mui/material"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "components/typography";
import { FlexBox } from "components/flexbox"; // CUSTOM UTILS METHOD

import { isDark } from "utils/constants";

const Footer = () => {
  const theme = useTheme();
  return <Box component="footer">

      {/* <Container>
        <Box px={4} py={5} zIndex={1} boxShadow={2} marginTop={-10} borderRadius={4} textAlign="center" position="relative" bgcolor={isDark(theme) ? "grey.800" : "white"}>
          <Paragraph fontSize={{
          sm: 24,
          xs: 18
        }} fontWeight={600} mb={3}>
            Have any questions about our template?
          </Paragraph>

          <FlexBox justifyContent="center" alignItems="center" gap={2}>
            <Button LinkComponent="a" href="https://support.ui-lib.com/" target="_blank">
              Submit Ticket
            </Button>
            <Button variant="outlined" LinkComponent="a" href="mailto:support@ui-lib.com?subject=Gonankirki React Query" target="_blank">
              Send an email
            </Button>
          </FlexBox>
        </Box>
      </Container> */}

      <Paragraph fontSize={16} textAlign="center" py={6}>
        Copyright © 2024{" "}
        <Box component="a" href="https://ui-lib.com" target="_blank">
          Octoville Development Company Limited
        </Box>
        . All rights reserved
      </Paragraph>
    </Box>;
};

export default Footer;