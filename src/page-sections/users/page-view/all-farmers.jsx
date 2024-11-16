"use client";

import { useContext, useState } from "react";
import { Box, Card, CircularProgress, Table, TableBody, TableContainer, TablePagination } from "@mui/material"; // CUSTOM COMPONENTS

import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound, TableToolbar } from "components/table"; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea";
import UserTableRow from "../UserTableRow";
import UserTableHead from "../UserTableHead"; // CUSTOM DEFINED HOOK

import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable"; // CUSTOM DUMMY DATA

import useFetchFarmers from '../../../hooks/useFetchFarmers';
import AddContactForm from "../AddContactForm";
// import { auth, db } from "config/firebase";
import { toast, ToastContainer } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";
import { AuthContext } from "contexts/firebaseContext";
// import { USER_LIST } from "__fakeData__/users";


const UserList1PageView = () => {
  // const [users, setUsers] = useState([...USER_LIST]);
  const { registeredFarmers, loading, error} = useFetchFarmers();
  const [farmers, setFarmers] = useState(registeredFarmers);
  const { auth, db } = useContext(AuthContext)
  const [farmersFilter, setFarmersFilter] = useState({
    farmerName: "",
    search: ""
  });
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

  const handleChangeFilter = (key, value) => {
    setFarmersFilter(state => ({ ...state,
      [key]: value
    }));
  };

  const handleChangeTab = (_, newValue) => {
    handleChangeFilter("farmerName", newValue);
  };

  let filteredFarmers = stableSort(registeredFarmers, getComparator(order, orderBy)).filter(item => {
    if (farmersFilter.farmerName) return item.farmerName.toLowerCase() === farmersFilter.farmerName;else if (farmersFilter.search) return item.farmerName.toLowerCase().includes(farmersFilter.search.toLowerCase());else return true;
  });

  const handleDeleteFarmer = async (farmerId, userId) => {
   

    try {
      
      const farmerDocRef = doc(db, 'users', userId, 'farmers', farmerId);
      await deleteDoc(farmerDocRef);
      

      // Remove deleted farmer from state
      setFarmers((prevFarmers) =>
        prevFarmers.filter((farmer) => farmer.id !== farmerId),
      );
      toast('Farmer deleted successfully!', 'center');
      // window.location.reload();
    } catch (error) {
      // console.error('Error deleting farmer:', error);
      toast('Failed to delete farmer', 'center');
    }
  };

  const handleAllFarmerDelete = () => {
    setFarmers(state => state.filter(item => !selected.includes(item.id)));
    handleSelectAllRows([])();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <Box pt={2} pb={4}>
      <ToastContainer
        />
      <Card>
        <Box px={2} pt={2}>
          <HeadingArea value={filteredFarmers} changeTab={handleChangeTab} />

          <SearchArea value={farmersFilter.search} gridRoute="/dashboard/users/farmers-grid" listRoute="/dashboard/users/all-farmers" onChange={e => handleChangeFilter("search", e.target.value)} />
        </Box>

        {
        /* TABLE ROW SELECTION HEADER  */
      }
        {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllFarmerDelete} />}


       

        {
        /* TABLE HEAD & BODY ROWS */
      }
        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <UserTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredFarmers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredFarmers.map(row => row.id))} />

              <TableBody>
                {filteredFarmers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(farmer => <UserTableRow key={farmer.id} farmer={farmer} isSelected={isSelected(farmer.id)} handleSelectRow={handleSelectRow} handleDeleteFarmer={handleDeleteFarmer} />)}

                {filteredFarmers.length === 0 && <TableDataNotFound />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {
        /* PAGINATION SECTION */
      }
        <Box padding={1}>
          <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredFarmers.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25,50]} onRowsPerPageChange={handleChangeRowsPerPage}/>
        </Box>
      </Card>
    </Box>;
};

export default UserList1PageView;