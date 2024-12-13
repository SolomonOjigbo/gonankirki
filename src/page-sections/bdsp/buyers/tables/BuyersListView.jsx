"use client";

import { useState } from "react";
import { Box, CircularProgress} from "@mui/material"; // CUSTOM COMPONENTS
import { ToastContainer, toast } from "react-toastify";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { doc } from "firebase/firestore";



const BuyersListView = ({user, stats}) => {
  const {registeredBuyers, loading, error} = stats
 
  
 
  const columns = [
    {
      field: 'buyerName',
      headerName: 'Buyer name',
      width: 190,
      editable: true,
    },
    {
      field: 'buyerPhoneNumber',
      headerName: 'Phone Number',
      width: 150,
      editable: true,
    },
    
    {
      field: 'buyerEmail',
      headerName: 'Email Address',
      type: 'email',
      width: 250,
      editable: true,
    },
    {
      field: 'buyerLocation',
      headerName: 'Buyer Location',
      width:190,
      editable: true,
    },
    {
      field: 'buyerAddress',
      headerName: 'Address',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 420,
    },
  ];
   

 

  const handleDeleteBuyer = async (userId, farmerId, id) => {
    try {
      
      const inputDocRef = doc(db, 'users', userId, 'farmers', farmerId, 'InputRequests', id);
      await deleteDoc(inputDocRef);
      

      // Remove deleted farmer from state
      setRequests(state => state.filter(item => item.id !== id));
      toast('Farm Input Request deleted successfully!');
      window.location.reload();
    } catch (error) {
      // console.error('Error deleting farmer:', error);
      toast('Failed to delete Input Request');
    }
    
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Box pt={2} pb={4}>

    <ToastContainer/>
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={registeredBuyers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10,20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    </Box>
    );
};

export default BuyersListView;