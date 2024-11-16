"use client";

import { useState } from "react";
import { Tab, Box, Tabs, Card, Table, styled, Button, TableBody, TableContainer, TablePagination, CircularProgress } from "@mui/material";
import Add from "icons/Add"; // CUSTOM DEFINED HOOK

import useNavigate from "hooks/useNavigate"; // CUSTOM COMPONENTS

import { Scrollbar } from "components/scrollbar";
import { FlexBetween } from "components/flexbox";
import { TableDataNotFound, TableToolbar } from "components/table"; // CUSTOM DEFINED HOOK

import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable"; // CUSTOM PAGE SECTION COMPONENTS

import ProductTableRow from "../ProductTableRow";
import ProductTableHead from "../ProductTableHead";
import ProductTableActions from "../ProductTableActions"; // CUSTOM DUMMY DATA

// import { PRODUCTS } from "__fakeData__/products"; //  STYLED COMPONENTS
import useFetchFarmers from "hooks/useFetchFarmers";
import { id } from "date-fns/locale";

const ListWrapper = styled(FlexBetween)(({
  theme
}) => ({
  gap: 16,
  [theme.breakpoints.down(440)]: {
    flexDirection: "column",
    ".MuiButton-root": {
      width: "100%"
    }
  }
}));

const ProductListPageView = () => {
  const navigate = useNavigate();
  const {cropAvailabilityData, loading,error } = useFetchFarmers();
  const [cropsInfo, setCropsInfo] = useState(cropAvailabilityData);
  console.log('Crop Availability Data:', cropAvailabilityData); // Debugging statement

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const [productFilter, setProductFilter] = useState({
    farmerName: "",
    search: ""
  });

  const handleChangeFilter = (key, value) => {
    setProductFilter(state => ({ ...state,
      [key]: value
    }));
  };

  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  } = useMuiTable({
    defaultOrderBy: "farmerName"
  });
  let filteredCropAvailability = stableSort(cropAvailabilityData, getComparator(order, orderBy)).filter(item => {
    if (productFilter.farmerName) return item.farmerName.toLowerCase() ===productFilter.farmerName; else if(productFilter.search) return  item.farmerName.toLowerCase().includes(productFilter.farmerName.toLowerCase());else return true;
  });

  // const handleDeleteProduct = id => {
  //   setCropsInfo(state => state.filter(item => item.id !== id));
  // };

  // const handleAllProductDelete = () => {
  //   setCropsInfo(state => state.filter(item => !selected.includes(item.id)));
  //   handleSelectAllRows([])();
  // };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <Box pt={2} pb={4}>
      <ListWrapper>
        
        

        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/products/crop-availability-form")}>
          Add New CropAvailability
        </Button>
      </ListWrapper>

      <Card sx={{
      mt: 4
    }}>
        {
        /* SEARCH AND PUBLISH FILTER SECTION */
      }
        {/* <ProductTableActions filter={productFilter} handleChangeFilter={handleChangeFilter} /> */}

        {
        /* TABLE ROW SELECTION HEADER  */
      }
        {/* {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllProductDelete} />} */}

        {
        /* TABLE HEAD AND ROW SECTION */
      }
        <TableContainer>
          <Scrollbar>
            <Table sx={{
            minWidth: 820
          }}>
              <ProductTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={cropAvailabilityData.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(cropAvailabilityData.map(row => row.id))} />

              <TableBody>
                {cropAvailabilityData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => <ProductTableRow key={product.id} product={product} handleSelectRow={handleSelectRow} isSelected={isSelected(product.id)} />)}

                {cropAvailabilityData.length === 0 &&   <TableDataNotFound />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {
        /* PAGINATION SECTION */
      }
        <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={cropAvailabilityData.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
      </Card>
    </Box>;
};

export default ProductListPageView;