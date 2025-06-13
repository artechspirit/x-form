import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useLoginMutation } from "../../features/auth/auth.api";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { loginSuccess } from "../../features/auth/auth.slice";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../../schemas";
import { useState } from "react";

import { saveAuthToStorage } from "../../utils/tokenStorage";

import { isFetchBaseQueryError } from "../../utils/isFetchBaseQueryError";

export default function Login() {
  const [login] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

      dispatch(loginSuccess({ user: result?.user }));
      saveAuthToStorage(result?.user);
      navigate("/");
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errorResponse = error.data as { message: string };
        setErrorMessage(errorResponse.message);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom align="center">
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mb={3}
        >
          Please login to your account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 2, py: 1.3, textTransform: "none" }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
}
