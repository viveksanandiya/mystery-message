import {z} from 'zod'

export const acceptMessageSchema = z.object({
    content: z.string().min(2).max(300)
})