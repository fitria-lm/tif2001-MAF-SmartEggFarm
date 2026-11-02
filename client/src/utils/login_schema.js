import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username wajib diisi")
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

// Mengembalikan { success, data, errors } dengan satu pesan error per field.
export function validateLogin(values) {
  const result = loginSchema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }
  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (!errors[field]) errors[field] = issue.message;
  }
  return { success: false, data: null, errors };
}
