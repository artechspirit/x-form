import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import env from "../../config/env";
import { getAuthFromStorage } from "../../utils/tokenStorage";

const { API_BASE_URL } = env;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const user = getAuthFromStorage();
      if (user) {
        headers.set("Authorization", `Bearer ${user.accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Forms", "Response", "Form"],
  endpoints: () => ({}),
});
