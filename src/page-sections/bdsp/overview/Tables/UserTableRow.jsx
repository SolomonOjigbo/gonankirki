import { useState } from "react";
import { Avatar, Box, Checkbox, TableCell, TableRow } from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material"; // CUSTOM DEFINED HOOK
import { Modal } from "components/modal";
import useNavigate from "hooks/useNavigate"; // CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "components/table"; // ==============================================================
import { toast } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "config/firebase";

// ==============================================================
const UserTableRow = props => {
  const {
    farmer,
    isSelected,
    handleSelectRow,
    handleDeleteFarmer
  } = props;
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState({});

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenMenu = event => {
    setOpenMenuEl(event.currentTarget);
  };

  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  // const handleDeleteFarmer = async (farmerId, userId) => {
  //  console.log(userId, farmerId)

  //   try {
      
  //     const farmerDocRef = doc(db, 'users', userId, 'farmers', farmerId);
  //     await deleteDoc(farmerDocRef);
      

  //     // Remove deleted farmer from state
  //     setFarmers((prevFarmers) =>
  //       prevFarmers.filter((farmer) => farmer.id !== farmerId),
  //     );
  //     alert('Farmer deleted successfully!');
  //   } catch (error) {
  //     // console.error('Error deleting farmer:', error);
  //     alert('Failed to delete farmer');
  //   }
  // };

  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, farmer.id)} />
      </TableCell>

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          {/* <Avatar src={farmer?.photoUrl} alt={user.name} variant="rounded" /> */}

          <Box>
            <Paragraph fontWeight={500} color="text.primary" sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer"
            }
          }}>
              {farmer.farmerName}
            </Paragraph>

            <Paragraph fontSize={13}>#{farmer.id.substring(0, 11)}</Paragraph>
          </Box>
        </FlexBox>
      </TableCell>


      <TableCell padding="normal">{farmer.farmerLocation}</TableCell>
      <TableCell padding="normal">{farmer.farmerPhoneNumber}</TableCell>

      <TableCell padding="normal">{farmer.farmerEmail}</TableCell>
      <TableCell padding="normal">{farmer.farmerAddress}</TableCell>
      <TableCell padding="normal">{farmer.dateRegistered}</TableCell>

      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={Edit} title="Edit" handleClick={() => {
          handleCloseOpenMenu();
          // setOpenModal(true);
          setSelectedFarmer(farmer)
         navigate(`/dashboard/users/farmers/${farmer.id}`)
        }} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => {
          handleCloseOpenMenu();
          handleDeleteFarmer(farmer.id, farmer.userId);
        }} />
        </TableMoreMenu>
      </TableCell>
       {/* Edit Farmer Modal */}
       {/* <Modal open={openModal} handleClose={handleCloseModal}>
        <EditFarmerForm handleCancel={handleCloseModal} farmer={selectedFarmer} />
      </Modal> */}
    </TableRow>;
};

export default UserTableRow;