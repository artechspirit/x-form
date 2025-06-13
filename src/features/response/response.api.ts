import { apiSlice } from "../api/apiSlice";

interface AnswerPayload {
  question_id: number;
  value: string;
}

interface CreateResponsePayload {
  slug: string;
  data: {
    answers: AnswerPayload[];
  };
}

interface CreateResponseResult {
  message: string; // "Submit response success"
}

interface UserSnippet {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
}

export interface SingleResponse {
  date: string;
  user: UserSnippet;
  answers: Record<string, string>;
}

interface GetResponsesResult {
  message: string;
  responses: SingleResponse[];
}

export const responseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResponses: builder.query<GetResponsesResult, string>({
      query: (slug) => `/forms/${slug}/responses`,
      providesTags: (result, error, slug) => [
        { type: "Response" as const, id: slug },
      ],
    }),

    createResponse: builder.mutation<
      CreateResponseResult,
      CreateResponsePayload
    >({
      query: ({ slug, data }) => ({
        url: `/forms/${slug}/responses`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Response" as const, id: slug },
      ],
    }),
  }),
});

export const { useGetResponsesQuery, useCreateResponseMutation } = responseApi;
