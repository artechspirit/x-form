import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AddQuestionForm from "./AddQuestionForm";

export default function AddQuestionDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => setOpen(state);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={toggleDrawer(true)}
      >
        Add Question
      </Button>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: { xs: "100%", sm: 500 }, p: 3 }} role="presentation">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Add a Question</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <AddQuestionForm />
        </Box>
      </Drawer>
    </>
  );
}
