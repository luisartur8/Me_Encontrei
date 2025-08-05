import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string'
    })
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
    .email({ message: "Invalid email format" }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    })
    .min(8, { message: "Password must be at least 8 characters long" })
});

export const loginSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string'
    })
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    })
    .min(8, { message: "Password must be at least 8 characters long" })
})

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
