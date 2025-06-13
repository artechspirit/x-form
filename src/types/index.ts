export interface ErrorResponse {
  status: number;
  data: {
    code: number;
    status: string;
    errors: unknown | null;
    message: string;
  };
}
