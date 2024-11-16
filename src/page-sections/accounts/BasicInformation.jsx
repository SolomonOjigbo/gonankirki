import { Fragment, useContext } from "react";
import { Box, Button, Card, Divider, Grid, styled, TextField, useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { CameraAlt } from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik } from "formik";
import DateRange from "icons/DateRange";
import Bratislava from "icons/Bratislava";
import MapMarkerIcon from "icons/MapMarkerIcon";
import { AvatarBadge } from "components/avatar-badge";
import { FlexBetween, FlexBox } from "components/flexbox";
import { H6, Paragraph, Small } from "components/typography";
import { AvatarLoading } from "components/avatar-loading";
import { AuthContext } from "contexts/firebaseContext";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";

const ContentWrapper = styled(Box)(({ theme }) => ({
  zIndex: 1,
  marginTop: 55,
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 20,
    paddingRight: 20,
  },
}));

const CoverPicWrapper = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  height: 125,
  width: "100%",
  overflow: "hidden",
  position: "absolute",
  backgroundColor: theme.palette.background.default,
}));

const validationSchema = Yup.object({
  firstName: Yup.string().min(3, "Must be greater than 3 characters").required("First Name is Required!"),
  lastName: Yup.string().required("Last Name is Required!"),
  email: Yup.string().email("Invalid email address").required("Email is Required!"),
  phone: Yup.string().min(9).required("Phone Number is required!"),
  city: Yup.string().required("City is Required!"),
  state: Yup.string().required("State is Required!"),
  address: Yup.string().required("Address is Required!"),
});

const BasicInformation = () => {
  const { user, db } = useContext(AuthContext);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const theme = useTheme();

  const initialValues = {
    displayName: user.displayName || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    photoURL: user.avatar || "",
    city: user.city || "",
    state: user.state || "",
    address: user.address || "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (!currentUser) {
        toast.error('Admin not authenticated');
        return;
      }
      const userRef = doc(db, 'users', currentUser.uid);

      try {
        await setDoc(userRef, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          city: values.city,
          state: values.state,
          address: values.address,
          lastUpdated: format(new Date(), 'dd/MM/yyyy'),
        }, { merge: true });

        alert('User information updated successfully! Thank you!');
        toast('User information updated successfully! Thank you!');
      } catch (error) {
        console.error('Error updating document: ', error);
        toast.error('Failed to update information');
      }
    },
  });

  return (
    <Fragment>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      <Card sx={{ padding: 3, position: "relative" }}>
        <CoverPicWrapper>
          <img
            width="100%"
            height="100%"
            alt="Cover"
            src="/static/cover/user-cover-pic.png"
            style={{ objectFit: "cover" }}
          />
        </CoverPicWrapper>
        <ContentWrapper>
          <FlexBox justifyContent="center">
            <AvatarBadge
              badgeContent={
                <label htmlFor="icon-button-file">
                  <input type="file" accept="image/*" id="icon-button-file" style={{ display: "none" }} />
                  <IconButton aria-label="upload picture" component="span">
                    <CameraAlt sx={{ fontSize: 16, color: "grey.400" }} />
                  </IconButton>
                </label>
              }
            >
              <AvatarLoading borderSize={2} percentage={60} alt="User" src={user.avatar} sx={{ width: 100, height: 100 }} />
            </AvatarBadge>
          </FlexBox>

          <Box mt={2}>
         
            <H6 fontSize={18} textAlign="center">
              {user.displayName}
            </H6>

            <FlexBetween maxWidth={360} flexWrap="wrap" margin="auto" mt={1}>
              <FlexBox alignItems="center" gap={1} color="grey.500">
                <Bratislava sx={{ fontSize: 18 }} />
                <Paragraph>{user.role}</Paragraph>
              </FlexBox>

              <FlexBox alignItems="center" gap={1} color="grey.500">
                <MapMarkerIcon sx={{ fontSize: 18 }} />
                <Paragraph>{user.address}</Paragraph>
              </FlexBox>

              <FlexBox alignItems="center" gap={1} color="grey.500">
                <DateRange sx={{ fontSize: 18 }} />
                <Paragraph>{user.email}</Paragraph>
              </FlexBox>
            </FlexBetween>

            <FlexBetween marginTop={6} flexWrap="wrap">
              <Box minWidth={200} color="grey.500" sx={{ [theme.breakpoints.down(600)]: { minWidth: "100%", mb: 2 } }}>
                <Paragraph mb={0.5}>Profile Completion</Paragraph>
                <FlexBox alignItems="center" gap={1}>
                  <LinearProgress value={60} color="success" variant="determinate" />
                  <Small fontWeight={500}>60%</Small>
                </FlexBox>
              </Box>
            </FlexBetween>
          </Box>
        </ContentWrapper>
      </Card>

      <Card sx={{ mt: 3 }}>
        <H6 fontSize={14} px={3} py={2}>
          Basic Information
        </H6>

        <Divider />

        <form onSubmit={formik.handleSubmit}>
          <Box margin={3}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  helperText={formik.touched.email && formik.errors.email}
                  error={Boolean(formik.touched.email && formik.errors.email)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  helperText={formik.touched.phone && formik.errors.phone}
                  error={Boolean(formik.touched.phone && formik.errors.phone)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="city"
                  label="City/Town"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.city}
                  helperText={formik.touched.city && formik.errors.city}
                  error={Boolean(formik.touched.city && formik.errors.city)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="state"
                  label="State"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.state}
                  helperText={formik.touched.state && formik.errors.state}
                  error={Boolean(formik.touched.state && formik.errors.state)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  multiline
                  fullWidth
                  name="address"
                  label="Address"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  helperText={formik.touched.address && formik.errors.address}
                  error={Boolean(formik.touched.address && formik.errors.address)}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
                <Button variant="outlined" sx={{ ml: 2 }}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Card>
      <ToastContainer />
    </Fragment>
  );
};

export default BasicInformation;
