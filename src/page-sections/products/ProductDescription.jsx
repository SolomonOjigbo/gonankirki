import Box from "@mui/material/Box"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "components/typography";

const ProductDescription = ({product}) => {
  return <Box padding={3}>
      <H6 mb={0.5} fontSize={14}>
        Specification:
      </H6>

      <Paragraph mb={3}>
      {product?.specifications?.map((spec, index)=> 
              <div key={index}> {spec}</div>
            )}
      </Paragraph>

      <H6 mb={0.5} fontSize={14}>
        Description
      </H6>

      <Paragraph>
        {product?.remarks}
      </Paragraph>
    </Box>;
};

export default ProductDescription;