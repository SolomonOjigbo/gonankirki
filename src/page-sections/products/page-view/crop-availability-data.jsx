// Refactored ProductListPageView
"use client";

import React, { useState } from "react";
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarExportContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import useFetchFarmers from "hooks/useFetchFarmers";
import Image from "next/image";
import { Menu, MenuItem } from "@mui/material";
import useNavigate from "hooks/useNavigate";
import useFetchUsers from "hooks/useFetchUsers";


const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter placeholder="Search..." />
    <GridToolbarExport csvOptions={{ fileName: "ProductList" }} />
  </GridToolbarContainer>
);

const ProductListPageView = () => {
  const { cropAvailabilityData, loading, error } = useFetchFarmers();
  const { getBDSPUser} = useFetchUsers();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();


  const handleMoreActionsClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMoreActionsClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleView = () => {
    navigate(`/dashboard/products/product-details/${selectedRow.id}`);
    handleMoreActionsClose();
  };

  const handleEdit = () => {
    navigate(`/dashboard/products/edit-commodity/${selectedRow.id}`);
    handleMoreActionsClose();
  };

  const handleDelete = async() => {
    const{userId, farmerId, id} = selectedRow
    try {
      const productDocRef = doc(
        db,
        "users",
        userId,
        "farmers",
        farmerId,
        "CropAvailability",
        id
      );
      await deleteDoc(productDocRef);
      toast.success("Commodity deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Commodity");
    }
    handleMoreActionsClose();
  };

  const columns = [
    {
      field: "imageUrl",
      headerName: "Crop Image",
      flex: 1,
      renderCell: (params) => (
        <Image src={params.value} alt="Crop" height={50} width={50} />
      ),
    },
    {
      field: "cropProduced",
      headerName: "Crop Produced",
      flex: 1,
      sortable: true,
    },
    {
      field: "farmerName",
      headerName: "Farmer Name",
      flex: 1,
      sortable: true,
    },
    {
      field: "dateSubmitted",
      headerName: "Date Submitted",
      flex: 1,
      sortable: true,
    },
    {
      field: "quantityAvailable",
      headerName: "Quantity Available",
      flex: 1,
      sortable: true,
    },
    {
      field: "userId",
      headerName: "BDSP Agent",
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const bdspName = getBDSPUser(params.value)
        return(
          <div>{bdspName.displayName}</div>
        )
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="more actions"
            onClick={(event) => handleMoreActionsClick(event, params.row)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMoreActionsClose}
          >
            <MenuItem onClick={handleView}>View</MenuItem>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box p={3}>
      {/* Page Header */}
      <Typography variant="h5" mb={3}>
        Commodities Available
      </Typography>

      {/* Data Grid */}
      <Box mt={3} height="600px">
        <DataGrid
          rows={cropAvailabilityData?.map((product, index) => ({
            id: product.id,
            ...product,
          }))}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15, 30, 50]}
          slots={{
            toolbar:  CustomToolbar,
           
          }}
          sx={{
            "& .MuiDataGrid-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductListPageView;
