import * as z from "zod";

export const SignUpSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be atleast 3 characters" }),
  email: z
    .email({ message: "Enter a valid email" })
    .nonempty({ message: "Email is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be atleast 6 characters" }),
});

export type SignUpForm = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  email: z
    .email({ message: "Enter a valid email" })
    .nonempty({ message: "Email is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be atleast 6 characters" }),
});
export type LoginForm = z.infer<typeof LoginSchema>;

export const newFileSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be atleast 3 characters" }),
  duedate: z.string().nullable().optional(),
  sender: z.string().nullable().optional(),
  receiver: z.string().nullable().optional(),
  important: z.boolean().optional(),
  visible: z.boolean().optional(),
  category_id: z.string().nonempty({ message: "Please choose category" }),
  department_ids: z.array(z.uuid()).optional(),
  path: z.string().min(1, "File is required"),
  filetype: z.string(),
  inboxoroutbox: z.string(),
  size: z.number(),
  created_at: z.string().optional()
});
export type newFile = z.infer<typeof newFileSchema>;

export const UserRoleEnum = z.string();
export const UserSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be atleast 3 characters" }),
  email: z
    .email({ message: "Enter a valid email" })
    .nonempty({ message: "Email is required" }),
  role: UserRoleEnum.default("user").nullable().optional(),
  department_ids: z.array(z.uuid()).optional(),
  phone: z.string().min(1, "Phone is required"),
  university: z.string().min(1, "University is required"),
});
export type profile = z.infer<typeof UserSchema>;

export const PasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((a) => a.newPassword === a.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });
export type password = z.infer<typeof PasswordSchema>;

export const updateFileSchema = z.object({
  // id: z.string().optional(),
  name: z.string().min(1, "File name is required"),
  category_id: z.string().min(1, "Category is required"),
  department_ids: z.array(z.string()).min(1, "Select at least one department"),
  duedate: z.string().optional(),
  sender: z.string().optional(),
  receiver: z.string().optional(),
  visible: z.boolean(),
  important: z.boolean(),
  inboxoroutbox: z.string(),
});
export type updateFile = z.infer<typeof updateFileSchema>;