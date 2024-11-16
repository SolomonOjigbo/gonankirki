import { Badge, Box, Button, Chip } from "@mui/material"; // CUSTOM COMPONENTS

import { Paragraph } from "components/typography";
import { FlexRowAlign } from "components/flexbox";
import { AvatarLoading } from "components/avatar-loading";
import { getAuth, signOut } from "firebase/auth";

const UserAccount = () => {
  const auth = getAuth();
  const user = auth.currentUser
  return <FlexRowAlign flexDirection="column" py={5}>
      <Badge badgeContent="Free" color="primary">
        <AvatarLoading alt="user" percentage={60} src={user.photoURL} sx={{
        width: 50,
        height: 50
      }} />
      </Badge>

      <Box textAlign="center" pt={1.5} pb={3}>
        <Chip variant="outlined" label="60% Complete" size="small" />
        <Paragraph fontSize={16} fontWeight={600} mt={2}>
          {user.displayName}
        </Paragraph>
        <Paragraph fontSize={13} fontWeight={500} color="text.secondary" mt={0.5}>
          {user.email}
        </Paragraph>
      </Box>

      <Button
      onClick={()=> signOut(auth)}
      >Sign Out</Button>
    </FlexRowAlign>;
};

export default UserAccount;