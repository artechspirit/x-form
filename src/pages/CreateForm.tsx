import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Autocomplete,
  Alert,
  Switch,
} from "@mui/material";
import { createFormSchema } from "../schemas";
import type { CreateFormData } from "../schemas";
import { useCreateFormMutation } from "../features/form/form.api";
import { isFetchBaseQueryError } from "../utils/isFetchBaseQueryError";
import { useEffect, useState } from "react";

const MemberStacksFormUI = () => {
  const [createForm, { isLoading }] = useCreateFormMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateFormData>({
    defaultValues: {
      name: "",
      slug: "",
      allowed_domains: ["webtech.id"],
      description: "",
      limit_one_response: false,
    },
    resolver: yupResolver(createFormSchema),
  });

  // Watch allowed_domains separately because Autocomplete is uncontrolled
  const allowedDomains = watch("allowed_domains");

  const onSubmit = async (data: CreateFormData) => {
    try {
      await createForm(data).unwrap();
      setSuccessMessage("Create form success");
      reset();
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errorResponse = error.data as { message: string };
        setErrorMessage(errorResponse.message || "Create form failed");
      }
    }
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 500, mx: "auto" }}
    >
      {/* Success */}
      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Error Snackbar */}
      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage(null)}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      )}

      <TextField
        label="Name"
        fullWidth
        margin="normal"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        label="Slug"
        fullWidth
        margin="normal"
        {...register("slug")}
        error={!!errors.slug}
        helperText={errors.slug?.message}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={allowedDomains}
        onChange={(_, newValue) =>
          setValue("allowed_domains", newValue, { shouldValidate: true })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Allowed Domains"
            margin="normal"
            error={!!errors.allowed_domains}
            helperText={
              Array.isArray(errors.allowed_domains)
                ? errors.allowed_domains[0]?.message
                : typeof errors.allowed_domains?.message === "string"
                ? errors.allowed_domains?.message
                : undefined
            }
          />
        )}
      />

      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      <FormControlLabel
        control={
          <Switch
            {...register("limit_one_response")}
            checked={watch("limit_one_response")}
            onChange={(e) => setValue("limit_one_response", e.target.checked)}
          />
        }
        label="Limit to one response"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Form"}
      </Button>
    </Box>
  );
};

export default MemberStacksFormUI;
