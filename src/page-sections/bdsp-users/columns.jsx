import { Avatar, Box, Checkbox } from "@mui/material";
// CUSTOM COMPONENTS
import FlexBox from "components/flexbox/FlexBox";
import { Paragraph, Small } from "components/typography"; // common cell component
import avatar from "../../../public/static/avatar/011-man-2.svg"; //

const CommonCell = ({
  title,
  body
}) => <Box>
    <Paragraph fontWeight={500} color="text.primary">
      {title}
    </Paragraph>

    <Small color="text.secondary">{body}</Small>
  </Box>; // ===============================


// ===============================
export const columns = [{
  id: "select",
  maxSize: 50,
  header: ({
    table
  }) => <Checkbox {...{
    checked: table.getIsAllRowsSelected(),
    indeterminate: table.getIsSomeRowsSelected(),
    onChange: table.getToggleAllRowsSelectedHandler()
  }} />,
  cell: ({
    row
  }) => <Checkbox {...{
    checked: row.getIsSelected(),
    disabled: !row.getCanSelect(),
    indeterminate: row.getIsSomeSelected(),
    onChange: row.getToggleSelectedHandler()
  }} />
}, {
  header: "Name",
  minSize: 200,
  accessorKey: "displayName",
  cell: ({
    row
  }) => {
    const {
      displayName,
      id
    } = row.original;
    return <FlexBox alignItems="center" gap={1.5}>
          <Avatar alt={displayName} src={avatar} variant="rounded" sx={{
        backgroundColor: "action.selected",
        p: 0.5,
        pb: 0
      }} />

          <CommonCell title={displayName} body={id} />
        </FlexBox>;
  }
}, {
  header: "Email",
  accessorKey: "email",
  cell: ({
    row
  }) => <CommonCell title={row.original.email}/>
}, 
 {
  header: "Phone Number",
  accessorKey: "phoneNumber",
  cell: ({
    row
  }) => <CommonCell title={row.original.phoneNumber}  />
}, {
  maxSize: 80,
  header: "No of Farmers",
  accessorKey: "name"
}, {
  header: "No of Input Requests",
  accessorKey: "inputRequestsNum",
}, 
{
  header: "No of Crop Availability",
  accessorKey: "cropAvailabilityNums"
}, 
{
  header: "Address",
  accessorKey: "address"
}, 
{
  header: "Address",
  accessorKey: "address"
}, 
{
  header: "Status",
  accessorKey: "status"
}];