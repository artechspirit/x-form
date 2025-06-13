import { useParams } from "react-router-dom";
import { useGetFormBySlugQuery } from "../features/form/form.api";
import Forbidden from "../components/Forbidden";
import { isFetchBaseQueryError } from "../utils/isFetchBaseQueryError";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  Alert,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { useState } from "react";
import type { ErrorResponse } from "../types";
import AddQuestionDrawer from "../components/AddQuestionDrawer";
import QuestionList from "../components/QuestionList";
import { useDeleteFormQuestionMutation } from "../features/question/question.api";
import { useGetResponsesQuery } from "../features/response/response.api";
import ResponsesTable from "../components/ResponseTable";

const FormDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, error } = useGetFormBySlugQuery(slug || "");
  const { data: answers } = useGetResponsesQuery(slug!);
  const [deleteFormQuestion] = useDeleteFormQuestionMutation();
  const [copied, setCopied] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href.replace("/form-detail", "/form-response"))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Optional auto-close
      });
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteFormQuestion({ slug: slug!, id: String(id) }).unwrap();
      showSnackbar("Question deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete question", "error");
    }
  };

  if (isFetchBaseQueryError(error)) {
    if (error && (error as ErrorResponse).data.code === 403) {
      return <Forbidden />;
    }
  }

  return (
    data &&
    data.form && (
      <Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Typography variant="h4" gutterBottom>
          {data.form.name}{" "}
          <Tooltip title="Copy link to clipboard">
            <IconButton onClick={handleCopyLink}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </Typography>

        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {data.form.description}
        </Typography>

        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <Typography variant="body1">
            <strong>Slug:</strong> {data.form.slug}
          </Typography>

          <Typography variant="body1">
            <strong>Creator ID:</strong> {data.form.creator_id}
          </Typography>

          <Typography variant="body1">
            <strong>Limit One Response:</strong>{" "}
            {data.form.limit_one_response ? "Yes" : "No"}
          </Typography>

          <Typography variant="body1">
            <strong>Allowed Domains:</strong>{" "}
            {data?.form?.allowed_domains.length === 0
              ? "None"
              : data.form.allowed_domains.map((domain) => (
                  <Chip key={domain} label={domain} sx={{ mr: 1 }} />
                ))}
          </Typography>

          <Typography variant="body1">
            <strong>Questions:</strong>{" "}
            {data.form.questions.length > 0
              ? data.form.questions.length
              : "No questions"}
          </Typography>
          <AddQuestionDrawer />
        </Box>

        <Snackbar
          open={copied}
          message="Link copied!"
          autoHideDuration={2000}
        />

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Question List
        </Typography>
        <QuestionList
          questions={data.form.questions}
          onDelete={handleDeleteQuestion}
        />
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Responses
        </Typography>
        <ResponsesTable responses={answers?.responses} />
      </Box>
    )
  );
};

export default FormDetail;
