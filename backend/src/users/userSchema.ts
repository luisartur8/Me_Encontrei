import { z } from "zod";

const createUserSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string'
    }),
    email: z.string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string'
    }).email(),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    }).min(6)
});

const loginSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string'
    }),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string'
    }).min(6, 'Password must be at least 6 characters long'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
