import { Box, IconButton, TextField, InputAdornment } from "@mui/material";
import Search from "@mui/icons-material/Search";
import useNavigate from "hooks/useNavigate";
import useLocation from "hooks/useLocation";
import { FlexBetween } from "components/flexbox";
import Apps from "icons/Apps";
import FormatBullets from "icons/FormatBullets";

const SearchArea = ({ filters, onFilterChange, gridRoute, listRoute }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeColor = (path) => (pathname === path ? "primary.main" : "grey.400");

  const handleInputChange = (key) => (event) => {
    onFilterChange(key, event.target.value);
  };

  return (
    <FlexBetween gap={1} my={3}>
      {/* SEARCH INPUTS */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} width="100%">
        <TextField
          value={filters.farmerName}
          onChange={handleInputChange("farmerName")}
          placeholder="Search by Farmer Name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 400 }}
        />
        <TextField
          value={filters.cropProduced}
          onChange={handleInputChange("cropProduced")}
          placeholder="Search by Crop Produced..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 400 }}
        />
      </Box>

      {/* NAVIGATION BUTTONS */}
      <Box flexShrink={0} className="actions">
        <IconButton onClick={() => navigate(listRoute)}>
          <FormatBullets sx={{ color: activeColor(listRoute) }} />
        </IconButton>
        <IconButton onClick={() => navigate(gridRoute)}>
          <Apps sx={{ color: activeColor(gridRoute) }} />
        </IconButton>
      </Box>
    </FlexBetween>
  );
};

export default SearchArea;
