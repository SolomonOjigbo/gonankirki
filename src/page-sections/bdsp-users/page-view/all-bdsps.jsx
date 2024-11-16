"use client";

import { useEffect, useState } from "react";
import { Box, Card, CircularProgress, Table, TableBody, TableContainer, TablePagination } from "@mui/material"; // CUSTOM COMPONENTS

import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound, TableToolbar } from "components/table"; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea";
import UserTableRow from "../UserTableRow";
import UserTableHead from "../UserTableHead"; // CUSTOM DEFINED HOOK

import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable"; // CUSTOM DUMMY DATA
import useFetchUsers from "hooks/useFetchUsers";
import useFetchFarmers from "hooks/useFetchFarmers";
// import { USER_LIST } from "__fakeData__/users";


const DataTable1PageView = () => {
  // const [users, setUsers] = useState([...USER_LIST]);
  // const { users, } = useFetchUsers();
  const { users, loading, error } = useFetchUsers();
  // const [userData, setUserData] = useState([]);
  // const [farmers, setFarmers] = useState(userData);
  const [farmersFilter, setFarmersFilter] = useState({
    displayName: "",
    search: ""
  });



  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await aggregateFormSubmissions();
  //     setUserData(data);
  //   };

  //   fetchData();
  // }, [aggregateFormSubmissions]);


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
    handleChangeFilter("farmerLocation", newValue);
  };

  let filteredFarmers = stableSort(users, getComparator(order, orderBy)).filter(item => {
    if (farmersFilter.displayName) return item.displayName.toLowerCase() === farmersFilter.displayName;else if (farmersFilter.search) return item.name.toLowerCase().includes(farmersFilter.search.toLowerCase());else return true;
  });

  const handleDeleteFarmer = id => {
    setFarmersFilter(state => state.filter(item => item.id !== id));
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
      <Card>
        <Box px={2} pt={2}>
          <HeadingArea value={farmersFilter.displayName} changeTab={handleChangeTab} />

          <SearchArea value={farmersFilter.search} gridRoute="/dashboard/users/user-grid-1" listRoute="/dashboard/users/user-list-1" onChange={e => handleChangeFilter("search", e.target.value)} />
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
          <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredFarmers.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
        </Box>
      </Card>
    </Box>;
};

export default DataTable1PageView;