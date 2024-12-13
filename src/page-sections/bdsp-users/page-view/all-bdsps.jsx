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
import { getFirestore, collection, getDocs, updateDoc } from "firebase/firestore";
import UserTableRow from "../UserTableRow";
import UserTableHead from "../UserTableHead";
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
import useFetchUsers from "hooks/useFetchUsers";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const AllBDSPsPageView = () => {
  const { users, loading, error } = useFetchUsers();
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
    isSelected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "displayName",
  });



const addPropertiesToUsers = async () => {
  try {
    const db = getFirestore(); // Initialize Firestore
    const usersCollection = collection(db, "users"); // Replace 'users' with your collection name
    const usersSnapshot = await getDocs(usersCollection);

    if (usersSnapshot.empty) {
      console.log("No users found.");
      return;
    }

    // Iterate over each user document
    const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
      const userData = userDoc.data();
      const userRef = doc(db, "users", userDoc.id);

      // Add or update the isActivated and isAdmin properties
      await updateDoc(userRef, {
        dateRegistered: "", // Default to false if not set
        lastUpdated: ""
      });
    });

    await Promise.all(updatePromises);

    console.log("isActivated and isAdmin properties added to all users.");
  } catch (error) {
    console.error("Error updating user documents:", error);
  }
};




  useEffect(()=>{
    addPropertiesToUsers()
    .then(() => console.log("Update complete"))
    .catch((err) => console.error("Error updating users:", err));
  }, [])

  useEffect(() => {
    // Apply filters when users or filters change
    const filtered = stableSort(users, getComparator(order, orderBy)).filter((item) => {
      const { displayName, search, isActivated } = bdspsFilter;
      if (displayName && !item.displayName.toLowerCase().includes(displayName.toLowerCase())) return false;
      if (search && !item.displayName.toLowerCase().includes(search.toLowerCase())) return false;
      if (isActivated && isActivated !== "" && String(item.isActivated) !== isActivated) return false;
      return true;
    });
    setFilteredBDSPs(filtered);
  }, [users, bdspsFilter, order, orderBy]);

  const handleChangeFilter = (key, value) => {
    setBdspsFilter((state) => ({ ...state, [key]: value }));
  };

  const handleChangeTab = (_, newValue) => {
    const filters = { ...bdspsFilter };
    if (newValue === "recent") {
      filters.isActivated = ""; // Clear activation filter
    } else {
      filters.isActivated = newValue === "isActivated" ? "true" : newValue === "Inactive" ? "false" : "";
    }
    setBdspsFilter(filters);
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

  const handleAllBDSPsDelete = async () => {
    try {
      for (const id of selected) {
        await deleteDoc(doc(db, "users", id));
      }
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
          <HeadingArea value={bdspsFilter.isActivated} changeTab={handleChangeTab} />
          <SearchArea
            value={bdspsFilter.search}
            gridRoute="/dashboard/users/user-grid-1"
            listRoute="/dashboard/users/user-list-1"
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
                {filteredBDSPs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((bdsp) => (
                    <UserTableRow
                      key={bdsp.id}
                      bdsp={bdsp}
                      isSelected={isSelected(bdsp.id)}
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
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default AllBDSPsPageView;
