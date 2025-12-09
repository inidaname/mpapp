interface BackendErrorResponse {
  message: string;
  code: string;
  errors?: {
    location: string;
    key: Record<string, string>;
  };
}

export const getErrorMessage = (error: unknown): string => {
  if ((error as APIData<BackendErrorResponse>).data) {
    const data = (error as APIData<BackendErrorResponse>)
      .data as BackendErrorResponse;

    if (data.errors?.key) {
      const validationMessages = Object.values(data.errors.key);

      if (validationMessages.length > 0) {
        return validationMessages.join('\n');
      }
    }

    if (data.message) {
      return data.message;
    }
  }

  return 'An unexpected error occurred. Please try again later.';
};
