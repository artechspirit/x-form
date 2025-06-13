import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateFormQuestionMutation } from "../features/question/question.api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  QUESTION_TYPES_WITH_CHOICES,
  questionSchema,
  type QuestionFormData,
} from "../schemas";

const CHOICE_TYPE_OPTIONS = [
  "short answer",
  "paragraph",
  "date",
  "multiple choice",
  "dropdown",
  "checkboxes",
];

export default function AddQuestionForm() {
  const { slug } = useParams<{ slug: string }>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createFormQuestion, { isLoading }] = useCreateFormQuestionMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(questionSchema),
    defaultValues: {
      name: "",
      choice_type: "",
      is_required: false,
      choices: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "choices",
  });

  const choiceType = watch("choice_type");

  const onSubmit = async (data: QuestionFormData) => {
    try {
      await createFormQuestion({
        slug: slug!,
        data: {
          ...data,
          choices: data.choices ?? [],
        },
      }).unwrap();
      setSuccessMessage("Add question success");
      reset({
        name: "",
        choice_type: "",
        is_required: true,
        choices: [],
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Add question failed");
    }
  };

  useEffect(() => {
    if (!QUESTION_TYPES_WITH_CHOICES.includes(choiceType)) {
      reset((prev) => ({ ...prev, choices: [] }));
    }
  }, [choiceType]);

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
    <Box>
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Question Name"
          fullWidth
          margin="normal"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Question Type"
          select
          fullWidth
          margin="normal"
          value={choiceType}
          {...register("choice_type")}
          error={!!errors.choice_type}
          helperText={errors.choice_type?.message}
        >
          {CHOICE_TYPE_OPTIONS.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {QUESTION_TYPES_WITH_CHOICES.includes(choiceType) && (
          <Box mt={2}>
            <Typography fontWeight="bold">Choices</Typography>
            {fields.map((field, index) => (
              <Box display="flex" gap={1} mt={1} key={field.id}>
                <TextField
                  fullWidth
                  {...register(`choices.${index}`)}
                  error={!!errors.choices?.[index]}
                  helperText={
                    Array.isArray(errors.choices) &&
                    errors.choices[index]?.message
                      ? String(errors.choices[index]?.message)
                      : ""
                  }
                />
                <IconButton onClick={() => remove(index)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => append("")}
              sx={{ mt: 1 }}
            >
              Add Choice
            </Button>
            {errors.choices?.message && (
              <Typography color="error">{errors.choices.message}</Typography>
            )}
          </Box>
        )}

        <FormControlLabel
          control={
            <Switch
              {...register("is_required")}
              checked={watch("is_required")}
              onChange={(e) => setValue("is_required", e.target.checked)}
            />
          }
          label="Required"
        />

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={16} />}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
