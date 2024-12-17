import { Box, Card, IconButton, Stack } from "@mui/material"; // CUSTOM COMPONENTS

import { Paragraph } from "components/typography"; // CUSTOM ICON COMPONENTS


import HomeOutlined from "icons/HomeOutlined";

const BasicInfoCards = ({label, info, Icon}) => {
  return <Card sx={{
    border: 1,
    padding: 2,
    display: "flex",
    boxShadow: "none",
    alignItems: "center",
    borderColor: "divider",
    justifyContent: "space-between"
  }}>
      <Box maxWidth="60%">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Icon sx={{
          color: "grey.400"
        }} />
          <Paragraph fontWeight={500}> {label} </Paragraph>
        </Stack>

        <Paragraph mt={1} color="grey.500">
            {info}
        </Paragraph>
      </Box>

     
    </Card>;
};

export default BasicInfoCards;