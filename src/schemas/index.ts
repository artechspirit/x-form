import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(5, "Min 5 characters")
    .required("Password is required"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

export const createFormSchema = yup.object({
  name: yup.string().required("Name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-zA-Z0-9.-]+$/,
      "Only letters, numbers, dashes (-), and dots (.) are allowed"
    ),
  allowed_domains: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
    )
    .min(1, "At least one domain is required")
    .required("Allowed domains is required"),
  description: yup.string().nullable().default(""),
  limit_one_response: yup.boolean().default(false),
});

export type CreateFormData = yup.InferType<typeof createFormSchema>;

export const QUESTION_TYPES_WITH_CHOICES = [
  "multiple choice",
  "dropdown",
  "checkboxes",
];

export const questionSchema = yup.object({
  name: yup.string().required("The name field is required."),
  choice_type: yup
    .string()
    .oneOf(
      ["short answer", "paragraph", "date", ...QUESTION_TYPES_WITH_CHOICES],
      "The choice type field is required."
    )
    .required("The choice type field is required."),
  choices: yup.array().when("choice_type", {
    is: (type: string) => QUESTION_TYPES_WITH_CHOICES.includes(type),
    then: (schema) =>
      schema
        .of(yup.string().required("Each choice must be a string."))
        .min(1, "At least one choice is required.")
        .required("The choices field is required."),
    otherwise: (schema) => schema.optional(),
  }),
  is_required: yup.boolean().required(),
});

export type QuestionFormData = yup.InferType<typeof questionSchema>;
