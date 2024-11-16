import { useState } from "react";
import { Avatar, Box, Checkbox, TableCell, TableRow } from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material"; // CUSTOM DEFINED HOOK
import { Modal } from "components/modal";
import useNavigate from "hooks/useNavigate"; // CUSTOM COMPONENTS
import EditRequestForm from "./EditRequestForm";
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "components/table"; // ==============================================================
import useFetchFarmers from "hooks/useFetchFarmers";
import useFetchUsers from "hooks/useFetchUsers";

// ==============================================================
const UserTableRow = props => {
  const {
    request,
    isSelected,
    handleSelectRow,
   handleDeleteInputRequest
  } = props;
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState({});
  const {findFarmerById, loading} = useFetchFarmers();
  const farmer = findFarmerById(request?.farmId)
  const {getBDSPUser} = useFetchUsers();

  const BDSPAgent = getBDSPUser(request?.createdBy)


  // console.log("Input Request: ", request)

  const handleCloseModal = () => setOpenModal(false);

  const handleOpenMenu = event => {
    setOpenMenuEl(event.currentTarget);
  };

  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, request.id)} />
      </TableCell>

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          {/* <Avatar src={request?.photoUrl} alt={user.name} variant="rounded" /> */}

          <Box>
            <Paragraph fontWeight={500} color="text.primary" sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer"
            }
          }}>
              {farmer?.farmerName}
            </Paragraph>

            <Paragraph fontSize={13}>{farmer?.farmerState}</Paragraph>
          </Box>
        </FlexBox>
      </TableCell>


      {/* <TableCell padding="normal"></TableCell> */}
      <TableCell padding="normal">
      <FlexBox alignItems="center" gap={2}>

          <Box>
            <Paragraph fontWeight={400} color="text.primary" sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer"
            }
          }}>
             Product/Brand <br/> {request?.categories.Fertilizer?.productName}
            </Paragraph>

            <Paragraph fontSize={13}>Quantity: {request?.categories?.Fertilizer?.quantity}</Paragraph>
          </Box>
        </FlexBox>
       
        
        </TableCell>
      <TableCell padding="normal">
      <FlexBox alignItems="center" gap={2}>
          
     
          <Box>
            <Paragraph fontWeight={400} color="text.primary" sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer"
            }
          }}>
             Product/Brand <br/> {request?.categories?.Pesticides?.productName}
               
            </Paragraph>

            <Paragraph fontSize={13}>Quantity: {request?.categories?.Pesticides?.quantity}</Paragraph>
          </Box>
        </FlexBox>
       
        
        </TableCell>

      <TableCell padding="normal">{request.equipment.map((equipment, index) => (
        <Paragraph key={index}>{equipment}</Paragraph>
      ))}</TableCell>
      <TableCell padding="normal">{BDSPAgent?.displayName}</TableCell>
      <TableCell padding="normal">{request?.dateSubmitted}</TableCell>

      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={Edit} title="Edit" handleClick={() => {
          handleCloseOpenMenu();
          // setOpenModal(false);
          setSelectedFarmer(request)
          navigate(`/dashboard/products/edit-input-request/${request.id}`)
        }} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => {
          handleCloseOpenMenu();
          handleDeleteInputRequest(request.createdBy, request?.farmerId, request.id);
        }} />
        </TableMoreMenu>
      </TableCell>
       {/* Edit Farmer Modal */}
       <Modal open={openModal} handleClose={handleCloseModal}>
        <EditRequestForm handleCancel={handleCloseModal} request={selectedFarmer} />
      </Modal>
    </TableRow>;
};

export default UserTableRow;