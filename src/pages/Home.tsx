import { Box, Grid } from "@mui/material";
import { useGetFormsQuery } from "../features/form/form.api";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import AddFormDrawer from "../components/CreateFormDrawer";

const Home = () => {
  const { data } = useGetFormsQuery();
  const navigate = useNavigate();

  const handleViewDetail = (slug: string) => {
    navigate(`/form-detail/${slug}`);
  };

  const handleFillForm = (slug: string) => {
    navigate(`/form-response/${slug}`);
  };

  return (
    <Grid container spacing={2}>
      <Box display="flex" flexDirection="row" justifyContent="end" width="100%">
        <AddFormDrawer />
      </Box>
      {data?.forms && (
        <DataTable
          rows={data.forms}
          onViewDetail={handleViewDetail}
          onFillForms={handleFillForm}
        />
      )}
    </Grid>
  );
};

export default Home;
