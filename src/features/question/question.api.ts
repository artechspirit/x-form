import { apiSlice } from "../api/apiSlice";

interface QuestionPayload {
  name: string;
  choice_type: string;
  choices: string[];
  is_required: boolean;
}

export const questionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFormQuestion: builder.mutation<
      unknown,
      { slug: string; data: QuestionPayload }
    >({
      query: ({ slug, data }) => ({
        url: `/forms/${slug}/questions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Form", id: slug },
      ],
    }),
    deleteFormQuestion: builder.mutation({
      query: ({ slug, id }) => ({
        url: `/forms/${slug}/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Form", id: slug },
      ],
    }),
  }),
});
export const { useCreateFormQuestionMutation, useDeleteFormQuestionMutation } =
  questionApi;
