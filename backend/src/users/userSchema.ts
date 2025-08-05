import { z } from "zod";

export const idSchema = z.object({
    id: z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
    }).uuid({ message: 'ID must be a valid UUID' }),
});
