import { email, z } from "zod";
export const userRegisterSchema = z.object({
    name: z.string().min(2 ,{message: "Name must be at least 2 characters"}).max(50, {message: "Name must be at most 50 characters"}),

    email: z.string().nonempty({message: "Email is required"}).email({message: "Invalid email address"}),

    password: z.string().min(5).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/, {message: "Password must be at least 5 characters long and contain at least one letter and one number"}),
})

export const userLoginSchema = z.object({
    email: z.string().nonempty({message: "Email is required"}).email({message: "Invalid email address"}),   
    password: z.string().min(5, {message: "Password must be at least 5 characters long"}).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/, {message: "Password must contain at least one letter and one number"}),  
})