"use client";

import { useEffect, useState } from "react";
import { Box, Card, CircularProgress, Grid, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab"; // CUSTOM PAGE SECTION COMPONENTS

import ProductView from "../ProductView";
import { ProductReviews } from "../product-review";
import ProductDescription from "../ProductDescription";
import { useParams } from "next/navigation";
import useFetchFarmers from "hooks/useFetchFarmers";
import { toast } from "react-toastify";
import { getAllCommodityIds } from "hooks/getAllIds";

const ProductDetailsPageView = ({productData}) => {
  const [tab, setTab] = useState("1");

  const tabChange = (_, value) => setTab(value);

  const [product, setProduct] = useState(null);
  const params = useParams()
  const { id } = params;
  const {findCropAvailabilityById, loading} = useFetchFarmers();

  useEffect(()=> {
     const getProducts = async()=> {
      try {
        const item = await findCropAvailabilityById(id);
        if(productData !==undefined && product !==null) {

          setProduct(productData); //
        }else{
          setProduct(item);
         
        }
  
      } catch (error) {
        toast(`Failed to fetch product:${error}`);
      }
    };
    getProducts();
    
  },[findCropAvailabilityById, id, product])
  
  console.log(product);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProductView product={product}/>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <TabContext value={tab}>
              <TabList onChange={tabChange} sx={{
              pl: 3,
              minHeight: 50,
              pt: 0.5
            }}>
                <Tab disableRipple label="Description" value="1" />
                <Tab disableRipple label="Reviews" value="2" />
              </TabList>

              <TabPanel value="1">
                <ProductDescription product={product} />
              </TabPanel>

              <TabPanel value="2">
                <ProductReviews />
              </TabPanel>
            </TabContext>
          </Card>
        </Grid>
      </Grid>
    </Box>;
};

export async function getStaticPaths() {

  const paths = getAllCommodityIds();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const {findCropAvailabilityById} = useFetchFarmers()
  const product = findCropAvailabilityById(params.id);

  return {
    props: {
      product,
    },
  };
}

export default ProductDetailsPageView;