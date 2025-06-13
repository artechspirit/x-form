import { useParams } from "react-router-dom";
import { useGetFormBySlugQuery } from "../features/form/form.api";
import { isFetchBaseQueryError } from "../utils/isFetchBaseQueryError";
import type { ErrorResponse } from "../types";
import Forbidden from "../components/Forbidden";
import DynamicForm from "../components/DynamicForm";
import { Box, Chip, Divider, Typography } from "@mui/material";
import { getAuthFromStorage } from "../utils/tokenStorage";

const user = getAuthFromStorage();
const FormResponse = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, error } = useGetFormBySlugQuery(slug || "");

  if (isFetchBaseQueryError(error)) {
    if (error && (error as ErrorResponse).data.code === 403) {
      return <Forbidden />;
    }
  }

  return (
    <>
      {data && data.form && (
        <Box>
          <Typography variant="h4" gutterBottom>
            {data.form.name}{" "}
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {data.form.description}
          </Typography>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
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
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Question List
          </Typography>
        </Box>
      )}
      {data?.form.questions.length === 0 && (
        <Typography variant="h6" mb={1}>
          No questions found
        </Typography>
      )}
      {data?.form.questions && <DynamicForm questions={data.form.questions} />}
    </>
  );
};

export default FormResponse;
