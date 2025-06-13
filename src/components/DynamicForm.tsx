/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Stack,
  Button,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateResponseMutation } from "../features/response/response.api";
import { transformAnswers } from "../utils/transformResponse";

export type Question = {
  id: number;
  name: string;
  choice_type: string;
  choices: string; // koma‑dipisah
  is_required: boolean;
};

type Props = {
  questions: Question[];
};

export default function DynamicForm({ questions }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [createResponse] = useCreateResponseMutation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const schema = useMemo(() => {
    const shape: Record<string, yup.AnySchema> = {};

    questions.forEach((q) => {
      const key = String(q.id); // gunakan id sbg key form
      const base = yup.mixed();
      if (!q.is_required) {
        shape[key] = base.notRequired(); // optional
        return;
      }

      switch (q.choice_type) {
        case "short answer":
        case "paragraph":
        case "date":
          shape[key] = yup.string().trim().required("This field is required");
          break;

        case "dropdown":
        case "multiple choice":
          shape[key] = yup.string().required("Please select one");
          break;

        case "checkboxes":
          shape[key] = yup
            .array()
            .of(yup.string())
            .min(1, "Select at least one option");
          break;

        default:
          shape[key] = base; // fallback
      }
    });

    return yup.object().shape(shape);
  }, [questions]);

  const defaultValues = useMemo<Record<string, any>>(() => {
    const obj: Record<string, any> = {};
    questions.forEach((q) => {
      obj[String(q.id)] = q.choice_type === "checkboxes" ? [] : ""; // array utk checkbox, string utk lain
    });
    return obj;
  }, [questions]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Record<string, any>>({
    resolver: yupResolver(schema),
    mode: "onChange", // update isValid saat field berubah
    defaultValues, // form kosong dulu
  });

  const submit = async (data: Record<number, any>) => {
    try {
      await createResponse({
        slug: slug!,
        data: transformAnswers(data),
      }).unwrap();
      setSuccessMessage("Response submitted successfully");
      reset(defaultValues);
    } catch (error) {
      setErrorMessage("Something went wrong");
      console.error(error);
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
    <form onSubmit={handleSubmit(submit)}>
      {successMessage && (
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage(null)}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      )}
      <Stack spacing={3}>
        {questions.map((q) => {
          const idKey = String(q.id);
          const choices = q.choices?.split(",").map((c) => c.trim()) ?? [];

          return (
            <Card key={q.id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {q.name}
                  {q.is_required && (
                    <Box component="span" color="error.main">
                      {" "}
                      *
                    </Box>
                  )}
                </Typography>

                {/* ---- short answer / paragraph ---- */}
                {["short answer", "paragraph"].includes(q.choice_type) && (
                  <Controller
                    control={control}
                    name={idKey}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline={q.choice_type === "paragraph"}
                        minRows={q.choice_type === "paragraph" ? 4 : 1}
                        placeholder="Your answer"
                        error={!!errors[idKey]}
                        helperText={errors[idKey]?.message as string}
                      />
                    )}
                  />
                )}

                {/* ---- date ---- */}
                {q.choice_type === "date" && (
                  <Controller
                    control={control}
                    name={idKey}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        error={!!errors[idKey]}
                        helperText={errors[idKey]?.message as string}
                      />
                    )}
                  />
                )}

                {/* ---- dropdown ---- */}
                {q.choice_type === "dropdown" && (
                  <Controller
                    control={control}
                    name={idKey}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors[idKey]}>
                        <Select
                          {...field}
                          displayEmpty
                          renderValue={(v) => (v ? v : "Select an option")}
                        >
                          <MenuItem value="" disabled>
                            Select an option
                          </MenuItem>
                          {choices.map((c, idx) => (
                            <MenuItem key={idx} value={c}>
                              {c}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="error">
                          {errors[idKey]?.message as string}
                        </Typography>
                      </FormControl>
                    )}
                  />
                )}

                {/* ---- multiple choice (checkbox) ---- */}
                {q.choice_type === "multiple choice" && (
                  <Controller
                    control={control}
                    name={idKey}
                    render={({ field }) => (
                      <FormControl error={!!errors[idKey]}>
                        <RadioGroup {...field}>
                          {choices.map((c, idx) => (
                            <FormControlLabel
                              key={idx}
                              value={c}
                              control={<Radio />}
                              label={c}
                            />
                          ))}
                        </RadioGroup>
                        <Typography variant="caption" color="error">
                          {errors[idKey]?.message as string}
                        </Typography>
                      </FormControl>
                    )}
                  />
                )}

                {/* ---- checkboxes ---- */}
                {q.choice_type === "checkboxes" && (
                  <Controller
                    control={control}
                    name={idKey}
                    defaultValue={[]}
                    render={({ field }) => (
                      <FormControl error={!!errors[idKey]}>
                        <Stack>
                          {choices.map((c, idx) => (
                            <FormControlLabel
                              key={idx}
                              control={
                                <Checkbox
                                  checked={field.value.includes(c)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const newArr = checked
                                      ? [...field.value, c]
                                      : field.value.filter(
                                          (v: string) => v !== c
                                        );
                                    field.onChange(newArr);
                                  }}
                                />
                              }
                              label={c}
                            />
                          ))}
                        </Stack>
                        <Typography variant="caption" color="error">
                          {errors[idKey]?.message as string}
                        </Typography>
                      </FormControl>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* ---- Tombol Submit ---- */}
        {questions.length > 0 && (
          <Box textAlign="center">
            <Button
              sx={{ width: "100%" }}
              type="submit"
              variant="contained"
              disabled={!isValid || isSubmitting}
            >
              Submit
            </Button>
          </Box>
        )}
      </Stack>
    </form>
  );
}
