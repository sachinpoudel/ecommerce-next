import { createOrderSchema } from "../zodSchema";

export const createOrder =async ({data,userId}:{data:any,userId:string}) =>{

    try {
        const {shippingAddress, cartItems,notes} = data;

        const validateData = createOrderSchema.safeParse(data)
        if(!validateData.success){
            const msg = validateData.error.issues.map(issue => issue.message).join(", ");
            return {
                success: false,
                message: msg || "Invalid data"
            } 
        }
    } catch (error) {
        
    }
}