import { styled, TextField, IconButton } from "@mui/material";
import useNavigate from "hooks/useNavigate";
import { FlexBox } from "components/flexbox";
import FormatBullets from "icons/FormatBullets";
import Apps from "icons/Apps";

const Wrapper = styled(FlexBox)(({ theme }) => ({
  alignItems: "center",
  ".select": {
    flex: "1 1 200px",
  },
  [theme.breakpoints.down(440)]: {
    ".navigation": {
      display: "none",
    },
  },
}));

const ProductTableActions = ({ handleChangeFilter, filter }) => {
  const navigate = useNavigate();

  return (
    <Wrapper gap={2} px={2} py={4}>
      {/* Search by Farmer Name */}
      <TextField
        fullWidth
        label="Search by Farmer Name"
        value={filter.farmerName}
        onChange={(e) => handleChangeFilter("farmerName", e.target.value)}
      />

      {/* Search by Crop Produced */}
      <TextField
        fullWidth
        label="Search by Crop Produced"
        value={filter.cropProduced}
        onChange={(e) => handleChangeFilter("cropProduced", e.target.value)}
        sx={{ ml: 2 }}
      />

      {/* Navigation Buttons */}
      <FlexBox alignItems="center" className="navigation">
        {/* List View Button */}
        <IconButton onClick={() => navigate("/dashboard/products/product-list-view")}>
          <FormatBullets color="primary" />
        </IconButton>

        {/* Grid View Button */}
        <IconButton onClick={() => navigate("/dashboard/products/product-grid-view")}>
          <Apps />
        </IconButton>
      </FlexBox>
    </Wrapper>
  );
};

export default ProductTableActions;
