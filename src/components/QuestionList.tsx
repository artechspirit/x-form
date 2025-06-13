import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export type Question = {
  id: number;
  name: string;
  choice_type: string;
  is_required: boolean;
  choices?: string;
};

export type Props = {
  questions: Question[];
  onDelete?: (id: number) => void;
};

export default function QuestionList({ questions, onDelete }: Props) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && selectedId !== null) {
      onDelete(selectedId);
    }
    setOpenConfirm(false);
    setSelectedId(null);
  };

  const handleCancel = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {questions.map((q) => (
        <Card key={q.id} variant="outlined">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">
                {q.name}
                {q.is_required && (
                  <Box component="span" sx={{ color: "red" }}>
                    *
                  </Box>
                )}
              </Typography>

              {/* Chip for choice type and delete action */}
              <Box display="flex" alignItems="center" gap={1}>
                <Chip label={q.choice_type} size="small" />
                {onDelete && (
                  <IconButton
                    aria-label="delete-question"
                    size="small"
                    onClick={() => handleDeleteClick(q.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Render choices if applicable */}
            {["multiple choice", "dropdown", "checkboxes"].includes(
              q.choice_type
            ) &&
              q.choices && (
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {q.choices.split(",").map((choice, idx) => (
                    <Chip key={idx} label={choice.trim()} variant="outlined" />
                  ))}
                </Box>
              )}
          </CardContent>
        </Card>
      ))}

      {questions.length === 0 && <Typography>No questions found</Typography>}

      <Dialog open={openConfirm} onClose={handleCancel}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this question?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
