// Custom error type that extends the native Error to carry an HTTP status code
export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (statusCode: number, message: string): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};
