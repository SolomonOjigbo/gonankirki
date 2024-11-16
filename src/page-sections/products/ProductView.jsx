import { useEffect, useState } from "react";
import { Box, Card, Chip, Grid, Stack, Button, styled, TextField, IconButton, RadioGroup, CircularProgress } from "@mui/material";
import { CarouselProvider, Dot, Image, Slide, Slider } from "pure-react-carousel"; // CUSTOM COMPONENTS

import { Counter } from "components/counter";
import FlexBox from "components/flexbox/FlexBox";
import { Span, H2, H6, H4, H5, H3, Paragraph } from "components/typography"; // CUSTOM ICON COMPONENTS
import Heart from "icons/Heart";
import ChevronDown from "icons/ChevronDown"; // STYLED COMPONENTS
import { useParams } from "next/navigation";
import useNavigate from "hooks/useNavigate";
import useFetchFarmers from "hooks/useFetchFarmers";

const StyledCarouselProvider = styled(CarouselProvider)(({
  theme
}) => ({
  display: "flex",
  position: "relative",
  "& .carousel__slider": {
    flexGrow: 1,
    marginLeft: 10
  },
  "& .carousel__slide-focus-ring": {
    display: "none"
  },
  "& button": {
    border: "none !important",
    opacity: 0.5
  },
  "& button:disabled": {
    opacity: 1,
    position: "relative",
    "&::after": {
      left: 0,
      height: 3,
      bottom: -6,
      content: '""',
      width: "100%",
      position: "absolute",
      backgroundColor: theme.palette.primary.main
    }
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    "& .carousel__slider": {
      marginLeft: 0
    }
  }
}));
const StyledStack = styled(Stack)(({
  theme
}) => ({
  [theme.breakpoints.down("sm")]: {
    marginTop: 10,
    flexDirection: "row",
    "& .carousel__dot": {
      marginTop: 0,
      marginRight: 8
    }
  }
}));
const StyledIconButton = styled(IconButton)(({
  theme
}) => ({
  top: 10,
  right: 10,
  position: "absolute",
  backgroundColor: theme.palette.grey[400],
  "&:hover": {
    backgroundColor: theme.palette.grey[400]
  }
}));

const ProductViewCard = ({product}) => {

 

  return <Card sx={{
    padding: 2
  }}>
      <Grid container spacing={3}>
        {
        /* PRODUCT IMAGE CAROUSEL */
      }
        <Grid item md={7} xs={12}>
          <StyledCarouselProvider totalSlides={3} dragEnabled={false} naturalSlideWidth={100} naturalSlideHeight={75}>
            <StyledStack spacing={3}>
              {[0, 1, 2].map(item => <Dot slide={item} key={item} style={{
              width: 60,
              height: 55
            }}>
                  <Box component={Image} hasMasterSpinner={true} src={product?.imageUrl} sx={{
                objectFit: "cover",
                borderRadius: 1
              }} />
                </Dot>)}
            </StyledStack>

            <Slider>
              {[0, 1, 2].map(item => <Slide index={item} key={item} className="slide">
                  <Box component={Image} hasMasterSpinner={true} src={product?.imageUrl} sx={{
                objectFit: "cover",
                borderRadius: 2
              }} />
                </Slide>)}
            </Slider>

            <StyledIconButton>
              <Heart />
            </StyledIconButton>
          </StyledCarouselProvider>
        </Grid>

        {
        /* PRODUCT INFORMATION */
      }
        <Grid item md={5}>
          <Chip color="success" size="small" label="In Stock" />

          {
          /* PRODUCT FARMER */
        }
          <Paragraph color="text.secondary" fontSize={20} mt={2}>
           Farmer: {product?.farmer?.farmerName}
          </Paragraph>

          {
          /* PRODUCT NAME */
        }
          <H2 color="primary.main" my={2}>{product?.cropProduced}</H2>

          {
          /* PRODUCT PRICE */
        }

          <H6 color="primary.main" my={2}>
          ₦ {product?.price}
          </H6>
          

          {
          /* PRODUCT Specifications */
        }
          <FlexBox alignItems="center" gap={3}>
            <H6 fontSize={16}>Commodity Specifications:</H6>

            {product?.specifications?.map((spec, index)=> 
              <div key={index}> {spec}</div>
            )}
          </FlexBox>

          {
          /* DATE AVAILABLE */
        }
          <FlexBox alignItems="center" gap={3} mt={3}>
            <H6 fontSize={14}>Date Available: {product?.dateOfAvailability}</H6>

            
          </FlexBox>

          {
          /* PRODUCT QUANTITY */
        }
          <FlexBox alignItems="center" gap={3} mt={3}>
            <H6 fontSize={16}>Quantity: </H6>
            <Counter />
            
            
          </FlexBox>

          <FlexBox alignItems="center" gap={3} mt={3}>
          <Paragraph color="text.secondary">Available: {product?.quantityAvailable || "N/A"} </Paragraph>
          <Paragraph color="text.secondary">Measurement: {product?.unitOfMeasure}</Paragraph>
          </FlexBox>

          {
          /* PRODUCT ADD TO CART BUTTON */
        }
          <FlexBox alignItems="center" gap={3} mt={3}>
            <Button variant="contained">Buy Now</Button>
            <Button variant="contained" color="success">
              Contact Farmer
            </Button>
          </FlexBox>

         
        </Grid>
      </Grid>
    </Card>;
};

export default ProductViewCard;