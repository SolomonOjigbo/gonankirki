import { Button, ButtonBase, ButtonGroup, Card, Grid, styled } from "@mui/material"; // CUSTOM COMPONENTS

import { H6 } from "components/typography";
import { FlexBetween } from "components/flexbox";
import { MoreButton } from "components/more-button"; // CUSTOM UTILS METHOD

import { isDark } from "utils/constants"; // STYLED COMPONENTS
import { doc, updateDoc } from "firebase/firestore";
import useAuth from "hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
// import { Button } from "theme/components/button";

const ButtonOne = styled(ButtonBase)(({
  theme
}) => ({
  fontSize: 14,
  width: "100%",
  cursor: "auto",
  fontWeight: 500,
  overflow: "hidden",
  whiteSpace: "nowrap",
  padding: ".8rem 1rem",
  textOverflow: "ellipsis",
  borderRadius: "8px 0 0 8px",
  backgroundColor: theme.palette.grey[isDark(theme) ? 600 : 100]
}));
const ButtonTwo = styled(ButtonBase)(({
  theme
}) => ({
  fontSize: 14,
  cursor: "auto",
  fontWeight: 600,
  padding: ".8rem 1rem",
  borderRadius: "0 8px 8px 0",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.divider
})); // CUSTOM DUMMY DATA LIST

const LIST = [{
  id: 1,
  title: "Graphic Design",
  amount: 40
}, {
  id: 2,
  title: "Font End Dev",
  amount: 32
}, {
  id: 3,
  title: "Figma Design",
  amount: 50
}, {
  id: 4,
  title: "Figma Design",
  amount: 50,
  complete: true
}, {
  id: 5,
  title: "Graphic Design",
  amount: 40
}, {
  id: 6,
  title: "Font End Dev",
  amount: 32
}];



const Activation = ({user}) => {
  const {db} = useAuth();
  const activateUserAccount = async(id) => {
    try {
      // Reference the user's document in Firestore
      const userDocRef = doc(db, "users", user.id);
  
      // Update the 'isActivated' field to true
      await updateDoc(userDocRef, { isActivated: true });
  
      // Notify the admin of success
      toast.success("User account activated successfully!");
    } catch (error) {
      // Handle any errors and notify the admin
      console.error("Error activating user account:", error);
      toast.error("Failed to activate user account. Please try again.");
    }
  }
  const deactivateUserAccount = async(id) => {
    try {
      // Reference the user's document in Firestore
      const userDocRef = doc(db, "users", user.id);
  
      // Update the 'isActivated' field to true
      await updateDoc(userDocRef, { isActivated: false });
  
      // Notify the admin of success
      toast.success("User account deactivated successfully!");
    } catch (error) {
      // Handle any errors and notify the admin
      console.error("Error deactivating user account:", error);
      toast.error("Failed to deactivate user account. Please try again.");
    }
  }

  return (
    <>
  <Card sx={{
    padding: 3
  }}>
    <ToastContainer />
      <FlexBetween mb={3}>
        <H6 fontSize={16}>User Activation</H6>
        <ButtonTwo>
          Account Status: {user.isActivated? "Active" : "Inactive"}
        </ButtonTwo>
      </FlexBetween>

      <Grid container spacing={2}>
        {
          user.isActivated ?  (<Button color="error" variant="contained" onClick={()=>deactivateUserAccount(user.id)}>
          Deactivate BDSP Agent 
        </Button>) :
     ( <Button color="warning" variant="contained" onClick={()=>activateUserAccount(user.id)}>
                Activate BDSP Agent
              </Button>)
        }
      </Grid>
    </Card>
    </>
    );
  }

export default Activation;