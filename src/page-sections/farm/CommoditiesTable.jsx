// Refactored CommoditiesTable
"use client";

import React, { useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter, GridToolbarExport } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import useFetchUsers from "hooks/useFetchUsers";
import Image from "next/image";
import useNavigate from "hooks/useNavigate";

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter placeholder="Search..." />
    <GridToolbarExport csvOptions={{ fileName: "ProductList" }} />
  </GridToolbarContainer>
);

const CommoditiesTable = ({ cropAvailabilityList, loading }) => {
  const { getBDSPUser } = useFetchUsers();
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

  const handleDelete = async () => {
    try {
      // Add deletion logic here
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
      renderCell: (params) => <Image src={params.value} alt="Crop" height={50} width={50} />,
    },
    { field: "cropProduced", headerName: "Crop Produced", flex: 1, sortable: true },
    { field: "dateSubmitted", headerName: "Date Submitted", flex: 1, sortable: true },
    { field: "dateOfAvailability", headerName: "Date of Availability", flex: 1, sortable: true },
    { field: "quantityAvailable", headerName: "Quantity Available", flex: 1, sortable: true },
    { field: "price", headerName: "Price", flex: 1, sortable: true },
    {
      field: "specifications",
      headerName: "Specifications",
      flex: 1,
      renderCell: (params) =>
        params.value.map((spec, index) => <div key={index}>{spec}</div>),
    },
    {
      field: "userId",
      headerName: "BDSP Agent",
      flex: 1,
      renderCell: (params) => <div>{getBDSPUser(params.value).displayName}</div>,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleMoreActionsClick(event, params.row)}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreActionsClose}>
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

  if (!Array.isArray(cropAvailabilityList) || cropAvailabilityList.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">No Commodities Available</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Commodities Available
      </Typography>
      <Box mt={3} height="600px">
        <DataGrid
          rows={cropAvailabilityList.map((product) => ({ id: product.id, ...product }))}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15, 30, 50]}
          slots={{ toolbar: CustomToolbar }}
          sx={{ "& .MuiDataGrid-root": { backgroundColor: "#fff" } }}
        />
      </Box>
    </Box>
  );
};

export default CommoditiesTable;
