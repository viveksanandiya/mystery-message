import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2, "Username should be atleast 2 character")
.max(20)
.regex(/^[a-zA-Z0-9_]+$/)

export const signupSchema = z.object({
    username :usernameValidation,
    email: z.email({ message: "invalid email"}).min(2),
    password: z.string().min(6).max(30),
    
})