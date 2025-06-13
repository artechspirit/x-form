import type { CreateFormData } from "../../schemas";
import { apiSlice } from "../api/apiSlice";

interface FormData {
  id: number;
  name: string;
  slug: string;
  description: string;
  limit_one_response: boolean;
  creator_id: number;
}

interface BaseResponse {
  code: number;
  message: string;
  status: string;
}

interface Question {
  id: number;
  form_id: number;
  name: string;
  choice_type: "checkboxes" | "radio" | "select" | string;
  choices: string;
  is_required: boolean;
}

interface FormResponse extends BaseResponse {
  forms: FormData[];
}

interface FormDataDetail extends FormData {
  allowed_domains: string[];
  questions: Question[];
}

interface FormDetailResponse extends BaseResponse {
  form: FormDataDetail;
}

export const formApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<FormResponse, void>({
      query: () => "/forms",
      providesTags: ["Forms"],
    }),
    getFormBySlug: builder.query<FormDetailResponse, string>({
      query: (slug) => `/forms/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Form", id: slug }],
    }),
    createForm: builder.mutation<unknown, CreateFormData>({
      query: (body) => ({
        url: "/forms",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Forms"],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormBySlugQuery,
  useCreateFormMutation,
} = formApi;
