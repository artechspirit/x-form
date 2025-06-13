import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MemberStacksFormUI from "../pages/CreateForm";

export default function AddFormDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={toggleDrawer(true)}
      >
        Create New Form
      </Button>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: { xs: "100%", sm: 500 }, p: 3 }} role="presentation">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Create New Form</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <MemberStacksFormUI />
        </Box>
      </Drawer>
    </>
  );
}
