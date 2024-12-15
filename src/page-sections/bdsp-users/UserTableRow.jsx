import { useState } from "react";
import { Avatar, Box, Checkbox, TableCell, TableRow } from "@mui/material";
import { DeleteOutline, Edit, RemoveRedEye } from "@mui/icons-material"; // CUSTOM DEFINED HOOK
import { Modal } from "components/modal";
import useNavigate from "hooks/useNavigate"; // CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "components/table"; // 
const UserTableRow = props => {
  const {
    bdsp,
    isSelected,
    handleSelectRow,
    handleDeleteBDSPUser
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

  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, bdsp.id)} />
      </TableCell>

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar src={bdsp?.photoURL ? bdsp.photoURL : bdsp?.avatar} alt={bdsp?.displayName} variant="rounded" />

          <Box>
            <Paragraph fontWeight={500} color="text.primary" sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer"
            }
          }}>
              {bdsp.displayName}
            </Paragraph>

            <Paragraph fontSize={13}>#{bdsp.id.substring(0, 11)}</Paragraph>
          </Box>
        </FlexBox>
      </TableCell>


      <TableCell padding="normal">{bdsp.email}</TableCell>
      <TableCell padding="normal">{bdsp.phoneNumber}</TableCell>
      <TableCell padding="normal">{bdsp.farmerCount}</TableCell>
      <TableCell padding="normal">{bdsp.inputRequestsNum}</TableCell>
      <TableCell padding="normal">{bdsp.cropAvailabilityNum}</TableCell>

      <TableCell padding="normal">{bdsp.dateRegistered}</TableCell>

      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={RemoveRedEye} title="View" handleClick={() => {
          handleCloseOpenMenu();
          
          navigate(`/dashboard/bdsp-users/bdsp/${bdsp.id}`);
        }} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => {
          handleCloseOpenMenu();
          handleDeleteBDSPUser(bdsp.id);
        }} />
        </TableMoreMenu>
      </TableCell>
       {/* Edit BDSP Modal */}
       <Modal open={openModal} handleClose={handleCloseModal}>
        {/* Edit BDSP Form */}
      </Modal>
    </TableRow>;
};

export default UserTableRow;