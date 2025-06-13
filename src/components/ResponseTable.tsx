import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import type { SingleResponse } from "../features/response/response.api";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
}

export interface Answers {
  [question: string]: string;
}

export interface Response {
  date: number;
  user: User;
  answers: Answers;
}

interface ResponsesTableProps {
  /**
   * Array of response objects to display in the table.
   */
  responses: SingleResponse[];
}

/**
 * Displays an overview table of form responses.
 *
 * @example
 * ```tsx
 * <ResponsesTable responses={data} />
 * ```
 */
export default function ResponsesTable({ responses }: ResponsesTableProps) {
  const renderAnswers = (answers: Answers) => {
    return Object.entries(answers).map(([question, response]) => (
      <Box key={question} mb={1}>
        <Typography variant="subtitle2">{question}</Typography>
        <Typography variant="body2" color="text.secondary">
          {response}
        </Typography>
      </Box>
    ));
  };

  if (!responses?.length) {
    return (
      <Typography variant="body1" color="text.secondary">
        No responses yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Total Responses: {responses.length}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Responses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.map((res, idx) => (
              <TableRow key={idx}>
                <TableCell>{res.user.name}</TableCell>
                <TableCell>{res.user.email}</TableCell>
                <TableCell>
                  {format(new Date(res.date), "yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell>{renderAnswers(res.answers)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
