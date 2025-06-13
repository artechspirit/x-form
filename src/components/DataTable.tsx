import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import { useState } from "react";

interface DataRow {
  id: number;
  name: string;
  slug: string;
  description: string;
  limit_one_response: boolean;
  creator_id: number;
}

interface DataTableProps {
  rows: DataRow[];
  onViewDetail?: (slug: string) => void;
  onFillForms?: (slug: string) => void;
}

export default function DataTable({
  rows,
  onViewDetail,
  onFillForms,
}: DataTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader aria-label="data table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Limit One Response</TableCell>
              <TableCell>Creator ID</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.slug}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.limit_one_response ? "Yes" : "No"}</TableCell>
                  <TableCell>{row.creator_id}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onViewDetail?.(row.slug)}
                    >
                      Lihat Detail
                    </Button>
                    <Button
                      sx={{ ml: 1 }}
                      variant="outlined"
                      size="small"
                      onClick={() => onFillForms?.(row.slug)}
                    >
                      Fill the form
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[7, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
