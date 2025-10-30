export function generateFileName(extension = "") {
  const randomStr = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();
  return extension
    ? `${timestamp}-${randomStr}.${extension}`
    : `${timestamp}-${randomStr}`;
}
