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

export const cartSchema = z.object({
    productId: z.string().nonempty({message: "Product ID is required"}),
    quantity: z.number().nonnegative().min(1, {message: "Quantity must be at least 1"}).max(100, {message: "Quantity must be at most 100"}),
})

export const baseProductSchema = z.object({
    name: z.string({message: "product name is required"}).min(2, {message: "Product name must be at least 2 characters"}).max(100, {message: "Product name must be at most 100 characters"}),

    description: z.string({message: "Product description is required"}).min(5, {message: "Product description must be at least 5 characters"}).max(500, {message: "Product description must be at most 500 characters"}),

    price: z.number({message: "Product price is required"}).min(0, {message: "Product price must be a positive number"}),

    stock: z.number({message: "Product stock is required"}).min(0, {message: "Product stock must be a positive number"}),

    category: z.string({message: "Product category is required"}).min(2, {message: "Product category must be at least 2 characters"}).max(100, {message: "Product category must be at most 100 characters"}),       

    status: z.enum(["publish", "draft"], {
    error: () => ({ message: "Status must be either 'publish' or 'draft'" }),
  }),
})

export const backendProductSchema = baseProductSchema.extend({
    image: z.url({message: "url not valid"})
})

export const backendProductEditSchema = baseProductSchema.extend({
    image: z.url({message: "url not valid"})
})

export const categorySchema = z.object({
    name: z.string({message: "Category name is required"}).min(2, {message: "Category name must be at least 2 characters"}).max(100, {message: "Category name must be at most 100 characters"}),

    description: z.string({message: "Category description is required"}).min(5, {message: "Category description must be at least 5 characters"}).max(500, {message: "Category description must be at most 500 characters"}),    
})

export const createOrderSchema = z.object({
    cartItems:z.array(z.object({
        productId: z.string().nonempty({message: "Product ID is required"}),
        quantity: z.number().nonnegative().min(1, {message: "Quantity must be at least 1"}).max(100, {message: "Quantity must be at most 100"}),
    })),
    shippingAddress: z.string().min(5, {message: "Shipping address must be at least 5 characters"}).max(200, {message: "Shipping address must be at most 200 characters"}),
})