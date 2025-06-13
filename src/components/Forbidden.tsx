import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="80vh"
    >
      <LockOutlinedIcon style={{ fontSize: 100, color: "#d32f2f" }} />
      <Typography variant="h3" color="error" gutterBottom>
        403 - Forbidden
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        You don’t have permission to access this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go Back to Home
      </Button>
    </Box>
  );
};

export default Forbidden;
