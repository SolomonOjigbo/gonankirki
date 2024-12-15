"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound, TableToolbar } from "components/table";
import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea";
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import UserTableRow from "../UserTableRow";
import UserTableHead from "../UserTableHead";
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
import useFetchUsers from "hooks/useFetchUsers";
import debounce from "lodash.debounce";

const AllBDSPsPageView = () => {
  const { users, loading } = useFetchUsers();
  const [filteredBDSPs, setFilteredBDSPs] = useState([]);
  const [bdspsFilter, setBdspsFilter] = useState({
    displayName: "",
    search: "",
    isActivated: "",
  });

  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "displayName",
  });

  // Initialize Firestore
  const db = getFirestore();

  const filterBDSPs = () => {
    const filtered = stableSort(users, getComparator(order, orderBy)).filter((item) => {
      const { displayName = "", search = "", isActivated = "" } = bdspsFilter;
      if (displayName && !item.displayName?.toLowerCase().includes(displayName.toLowerCase())) return false;
      if (search && !item.displayName?.toLowerCase().includes(search.toLowerCase())) return false;
      if (isActivated && String(item.isActivated) !== isActivated) return false;
      return true;
    });
    setFilteredBDSPs(filtered);
  };

  // Debounced filtering to improve performance
  const debouncedFilterBDSPs = debounce(filterBDSPs, 300);

  useEffect(() => {
    debouncedFilterBDSPs();
    return () => debouncedFilterBDSPs.cancel();
  }, [users, bdspsFilter, order, orderBy]);

  const handleChangeFilter = (key, value) => {
    setBdspsFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteBDSPUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted successfully!");
      setFilteredBDSPs((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      toast.error("Failed to delete BDSP");
    }
  };

  const handleChangeTab = (_, newValue) => {
    const filters = { ...bdspsFilter };
    switch (newValue) {
      case "All BDSPs":
        filters.isActivated = ""; // Show all
        break;
      case "Active":
        filters.isActivated = "true"; // Show only active users
        break;
      case "Inactive":
        filters.isActivated = "false"; // Show only inactive users
        break;
      default:
        filters.isActivated = ""; // Fallback
        break;
    }
    setBdspsFilter(filters);
  };
  

  const handleAllBDSPsDelete = async () => {
    try {
      await Promise.all(selected.map((id) => deleteDoc(doc(db, "users", id))));
      toast.success("Selected users deleted successfully!");
      setFilteredBDSPs((prev) => prev.filter((user) => !selected.includes(user.id)));
      handleSelectAllRows([]);
    } catch (error) {
      toast.error("Failed to delete selected BDSPs");
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
      <Card>
        <Box px={2} pt={2}>
        <HeadingArea 
  value={bdspsFilter.isActivated === "true" ? "Active" : bdspsFilter.isActivated === "false" ? "Inactive" : "All BDSPs"} 
  changeTab={handleChangeTab} 
/>

          <SearchArea
            value={bdspsFilter.search}
            gridRoute="/dashboard/bdsp-users/all-bdsps/"
            // listRoute="/dashboard/users/user-list-1"
            onChange={(e) => handleChangeFilter("search", e.target.value)}
          />
        </Box>

        {selected.length > 0 && (
          <TableToolbar selected={selected.length} handleDeleteRows={handleAllBDSPsDelete} />
        )}

        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={filteredBDSPs.length}
                onRequestSort={handleRequestSort}
                onSelectAllRows={handleSelectAllRows(filteredBDSPs.map((row) => row.id))}
              />
              <TableBody>
                {filteredBDSPs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bdsp) => (
                  <UserTableRow
                    key={bdsp.id}
                    bdsp={bdsp}
                    isSelected={selected.includes(bdsp.id)}
                    handleSelectRow={handleSelectRow}
                    handleDeleteBDSPUser={handleDeleteBDSPUser}
                  />
                ))}
                {filteredBDSPs.length === 0 && <TableDataNotFound />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Box padding={1}>
          <TablePagination
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={filteredBDSPs.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default AllBDSPsPageView;
