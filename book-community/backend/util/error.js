export function throwError(message, statusCode, data) {
  const error = new Error(message || "An error occured");
  error.status = statusCode || null;
  error.data = data || null;
  throw error;
}
